import Login from "../model/Login";

export default class {

    private login: Login;

    constructor(login: Login) {
        this.login = login;
    }

    async sendUssd(ussd: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }

    async reply(response: string): Promise<string> {
        return new Promise(resolve => resolve(''));//TODO
    }
};