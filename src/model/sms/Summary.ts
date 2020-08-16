export default interface Summary {
    inbox: {
        unread: number,
        total: number
    },
    outbox: number,
    draft: number
};