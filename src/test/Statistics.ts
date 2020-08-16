import builLogin from './LoginBuilder';
import Statistics from '../page/statistics/Statistics';

(async () => {
    const login = await builLogin();

    const statistics = new Statistics(login);
    statistics.activeLog(true);

    await statistics.clearHistory();
    await statistics.getStatistics();
    await statistics.getConnectedWlanClients();
    await statistics.getBlacklistedWlanClients();
})();