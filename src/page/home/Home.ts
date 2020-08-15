import Connection from '../../connection/Connection';
import StateWlan from '../../model/home/StateWlan';
import CurrentConnection from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';
import CurrentConnectionExtractor from './CurrentConnectionExtractor';
import Network from '../../model/home/Network';
import WlanStateExtractor from './WlanStateExtractor';
import DataMobile from './DataMobile';

export default class {

    private networkExtractor: NetworkExtractor;
    private currentConnectionExtractor: CurrentConnectionExtractor;
    private stateWlanExtractor: WlanStateExtractor;
    private dataMobile: DataMobile;

    constructor(username: string, password: string, connection: Connection, activeLog = false) {
        this.networkExtractor = new NetworkExtractor(connection, activeLog);
        this.currentConnectionExtractor = new CurrentConnectionExtractor(connection, activeLog);
        this.stateWlanExtractor = new WlanStateExtractor(connection, activeLog);
        this.dataMobile = new DataMobile(username, password, connection, activeLog);
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

    connectDataMobile(): Promise<boolean> {
        return this.dataMobile.connect();
    }
}