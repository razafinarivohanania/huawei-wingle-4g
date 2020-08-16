import Connection from '../../connection/Connection'
import { WlanInformation } from '../../model/home/WlanInformation';
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import { WlanStatus } from '../../model/home/WlanStatus';

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

    async getWlanInformation(): Promise<WlanInformation> {
        await this.connection.openHomePage();

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

        const status = wifiStatus === '1' ? WlanStatus.ON : WlanStatus.OFF;
        this.logger.debug(`State : ${status}`);

        const users = +currentWifiUser;
        this.logger.debug(`Users : ${users}`);

        return { status, users };
    }
}