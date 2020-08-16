import { NetworkStatus } from './NetworkStatus';

export interface Signal {
    strength: number,
    total: number
};

export default interface Network {
    signal: Signal,
    type: string,
    operator: string | null | undefined,
    status: NetworkStatus
};