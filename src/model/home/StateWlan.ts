export enum State {
    ON,
    OFF
};

export default interface StateWlan {
    state: State,
    users: number
};