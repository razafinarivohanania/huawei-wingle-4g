import builLogin from './LoginBuilder';
import Statistics from '../page/statistics/Statistics';

(async () => {
    const activeLog = true;
    const login = await builLogin(activeLog);
    const statistics = new Statistics(login, activeLog);

    await statistics.getStatistics();
    await statistics.getConnectedWlanClients();
    await statistics.getBlacklistedWlanClients();
})();