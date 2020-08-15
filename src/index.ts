import Home from './page/Home';
import Sms from './page/Sms';
import Statistics from './page/Statistics';
import Ussd from './page/Ussd';
import Login from './model/Login';
import Connection from './connection/Connection';

export default class HuaweiWingle4G {

    private login: Login;
    private connection: Connection;
    private home: Home;
    private sms: Sms;
    private statistics: Statistics;
    private ussd: Ussd;

    constructor(login: Login, host = HuaweiWingle4G.getDefaultHost(), activeLog = false) {
        this.login = login;
        this.connection = new Connection(`http://${host}`, activeLog);
        this.home = new Home(this.connection);
        this.sms = new Sms(this.login, this.connection);
        this.statistics = new Statistics(this.login, this.connection);
        this.ussd = new Ussd(this.login, this.connection);
    }

    getHome(): Home {
        return this.home;
    }

    getSms(): Sms {
        return this.sms;
    }

    getStatistics(): Statistics {
        return this.statistics;
    }

    getUssd(): Ussd {
        return this.ussd;
    }

    static getDefaultHost() {
        return '192.168.8.1';
    }
};