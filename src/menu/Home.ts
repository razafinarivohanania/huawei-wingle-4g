import { State } from '../model/home/StateWlan';
import Information from '../model/home/Information';

export default class {

    async getInformation() : Promise<Information> {
        return new Promise(resolve => resolve({
            currentConnection:{
                received:0,
                sent:0,
                duration:0
            },
            stateWlan:{
                state:State.OFF,
                users:0
            }
        }));
    }
}