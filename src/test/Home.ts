import Home from '../page/home/Home';
import Connection from '../connection/Connection';
import HuawerWingle4G from '../index';
import ask from '../utils/Ask';

(async () => {
    const username = await ask('Enter username : ');
    const password = await ask('Enter password : ');

    const activeLog = true;
    const connection = new Connection(`http://${HuawerWingle4G.getDefaultHost()}`, activeLog);

    const home = new Home(username, password, connection, activeLog);

    await home.getNetwork();
    await home.getCurrentConnection();
    await home.getStateWlan();
})();