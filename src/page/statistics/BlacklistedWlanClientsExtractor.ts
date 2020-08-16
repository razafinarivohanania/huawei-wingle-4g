import Login from "../../connection/Login";
import Connection from "../../connection/Connection";
import WlanClient from "../../model/statistics/WlanClient";
import getFieldValue from "../../utils/ElemenUtils";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

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

    async getBlacklistedWlanClients(): Promise<WlanClient[]> {
        await this.connection.get('/');
        await this.login.login();

        const response = await this.connection.get('/api/wlan/multi-macfilter-settings');
        const document = response.document;

        const blacklistedWlanClients: WlanClient[] = [];
        const ssidElements = document.querySelectorAll('Ssids > Ssid');
        if (ssidElements && ssidElements.length) {
            ssidElements.forEach(ssidElement => {
                let hostName;
                try {
                    hostName = getFieldValue(ssidElement, 'wifihostname0', 'Host name blacklisted client', this.logger);
                } catch (err) {
                    return;
                }

                const id = getFieldValue(ssidElement, 'Index', 'ID blacklisted client', this.logger);
                const macAddress = getFieldValue(ssidElement, 'WifiMacFilterMac0', 'Mac address blacklisted client', this.logger);
                blacklistedWlanClients.push({ id, ipAddress: '', hostName, macAddress, duration: 0 });
            })
        }

        return blacklistedWlanClients;
    }
}