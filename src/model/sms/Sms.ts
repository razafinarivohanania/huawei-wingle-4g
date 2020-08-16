export enum State {
    SENT,
    READ,
    UNREAD
};

export default interface Sms {
    id: string,
    state: State,
    phoneNumber: string,
    content: string,
    date: number
};