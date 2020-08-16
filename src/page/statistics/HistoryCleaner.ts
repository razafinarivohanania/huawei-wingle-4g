import Connection from "../../connection/Connection";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import Login from "../../connection/Login";

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

    async clearHistory() : Promise<void> {
        await this.connection.get('/');
        await this.login.login();

        const parameters = '<?xml version: "1.0" encoding="UTF-8"?><request><ClearTraffic>1</ClearTraffic></request>';
        const response = await this.connection.post('/api/monitoring/clear-traffic', parameters);
        if (!Connection.isSuccess(response)) {
            throw new Error('Unable to clear statistics history');
        }

        this.logger.debug('Stastistics history clear with success');
    }
}