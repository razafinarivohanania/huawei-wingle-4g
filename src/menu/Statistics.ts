import Login from "../model/Login";
import Statistics from "../model/statistics/Statistics";
import DataPlan from "../model/statistics/DataPlan";
import WlanClient from "../model/statistics/WlanClient";

export default class {

    private login: Login;

    constructor(login: Login) {
        this.login = login;
    }

    async getStatistics(): Promise<Statistics> {
        return new Promise(resolve => resolve({
            monthlyDataUsage: {
                duration: 0,
                used: 0,
                total: 0
            },
            totalDataUsage: {
                duration: 0,
                used: 0
            }
        }));//TODO
    }

    async updateDataPlan(dataPlan: DataPlan): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async removeStatistics() : Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async getConnectedWlanClients(): Promise<WlanClient[]> {
        return new Promise(resolve => resolve([]));//TODO
    }

    async getBlacklistedWlanClients(): Promise<WlanClient[]> {
        return new Promise(resolve => resolve([]));//TODO
    }
}