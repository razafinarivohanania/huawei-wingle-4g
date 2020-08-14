import CurrentConnection from '../model/home/CurrentConnection';
import StateWlan, { State } from '../model/home/StateWlan';

export default class {

    async getCurrentConnection(): Promise<CurrentConnection> {
        return new Promise(resolve => resolve({
            received: 0,
            sent: 0,
            duration: 0
        }));//TODO
    }

    async getStateWlan(): Promise<StateWlan> {
        return new Promise(resolve => resolve({
            state: State.OFF,
            users: 0
        }));//TODO
    }
}