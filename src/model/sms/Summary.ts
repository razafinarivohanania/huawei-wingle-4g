export default interface Summary {
    inbox: {
        seen: number,
        total: number
    },
    sent: number,
    draft: number
};