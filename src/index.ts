import Home from './page/home/Home';
import Sms from './page/Sms';
import Statistics from './page/Statistics';
import Ussd from './page/Ussd';
import Connection from './connection/Connection';

export default class HuaweiWingle4G {

    private connection: Connection;
    private home: Home;
    private sms: Sms;
    private statistics: Statistics;
    private ussd: Ussd;

    constructor(username: string, password: string, host = HuaweiWingle4G.getDefaultHost(), activeLog = false) {
        this.connection = new Connection(`http://${host}`, activeLog);
        this.home = new Home(username, password, this.connection);
        this.sms = new Sms(username, password, this.connection);
        this.statistics = new Statistics(username, password, this.connection);
        this.ussd = new Ussd(username, password, this.connection);
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