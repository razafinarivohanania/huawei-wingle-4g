import { State } from './State';
import StateWlan from './StateWlan';

export default interface Network {
    signal: {
        value: number,
        total: number
    },
    type: string,
    operator: string,
    state: State
};