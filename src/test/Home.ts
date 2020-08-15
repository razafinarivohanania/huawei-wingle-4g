import Home from '../page/home/Home';
import Connection from '../connection/Connection';
import HuawerWingle4G from '../index';

(async () => {
    const activeLog = true;
    const connection = new Connection(`http://${HuawerWingle4G.getDefaultHost()}`, activeLog);
    const home = new Home(connection, activeLog);

    await home.getNetwork();
    await home.getCurrentConnection();
    await home.getStateWlan();
})();