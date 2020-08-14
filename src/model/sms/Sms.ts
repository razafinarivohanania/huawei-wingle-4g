export enum State {
    SENT,
    SEEN,
    NOT_SEEN
}

export default interface Sms {
    id: string,
    state: State,
    phoneNumber: string,
    content: string,
    date: number
};