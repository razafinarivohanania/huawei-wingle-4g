import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter, toTwo } from '../../utils/StringUtils';
import Connection from "../../connection/Connection";

const SLEEP_DURATION = 5000;
const MAX_TRY_VERIFYING_SMS_SENT = 100;

export default class {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login) {
        this.login = login;
        this.connection = login.getConnnection();
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.login.activeLog(activeLog);
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async sendSms(phoneNumbers: string | string[], content: string): Promise<Map<string, boolean>> {
        const parameters = this.buildParameters(phoneNumbers, content);

        await this.connection.openHomePage();
        await this.login.login();

        const response = await this.connection.post('/api/sms/send-sms', parameters);
        if (!Connection.isSuccess(response)) {
            throw new Error('Unable to send SMS');
        }

        return this.verifySmsSent();
    }

    private buildParameters(phoneNumbers: string | string[], content: string): string {
        let numbers : string[] = [];
        if (Array.isArray(phoneNumbers)) {
            phoneNumbers.forEach(phoneNumber => numbers.push(phoneNumber));
        } else {
            numbers.push(phoneNumbers);
        }

        numbers = numbers.filter(phone => phone);
        if (!numbers.length) {
            throw new Error('No phone number provided');
        }

        if (!content) {
            throw new Error('No content SMS provided');
        }

        if (content.length > 160) {
            throw new Error('Content SMS length cannot be upper than 160');
        }

        const phones = numbers.map(phoneNumber => `<Phone>${phoneNumber}</Phone>`).join('');
        const date = this.getDate();
        return `<?xml version: "1.0" encoding="UTF-8"?><request><Index>-1</Index><Phones>${phones}</Phones><Sca></Sca><Content>${content}</Content><Length>${content.length}</Length><Reserved>1</Reserved><Date>${date}</Date></request>`
    }

    private getDate(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = toTwo(date.getMonth() + 1);
        const day = toTwo(date.getDate());

        const hours = toTwo(date.getHours());
        const minutes = toTwo(date.getMinutes());
        const secondes = toTwo(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${secondes}`;
    }

    private async verifySmsSent(): Promise<Map<string, boolean>> {
        const results: Map<string, boolean> = new Map();

        for (let i = 0; i < MAX_TRY_VERIFYING_SMS_SENT; i++) {
            this.logger.debug(`Attempt to verify SMS sent with retry : ${i}`);

            const statusDocument = await this.getStatusDocument();
            if (this.allDone(statusDocument)) {
                const successPhoneNumbers = this.getPhoneNumbersInDocument(statusDocument, true);
                successPhoneNumbers.forEach(successPhoneNumber => results.set(successPhoneNumber, true));
                this.logger.debug(`Success phone numbers count : ${successPhoneNumbers.length}`);

                const failedPhoneNumbers = this.getPhoneNumbersInDocument(statusDocument, false);
                failedPhoneNumbers.forEach(failedPhoneNumber => results.set(failedPhoneNumber, false));
                this.logger.debug(`Failed phone numbers count : ${failedPhoneNumbers.length}`);
                return results;
            }

            await this.sleep();
        }

        throw new Error(`Attempt to verify SMS sent reached max authorised : ${MAX_TRY_VERIFYING_SMS_SENT}`);
    }

    private sleep(): Promise<void> {
        return new Promise(resolve => setTimeout(() => resolve(), SLEEP_DURATION));
    }

    private async getStatusDocument(): Promise<Document> {
        const response = await this.connection.get('/api/sms/send-status');
        return response.document;
    }

    private allDone(statusDocument: Document): boolean {
        const phoneElement = statusDocument.querySelector('Phone');
        if (!phoneElement) {
            throw new Error('Unable to determinate if all done or not');
        }

        return phoneElement.textContent === '';
    }

    private getPhoneNumbersInDocument(statusDocument: Document, isSuccessContext: boolean): string[] {
        const selector = isSuccessContext ? 'SucPhone' : 'FailPhone';
        const phoneNumbers = statusDocument.querySelector(selector)?.textContent;
        return phoneNumbers ? phoneNumbers.split(',') : [];
    }
}