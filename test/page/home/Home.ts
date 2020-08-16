import { Home } from '../../../src/page/home/Home';
import buildLogin from '../../LoginBuilder';

(async () => {
    const login = await buildLogin();

    const home = new Home(login);
    home.activeLog(true);

    await home.getNetwork(),
    await home.getCurrentConnection();
    await home.getWlanInformation();
    await home.disconnectDataMobile();
    await home.connectDataMobile();
})();