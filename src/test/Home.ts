import Home from '../page/home/Home';
import Connection from '../connection/Connection';
import HuawerWingle4G from '../index';
import ask from '../utils/Ask';
import Login from '../connection/Login';

(async () => {
    const username = await ask('Enter username : ');
    const password = await ask('Enter password : ');

    const activeLog = true;
    const connection = new Connection(`http://${HuawerWingle4G.getDefaultHost()}`, activeLog);
    const login = new Login(username, password, connection, activeLog);
    const home = new Home(login, connection, activeLog);

    //await home.connectDataMobile();
    await home.disconnectDataMobile();
    await home.connectDataMobile();
    await home.disconnectDataMobile();
    await home.connectDataMobile();
    //await home.disconnectDataMobile();
    /*await home.getNetwork();
    await home.getCurrentConnection();
    await home.getStateWlan();*/
})();