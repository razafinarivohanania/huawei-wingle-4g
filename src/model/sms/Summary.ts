export default interface Summary {
    inbox: {
        unread: number,
        total: number
    },
    sent: number,
    draft: number
};