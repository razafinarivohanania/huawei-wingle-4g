import builLogin from '../../LoginBuilder';
import Statistics from '../../../src/page/statistics/Statistics';
import { Unit } from '../../../src/model/statistics/DataPlan';

(async () => {
    const login = await builLogin();

    const statistics = new Statistics(login);
    statistics.activeLog(true);

    await statistics.clearHistory();
    await statistics.getStatistics();
    await statistics.getConnectedWlanClients();
    await statistics.getBlacklistedWlanClients();
    await statistics.updateDataPlan({
        startDate: 1,
        monthlyDataPlan: {
            volume: 2,
            unit: Unit.GB
        },
        threshold: 50
    })
})();