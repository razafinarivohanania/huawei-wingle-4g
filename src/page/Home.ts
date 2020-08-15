import { State } from '../model/home/State';
import Information from '../model/home/Information';
import Connection from '../connection/Connection';

export default class {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getInformation(): Promise<Information> {
        return new Promise(resolve => resolve({
            network: {
                type: '',
                operator: '',
                signal: {
                    value: 0,
                    total: 5
                },
                state: State.OFF
            },
            currentConnection: {
                received: 0,
                sent: 0,
                duration: 0
            },
            stateWlan: {
                state: State.OFF,
                users: 0
            }
        }));
    }
}