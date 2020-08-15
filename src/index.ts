import Home from './page/home/Home';
import Sms from './page/Sms';
import Statistics from './page/Statistics';
import Ussd from './page/Ussd';
import Connection from './connection/Connection';
import Login from './connection/Login';

export default class HuaweiWingle4G {

    private home: Home;
    private sms: Sms;
    private statistics: Statistics;
    private ussd: Ussd;

    constructor(username: string, password: string, host = HuaweiWingle4G.getDefaultHost(), activeLog = false) {
        const connection = new Connection(`http://${host}`, activeLog);
        const login = new Login(username, password, connection, activeLog);

        this.home = new Home(login, connection);
        this.sms = new Sms(username, password, connection);
        this.statistics = new Statistics(username, password, connection);
        this.ussd = new Ussd(username, password, connection);
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