import Login from "../model/Login";
import Connection from "../connection/Connection";

export default class {

    private login: Login;
    private connection: Connection;

    constructor(login: Login, connection: Connection) {
        this.login = login;
        this.connection = connection;
    }

    async sendUssd(ussd: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }

    async reply(response: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }
};