import Connection from "../src/connection/Connection";
import { HuaweiWingle4G } from '../src/index';
import ask from '../src/utils/Ask';
import Login from '../src/connection/Login';

export default async function buildLogin() {
    const username = await ask('Enter username : ');
    const password = await ask('Enter password : ');//TODO hide password

    const connection = new Connection(`http://${HuaweiWingle4G.getDefaultHost()}`);
    return new Login(username, password, connection);
}