import Connection from '../../connection/Connection'
import StateWlan from '../../model/home/StateWlan';
import { State } from '../../model/home/State';
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

    async getStateWlan(): Promise<StateWlan> {
        await this.connection.get('/');

        const response = await this.connection.get('/api/monitoring/status');
        const document = response.document;

        const wifiStatus = document.querySelector('WifiStatus')?.textContent;
        if (!wifiStatus) {
            throw new Error('Unable to retrieve WLAN state');
        }

        const currentWifiUser = document.querySelector('CurrentWifiUser')?.textContent;
        if (!currentWifiUser) {
            throw new Error('Unable to retrieve users count');
        }

        const state = wifiStatus === '1' ? State.ON : State.OFF;
        this.logger.debug(`State : ${state}`);

        const users = +currentWifiUser;
        this.logger.debug(`Users : ${users}`);

        return { state, users };
    }
}