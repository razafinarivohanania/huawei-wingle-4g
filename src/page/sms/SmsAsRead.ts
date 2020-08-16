import Login from "../../connection/Login"
import Connection from "../../connection/Connection";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

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
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
    }

    async setSmsAsRead(smsId: string): Promise<void> {
        const parameters = this.buildParameters(smsId);

        await this.connection.openHomePage();
        await this.login.login();

        const response = await this.connection.post('/api/sms/set-read', parameters);
        if (Connection.isSuccess(response)) {
            this.logger.debug('SMS set as read with success');
        } else {
            throw new Error('Unable to set SMS as read');
        }
    }

    private buildParameters(smsId: string): string {
        if (!smsId) {
            throw new Error('SMS ID is mandatory');
        }

        return `<?xml version: "1.0" encoding="UTF-8"?><request><Index>${smsId}</Index></request>`;
    }
}