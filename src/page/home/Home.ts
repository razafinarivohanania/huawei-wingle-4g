import Connection from '../../connection/Connection';
import StateWlan from '../../model/home/StateWlan';
import CurrentConnection from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';
import CurrentConnectionExtractor from './CurrentConnectionExtractor';
import Network from '../../model/home/Network';
import WlanStateExtractor from './WlanStateExtractor';
import DataMobile from './DataMobile';
import Login from '../../connection/Login';

export default class {

    private networkExtractor: NetworkExtractor;
    private currentConnectionExtractor: CurrentConnectionExtractor;
    private stateWlanExtractor: WlanStateExtractor;
    private dataMobile: DataMobile;

    constructor(login: Login, connection: Connection, activeLog = false) {
        this.networkExtractor = new NetworkExtractor(connection, activeLog);
        this.currentConnectionExtractor = new CurrentConnectionExtractor(connection, activeLog);
        this.stateWlanExtractor = new WlanStateExtractor(connection, activeLog);
        this.dataMobile = new DataMobile(login, connection, activeLog);
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