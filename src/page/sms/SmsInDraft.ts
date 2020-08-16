import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter, toTwo } from '../../utils/StringUtils';
import Connection from "../../connection/Connection";

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

    async saveSmsInDraft(phoneNumbers: string | string[], content: string): Promise<void> {
        const parameters = this.buildParameters(phoneNumbers, content);

        await this.connection.openHomePage();
        await this.login.login();

        const response = await this.connection.post('/api/sms/save-sms', parameters);
        if (Connection.isSuccess(response)) {
            this.logger.debug('Saving SMS in draft done with success');
        } else {
            throw new Error('Unabel to save SMS in draft');
        }
    }

    private buildParameters(phoneNumbers: string | string[], content: string): string {
        let numbers = [];
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

        const phones = numbers.map(number => `<Phone>${number}</Phone>`).join('');
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
}