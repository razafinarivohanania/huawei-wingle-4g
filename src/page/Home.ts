import { State } from '../model/home/State';
import Information from '../model/home/Information';
import Connection from '../connection/Connection';
import Network from '../model/home/Network';
import StateWlan from '../model/home/StateWlan';
import CurrentConnection from '../model/home/CurrentConnection';

export default class {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getInformation(): Promise<Information> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.connection.get('/');
                const document = response.document;

                const network = await this.getNetwork();
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

    private async getNetwork(): Promise<Network> {
        const response = await this.connection.get('/api/net/current-plmn');
        const document = response.document;

        const operator = this.getOperator(document);
        const type = this.getType(document);
        return {
            type,
            operator,
            signal: {
                value: 0,
                total: 5
            },
            state: State.OFF
        };
    }

    private getOperator(document: Document): string | null | undefined {
        const operatorElement = document.querySelector('FullName');
        return operatorElement?.textContent;
    }

    private getType(document: Document): string {
        const ratElement = document.querySelector('Rat');
        const rat = ratElement?.textContent;

        switch (rat) {
            case '0':
                return '2G';
            case '2':
                return '3G';
            case '7':
                return '4G';
            default:
                throw new Error(`Unable to determinate network type from rat : ${rat}`);
        }
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