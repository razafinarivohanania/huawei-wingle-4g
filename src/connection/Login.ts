import Connection from "./Connection";

import log4js, { Logger } from 'log4js';
import { substringAfter } from '../utils/StringUtils';

export default class {

    private username: string;
    private password: string;
    private logger: Logger;
    private connection: Connection;

    constructor(username: string, password: string, connection: Connection, activeLog: boolean) {
        this.username = username;
        this.password = password;
        this.connection = connection;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    private async login(): Promise<void> {
        if (await this.isLogged()) {
            return;
        }

        const tokens = this.connection.getTokens();
        this.logger.debug(tokens);
    }

    private async isLogged(): Promise<boolean> {
        const response = await this.connection.get('/api/user/state-login');
        const state = response.document.querySelector('State')?.textContent;

        switch (state) {
            case '-1':
                return false;
            case '0':
                return true;
            default:
                throw new Error('Unable to derminate if logged or not');
        }
    }
}