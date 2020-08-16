import Statistics from "../../model/statistics/Statistics";
import DataPlan from "../../model/statistics/DataPlan";
import WlanClient from "../../model/statistics/WlanClient";
import Login from "../../connection/Login";
import StatisticsExtractor from "./StatisticsExtractor";
import WlanClientsExtractor from "./WlanClientsExtractor";
import BlacklistedWlanClientsExtractor from "./BlacklistedWlanClientsExtractor";
import HistoryCleaner from "./HistoryCleaner";
import DataPlanning from "./DataPlanning";

export default class {

    private statisticsExtractor: StatisticsExtractor;
    private wlanClientsExtractor: WlanClientsExtractor;
    private blacklistedWlanClientsExtractor: BlacklistedWlanClientsExtractor;
    private historyCleaner: HistoryCleaner;
    private dataPlanning: DataPlanning;

    constructor(login: Login) {
        this.statisticsExtractor = new StatisticsExtractor(login);
        this.wlanClientsExtractor = new WlanClientsExtractor(login);
        this.blacklistedWlanClientsExtractor = new BlacklistedWlanClientsExtractor(login);
        this.historyCleaner = new HistoryCleaner(login);
        this.dataPlanning = new DataPlanning(login);
    }

    activeLog(activeLog: boolean) {
        this.statisticsExtractor.activeLog(activeLog);
        this.wlanClientsExtractor.activeLog(activeLog);
        this.blacklistedWlanClientsExtractor.activeLog(activeLog);
        this.historyCleaner.activeLog(activeLog);
        this.dataPlanning.activeLog(activeLog);
    }

    getStatistics(): Promise<Statistics> {
        return this.statisticsExtractor.getStatistics();
    }

    updateDataPlan(dataPlan: DataPlan): Promise<void> {
        return this.dataPlanning.updateDataPlan(dataPlan);
    }

    clearHistory(): Promise<void> {
        return this.historyCleaner.clearHistory();
    }

    getConnectedWlanClients(): Promise<WlanClient[]> {
        return this.wlanClientsExtractor.getWlanClients();
    }

    async getBlacklistedWlanClients(): Promise<WlanClient[]> {
        return this.blacklistedWlanClientsExtractor.getBlacklistedWlanClients();
    }
}