export enum State {
    SENT,
    READ,
    UNREAD,
    DRAFT
};

export enum Type {
    INBOX,
    OUTBOX,
    DRAFT
};

export default interface Sms {
    id: string,
    state: State,
    phoneNumber: string,
    content: string,
    date: number
};