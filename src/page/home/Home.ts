import { WlanInformation } from '../../model/home/WlanInformation';
import { CurrentConnection } from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';
import CurrentConnectionExtractor from './CurrentConnectionExtractor';
import Network from '../../model/home/Network';
import WlanStatusExtractor from './WlanStatusExtractor';
import DataMobile from './DataMobile';
import Login from '../../connection/Login';

export class Home {

    private networkExtractor: NetworkExtractor;
    private currentConnectionExtractor: CurrentConnectionExtractor;
    private wlanStatusExtractor: WlanStatusExtractor;
    private dataMobile: DataMobile;

    constructor(login: Login) {
        this.networkExtractor = new NetworkExtractor(login.getConnnection());
        this.currentConnectionExtractor = new CurrentConnectionExtractor(login.getConnnection());
        this.wlanStatusExtractor = new WlanStatusExtractor(login.getConnnection());
        this.dataMobile = new DataMobile(login);
    }

    activeLog(activeLog: boolean) {
        this.networkExtractor.activeLog(activeLog);
        this.currentConnectionExtractor.activeLog(activeLog);
        this.wlanStatusExtractor.activeLog(activeLog);
        this.dataMobile.activeLog(activeLog);
    }

    getNetwork(): Promise<Network> {
        return this.networkExtractor.getNetwork();
    }

    getCurrentConnection(): Promise<CurrentConnection> {
        return this.currentConnectionExtractor.getCurrentConnection();
    }

    getWlanInformation(): Promise<WlanInformation> {
        return this.wlanStatusExtractor.getWlanInformation();
    }

    connectDataMobile(): Promise<void> {
        return this.dataMobile.connect();
    }

    disconnectDataMobile(): Promise<void> {
        return this.dataMobile.disconnect();
    }
}