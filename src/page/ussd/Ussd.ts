import Connection from "../../connection/Connection";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

const SLEEP_DURATION = 5000;
const MAX_TRY_RETRIEVING_REMOTE_RESPONSE = 100;

export class Ussd {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login) {
        this.login = login;
        this.connection = login.getConnnection();
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
    }

    async sendUssd(ussd: string): Promise<string> {
        if (!ussd) {
            throw new Error('USSD is blank');
        }

        await this.connection.openHomePage();
        await this.login.login();

        return this.reply(ussd);
    }

    async reply(response: string): Promise<string> {
        if (!response) {
            throw new Error('Response for reply is blank');
        }

        const paramaters = `<?xml version: "1.0" encoding="UTF-8"?><request><content>${response}</content><codeType>CodeType</codeType><timeout></timeout></request>`;
        const result = await this.connection.post('/api/ussd/send', paramaters);
        if (!Connection.isSuccess(result)) {
            throw new Error('Unable to send USSD');
        }

        return this.retrieveResponseFromRemote();
    }

    private async retrieveResponseFromRemote(): Promise<string> {
        for (let i = 0; i < MAX_TRY_RETRIEVING_REMOTE_RESPONSE; i++) {
            this.logger.debug(`Attempt to retrieve response from remote wity retry : ${i}`);

            const response = await this.connection.get('/api/ussd/get');
            const document = response.document;
            const code = document.querySelector('code')?.textContent;
            if (code && code !== '111019') {
                throw new Error(`Unable to interpret code sent by remote : ${code}`);
            }

            const contentElement = document.querySelector('content');
            if (contentElement) {
                const content = contentElement.textContent ? contentElement.textContent :  '';
                this.logger.debug(`USSD response : ${content}`);
                return content;
            }

            await this.sleep();
        }

        throw new Error(`Attempting to retrieve response from remote reached max authorized retries : ${MAX_TRY_RETRIEVING_REMOTE_RESPONSE}`);
    }

    private sleep(): Promise<void> {
        return new Promise(resolve => setTimeout(() => resolve(), SLEEP_DURATION));
    }
};