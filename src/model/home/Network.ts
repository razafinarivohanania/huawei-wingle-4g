import { State } from './State';
import StateWlan from './StateWlan';

export default interface Network {
    signal: {
        value: number,
        total: number
    },
    type: string,
    operator: string | null | undefined,
    state: State
};