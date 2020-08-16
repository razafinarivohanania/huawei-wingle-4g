import Connection from "../../connection/Connection";
import CurrentConnection from "../../model/home/CurrentConnection";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

export default class {

    private connection: Connection;
    private logger: Logger;

    constructor(connection: Connection) {
        this.connection = connection;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.connection.activeLog(activeLog);
    }

    async getCurrentConnection(): Promise<CurrentConnection> {
        await this.connection.get('/');

        const response = await this.connection.get('/api/monitoring/traffic-statistics');
        const document = response.document;

        const rawReceived = document.querySelector('CurrentDownload')?.textContent;
        if (!rawReceived) {
            throw new Error('Unable to retrieve received data');
        }

        const rawSent = document.querySelector('CurrentUpload')?.textContent;
        if (!rawSent) {
            throw new Error('Unable to retrieve sent data');
        }

        const rawDuration = document.querySelector('CurrentConnectTime')?.textContent;
        if (!rawDuration) {
            throw new Error('Unable to retrieve duration data');
        }

        const received = +rawReceived;
        this.logger.debug(`Received : ${rawReceived}`);

        const sent = +rawSent;
        this.logger.debug(`Sent : ${rawSent}`);

        const duration = +rawDuration * 1000;
        this.logger.debug(`Duration : ${duration}`);

        return { received, sent, duration };
    }
}