import Home from './page/home/Home';
import Sms from './page/sms/Sms';
import Statistics from './page/statistics/Statistics';
import Ussd from './page/ussd/Ussd';
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

        this.home = new Home(login, activeLog);
        this.sms = new Sms(login, activeLog);
        this.statistics = new Statistics(login, activeLog);
        this.ussd = new Ussd(login, activeLog);
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