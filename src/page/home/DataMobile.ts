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

    async connect(): Promise<boolean> {
        await this.connection.get('/');

        if (await this.isConnected()) {
            this.logger.debug(`Already connected, no need to connect`);
            return true;
        }

        await this.login.login();
        await this.switchDataMobile(true);

        return false;
    }

    async disconnect(): Promise<boolean> {
        await this.connection.get('/');

        if (await this.isConnected()) {
            return false;
        }

        //TODO
        this.logger.debug(`Already disconnected, no need to disconnect`);
        return true;
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

    private async switchDataMobile(isToConnect: boolean): Promise<void> {
        const dataSwitch = isToConnect ? 1 : 0;
        const parameters = `<?xml version: "1.0" encoding="UTF-8"?><request><dataswitch>${dataSwitch}</dataswitch></request>`;

    }
}