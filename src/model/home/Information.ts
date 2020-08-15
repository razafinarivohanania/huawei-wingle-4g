import CurrentConnection from "./CurrentConnection";
import StateWlan from "./StateWlan";
import Network from "./Network";

export default interface Information {
    network: Network,
    currentConnection: CurrentConnection,
    stateWlan: StateWlan
};