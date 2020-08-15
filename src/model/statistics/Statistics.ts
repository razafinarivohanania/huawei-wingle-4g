export interface MonthlyDataUsed {
    duration: number,
    used: number,
    limit: number
};

export interface TotalDataUsed {
    duration: number,
    used: number
};

export default interface Statistics {
    monthlyDataUsed: MonthlyDataUsed,
    totalDataUsed: TotalDataUsed,
    lastClearTime: number
};