export interface MonthlyDataUsage {
    duration: number,
    used: number,
    total: number
};

export interface TotalDataUsage {
    duration: number,
    used: number
};

export default interface Statistics {
    monthlyDataUsage: MonthlyDataUsage,
    totalDataUsage: TotalDataUsage
};