import Connection from "../../connection/Connection";
import NetworktExtractor from "./NetworkExtractor";
import { State } from "../../model/home/State";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import Login from '../../connection/Login';

export default class {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login, connection: Connection, activeLog: boolean) {
        this.login = login;
        this.connection = connection;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async connect(): Promise<void> {
        await this.connection.get('/');

        if (await this.isConnected()) {
            this.logger.debug(`Already connected, no need to connect`);
            return;
        }

        await this.login.login();
        if (await this.switchDataMobile(true)) {
            this.logger.debug('Connecting data mobile with success');
            return;
        }

        throw new Error('Unable to connect data mobile');
    }

    async disconnect(): Promise<void> {
        await this.connection.get('/');

        if (!(await this.isConnected())) {
            this.logger.debug(`Already disconnected, no need to disconnect`);
            return;
        }

        await this.login.login();
        if (await this.switchDataMobile(false)) {
            this.logger.debug('Disconnecting data mobile with success');
            return;
        }

        throw new Error('Unable to disconnect data mobile');
    }

    private async isConnected(): Promise<boolean> {
        const response = await this.connection.get('/api/monitoring/status');
        const document = response.document;
        const state = await NetworktExtractor.getState(document);
        switch (state) {
            case State.CONNECTED:
            case State.CONNECTING:
                return true;
            case State.DISCONNECTED:
            case State.DISCONNECTING:
                return false;
            default:
                throw new Error(`Unable to determinate if is is connected or not from state : ${state}`);
        }
    }

    private async switchDataMobile(isToConnect: boolean): Promise<boolean> {
        const dataSwitch = isToConnect ? 1 : 0;
        const parameters = `<?xml version: "1.0" encoding="UTF-8"?><request><dataswitch>${dataSwitch}</dataswitch></request>`;

        const response = await this.connection.post('/api/dialup/mobile-dataswitch', parameters);
        return Connection.isSuccess(response);
    }
}