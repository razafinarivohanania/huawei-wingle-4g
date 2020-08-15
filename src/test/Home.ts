import Home from '../page/home/Home';
import buildLogin from './LoginBuilder';

(async () => {
    const activeLog = true;

    const login = await buildLogin(activeLog);
    const home = new Home(login, activeLog);

    await home.getNetwork(),
    await home.getCurrentConnection();
    await home.getStateWlan();
    await home.disconnectDataMobile();
    await home.connectDataMobile();
})();