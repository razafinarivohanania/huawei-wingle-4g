import Statistics from "../../model/statistics/Statistics";
import DataPlan from "../../model/statistics/DataPlan";
import WlanClient from "../../model/statistics/WlanClient";
import Login from "../../connection/Login";
import StatisticsExtractor from "./StatisticsExtractor";

export default class {

    private statisticsExtractor: StatisticsExtractor;

    constructor(login: Login, activeLog = false) {
        this.statisticsExtractor = new StatisticsExtractor(login, activeLog);
    }

     getStatistics(): Promise<Statistics> {
        return this.statisticsExtractor.getStatistics();
    }

    async updateDataPlan(dataPlan: DataPlan): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async removeStatistics(): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async getConnectedWlanClients(): Promise<WlanClient[]> {
        return new Promise(resolve => resolve([]));//TODO
    }

    async getBlacklistedWlanClients(): Promise<WlanClient[]> {
        return new Promise(resolve => resolve([]));//TODO
    }
}