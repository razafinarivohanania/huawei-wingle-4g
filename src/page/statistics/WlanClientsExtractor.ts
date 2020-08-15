import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import Connection from "../../connection/Connection";
import WlanClient from "../../model/statistics/WlanClient";
import getFieldValue from "../../utils/ElemenUtils";

export default class {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login, activeLog = false) {
        this.login = login;
        this.connection = login.getConnnection();
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async getWlanClients(): Promise<WlanClient[]> {
        await this.connection.get('/');
        await this.login.login();

        const response = await this.connection.get('/api/wlan/host-list');

        const hostElements = response.document.querySelectorAll('Hosts > Host');
        const wlanClients: WlanClient[] = [];
        if (hostElements && hostElements.length) {
            hostElements.forEach(hostElement => {
                const id = getFieldValue(hostElement, 'ID', 'ID client', this.logger);
                const ipAddress = getFieldValue(hostElement, 'IpAddress', 'IP address', this.logger);
                const hostName = getFieldValue(hostElement, 'HostName', 'Host name', this.logger);
                const macAddress = getFieldValue(hostElement, 'MacAddress', 'Mac address', this.logger);
                const duration = this.getDuration(hostElement);

                wlanClients.push({ id, ipAddress, hostName, macAddress, duration });
            });
        }

        return wlanClients;
    }

    private getDuration(hostElement: Element): number {
        const rawDuration = getFieldValue(hostElement, 'AssociatedTime', 'Duration', this.logger);
        return +rawDuration * 1000;
    }
}