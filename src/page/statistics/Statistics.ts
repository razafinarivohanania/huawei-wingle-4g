import Statistics from "../../model/statistics/Statistics";
import DataPlan from "../../model/statistics/DataPlan";
import WlanClient from "../../model/statistics/WlanClient";
import Login from "../../connection/Login";
import StatisticsExtractor from "./StatisticsExtractor";
import WlanClientsExtractor from "./WlanClientsExtractor";
import BlacklistedWlanClientsExtractor from "./BlacklistedWlanClientsExtractor";
import { runInThisContext } from "vm";

export default class {

    private statisticsExtractor: StatisticsExtractor;
    private wlanClientsExtractor: WlanClientsExtractor;
    private blacklistedWlanClientsExtractor : BlacklistedWlanClientsExtractor;

    constructor(login: Login, activeLog = false) {
        this.statisticsExtractor = new StatisticsExtractor(login, activeLog);
        this.wlanClientsExtractor = new WlanClientsExtractor(login, activeLog);
        this.blacklistedWlanClientsExtractor = new BlacklistedWlanClientsExtractor(login, activeLog);
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

    getConnectedWlanClients(): Promise<WlanClient[]> {
        return this.wlanClientsExtractor.getWlanClients();
    }

    async getBlacklistedWlanClients(): Promise<WlanClient[]> {
        return this.blacklistedWlanClientsExtractor.getBlacklistedWlanClients();
    }
}