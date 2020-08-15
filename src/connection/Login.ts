import Connection from "./Connection";

import log4js, { Logger } from 'log4js';
import { substringAfter } from '../utils/StringUtils';
import base64encode from '../third-party/huawei/base64encode';
import sha256 from '../third-party/huawei/sha256';
import Response from './Response';

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

    async login(): Promise<void> {
        if (await this.isLogged()) {
            this.logger.debug(`Already logged, no need to login`);
            return;
        }

        const parameters = this.buildLoginParameters();
        const headers = {
            __RequestVerificationToken: this.connection.getTokens().requestVerificationToken
        };

        const response = await this.connection.post('/api/user/login', parameters, headers);
        if (!this.isSuccess(response)) {
            throw new Error(`Login failed`);
        }

        this.logger.debug('Login success');
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

    private buildLoginParameters() {
        const encryptedPassword = this.encryptPassword(this.connection.getTokens().requestVerificationToken);
        return `<?xml version: "1.0" encoding="UTF-8"?><request><Username>${this.username}</Username><Password>${encryptedPassword}</Password><password_type>4</password_type></request>`;
    }

    private encryptPassword(requestVerificationToken: string): string {
        if (!requestVerificationToken) {
            throw new Error('Request verification token is blank');
        }

        if (!this.username) {
            throw new Error('Username is blank');
        }

        if (!this.password) {
            throw new Error('Password is blank');
        }

        return base64encode(sha256(this.username + base64encode(sha256(this.password)) + requestVerificationToken));
    }

    private isSuccess(response: Response): boolean {
        return response.document.querySelector('response')?.textContent === 'OK';
    }
}