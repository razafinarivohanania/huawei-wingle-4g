import Connection from "../connection/Connection";
import HuawerWingle4G from '../index';
import ask from '../utils/Ask';
import Login from '../connection/Login';

export default async function buildLogin(activeLog = false) {
    const username = await ask('Enter username : ');
    const password = await ask('Enter password : ');//TODO hide password

    const connection = new Connection(`http://${HuawerWingle4G.getDefaultHost()}`, activeLog);
    return new Login(username, password, connection, activeLog);
}