import { State } from '../../model/home/State';
import Information from '../../model/home/Information';
import Connection from '../../connection/Connection';
import StateWlan from '../../model/home/StateWlan';
import CurrentConnection from '../../model/home/CurrentConnection';
import NetworkExtractor from './NetworkExtractor';

export default class {

    private connection: Connection;
    private networkExtractor : NetworkExtractor;

    constructor(connection: Connection) {
        this.connection = connection;
        this.networkExtractor = new NetworkExtractor(connection);
    }

    async getInformation(): Promise<Information> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.connection.get('/');
                const document = response.document;

                const network = await this.networkExtractor.getNetwork();
                resolve({
                    network,
                    currentConnection: this.getCurrentConnection(document),
                    stateWlan: this.getStateWlan(document)
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    private getCurrentConnection(document: Document): CurrentConnection {
        return {
            received: 0,
            sent: 0,
            duration: 0
        };
    }

    private getStateWlan(document: Document): StateWlan {
        return {
            state: State.OFF,
            users: 0
        }
    }
}