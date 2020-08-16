import Connection from '../../connection/Connection';
import StateWlan from '../../model/home/StateWlan';
import CurrentConnection from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';
import CurrentConnectionExtractor from './CurrentConnectionExtractor';
import Network from '../../model/home/Network';
import WlanStateExtractor from './WlanStateExtractor';
import DataMobile from './DataMobile';
import Login from '../../connection/Login';

export class Home {

    private networkExtractor: NetworkExtractor;
    private currentConnectionExtractor: CurrentConnectionExtractor;
    private stateWlanExtractor: WlanStateExtractor;
    private dataMobile: DataMobile;

    constructor(login: Login) {
        this.networkExtractor = new NetworkExtractor(login.getConnnection());
        this.currentConnectionExtractor = new CurrentConnectionExtractor(login.getConnnection());
        this.stateWlanExtractor = new WlanStateExtractor(login.getConnnection());
        this.dataMobile = new DataMobile(login);
    }

    activeLog(activeLog: boolean) {
        this.networkExtractor.activeLog(activeLog);
        this.currentConnectionExtractor.activeLog(activeLog);
        this.stateWlanExtractor.activeLog(activeLog);
        this.dataMobile.activeLog(activeLog);
    }

    getNetwork(): Promise<Network> {
        return this.networkExtractor.getNetwork();
    }

    getCurrentConnection(): Promise<CurrentConnection> {
        return this.currentConnectionExtractor.getCurrentConnection();
    }

    getStateWlan(): Promise<StateWlan> {
        return this.stateWlanExtractor.getStateWlan();
    }

    connectDataMobile(): Promise<void> {
        return this.dataMobile.connect();
    }

    disconnectDataMobile(): Promise<void> {
        return this.dataMobile.disconnect();
    }
}