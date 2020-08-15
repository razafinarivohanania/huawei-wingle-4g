import Connection from "../../connection/Connection";
import NetworktExtractor from "./NetworkExtractor";
import { State } from "../../model/home/State";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

export default class {

    private username: string;
    private password: string;
    private connection: Connection;
    private logger: Logger;

    constructor(username: string, password: string, connection: Connection, activeLog: boolean) {
        this.username = username;
        this.password = password;
        this.connection = connection;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async connect(): Promise<boolean> {
        if (await this.isConnected()) {
            this.logger.debug(`Already connected, no need to connect`);
            return true;
        }

        return false;
    }

    async disconnect(): Promise<boolean> {
        if (await this.isConnected()) {
            return false;
        }

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
}