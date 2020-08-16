export enum Unit {
    MG,
    GB
};

export default interface DataPlan {
    startDate: number,
    monthlyDataPlan: {
        volume: number,
        unit: Unit
    },
    threshold: number
};