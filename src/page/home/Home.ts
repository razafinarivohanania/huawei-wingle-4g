import Connection from '../../connection/Connection';
import StateWlan from '../../model/home/StateWlan';
import CurrentConnection from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';
import CurrentConnectionExtractor from './CurrentConnectionExtractor';
import Network from '../../model/home/Network';
import WlanStateExtractor from './WlanStateExtractor';

export default class {

    private networkExtractor: NetworkExtractor;
    private currentConnectionExtractor: CurrentConnectionExtractor;
    private stateWlanExtractor: WlanStateExtractor;

    constructor(connection: Connection, activeLog = false) {
        this.networkExtractor = new NetworkExtractor(connection, activeLog);
        this.currentConnectionExtractor = new CurrentConnectionExtractor(connection, activeLog);
        this.stateWlanExtractor = new WlanStateExtractor(connection, activeLog);
    }

    async getNetwork(): Promise<Network> {
        return this.networkExtractor.getNetwork();
    }

    async getCurrentConnection(): Promise<CurrentConnection> {
        return this.currentConnectionExtractor.getCurrentConnection();
    }

    async getStateWlan(): Promise<StateWlan> {
        return this.stateWlanExtractor.getStateWlan();
    }
}