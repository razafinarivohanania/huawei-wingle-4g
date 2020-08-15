import Login from "../model/Login";
import Connection from "../connection/Connection";

export default class {

    private username: string;
    private password: string;
    private connection: Connection;

    constructor(username: string, password: string, connection: Connection) {
        this.username = username;
        this.password = password;
        this.connection = connection;
    }

    async sendUssd(ussd: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }

    async reply(response: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }
};