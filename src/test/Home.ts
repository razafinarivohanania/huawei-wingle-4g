import Home from '../page/Home';
import Connection from '../connection/Connection';
import HuawerWingle4G from '../index';

(async () => {
    const connection = new Connection(`http://${HuawerWingle4G.getDefaultHost()}`, true);
    const home = new Home(connection);
    const information = await home.getInformation();
    console.log(information);
})();