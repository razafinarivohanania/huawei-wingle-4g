import Login from "../../connection/Login";
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
        this.login.activeLog(activeLog);
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async removeSms(smsIds: string | string[]): Promise<void> {
        const parameters = this.buildParameters(smsIds);

        await this.connection.openHomePage();
        await this.login.login();

        const response = await this.connection.post('/api/sms/delete-sms', parameters);
        if (Connection.isSuccess(response)) {
            this.logger.debug('Removing SMS done with success');
        } else {
            throw new Error(`Unable to remove SMS`);
        }
    }

    private buildParameters(smsIds: string | string[]): string {
        let ids: string[] = [];

        if (Array.isArray(smsIds)) {
            smsIds.forEach(smsId => ids.push(smsId));
        } else {
            ids.push(smsIds);
        }

        ids = ids.filter(id => id);
        if (!ids.length) {
            throw new Error('No SMS id provided');
        }

        const indices = ids.map(id => `<Index>${id}</Index>`).join('');
        return `<?xml version: "1.0" encoding="UTF-8"?><request>${indices}</request>`;
    }
}