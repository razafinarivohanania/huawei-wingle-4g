import Connection from "../../connection/Connection";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

export default class {

    private login: Login;
    private logger: Logger;

    constructor(login: Login) {
        this.login = login;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
    }

    async sendUssd(ussd: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }

    async reply(response: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }
};