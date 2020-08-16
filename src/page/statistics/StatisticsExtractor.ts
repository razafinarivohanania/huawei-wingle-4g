import Login from "../../connection/Login";
import Connection from "../../connection/Connection";
import Statistics, { MonthlyDataUsed, TotalDataUsed } from "../../model/statistics/Statistics";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

export default class {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login) {
        this.login = login;
        this.connection = login.getConnnection();
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async getStatistics(): Promise<Statistics> {
        await this.connection.get('/');
        await this.login.login();

        const monthlyDataUsedDocument = await this.connectMonthlyDataUsed();
        const monthlyDataUsed = await this.getMonthlyDataUsed(monthlyDataUsedDocument);
        const totalDataUsed = await this.getTotalDataUsed(monthlyDataUsed.duration, monthlyDataUsed.used);
        const lastClearTime = await this.getLastClearTime(monthlyDataUsedDocument);

        return { monthlyDataUsed, totalDataUsed, lastClearTime };
    }

    private async connectMonthlyDataUsed(): Promise<Document> {
        const response = await this.connection.get('/api/monitoring/month_statistics');
        return response.document;
    }

    private async getMonthlyDataUsed(document: Document): Promise<MonthlyDataUsed> {
        const rawDuration = document.querySelector('MonthDuration')?.textContent;;
        if (!rawDuration) {
            throw new Error('Unable to retrieve monthly duration');
        }

        const duration = +rawDuration * 1000;
        this.logger.debug(`Monthly duration : ${duration}`);

        const rawDownload = document.querySelector('CurrentMonthDownload')?.textContent;
        if (!rawDownload) {
            throw new Error('Unable to retrieve monthly data downloaded');
        }

        const download = +rawDownload;
        this.logger.debug(`Monthly data downloaded : ${download}`);

        const rawUpload = document.querySelector('CurrentMonthUpload')?.textContent;
        if (!rawUpload) {
            throw new Error('Unable to retrieve monthly data uploaded');
        }

        const upload = +rawUpload;
        this.logger.debug(`Monthly data uploaded : ${download}`);

        const used = download + upload;
        this.logger.debug(`Monthly data used : ${used}`);

        const limit = await this.getMonthlyDataLimit();
        return { duration, used, limit }
    }

    private async getMonthlyDataLimit(): Promise<number> {
        const response = await this.connection.get('/api/monitoring/start_date');
        const document = response.document;

        const rawDataLimit = document.querySelector('DataLimit')?.textContent;
        if (!rawDataLimit) {
            throw new Error('Unable to retrieve monthly limit data');
        }

        const matcher = /(\d+)([A-Z]+)/.exec(rawDataLimit);
        if (matcher) {
            let data = +matcher[1];

            switch (matcher[2]) {
                case 'GB':
                    return data * Math.pow(1024, 3);
                case 'MB':
                    return data * Math.pow(1024, 2);
                case 'KB':
                    return data * 1024;
            }
        }

        throw new Error(`Unable to extract monthly data limit from : ${rawDataLimit}`);
    }

    private async getTotalDataUsed(monthDuration: number, monthDataUsed: number): Promise<TotalDataUsed> {
        const response = await this.connection.get('/api/monitoring/traffic-statistics');
        const document = response.document;

        const rawTotalConnectTime = document.querySelector('TotalConnectTime')?.textContent;
        if (!rawTotalConnectTime) {
            throw new Error('Unable to retrieve total connect time');
        }

        let duration = +rawTotalConnectTime;
        if (duration < monthDuration) {
            duration = monthDuration;
        }

        this.logger.debug(`Total connect time : ${duration}`);

        const rawTotalDownload = document.querySelector('TotalDownload')?.textContent;
        if (!rawTotalDownload) {
            throw new Error('Unable to retrieve total data downloaded');
        }

        const rawTotalUpload = document.querySelector('TotalUpload')?.textContent;
        if (!rawTotalUpload) {
            throw new Error('Unable to retriebe total data uploaded');
        }

        let used = +rawTotalDownload + +rawTotalUpload;
        if (used < monthDataUsed) {
            used = monthDataUsed;
        }

        this.logger.debug(`Total data used : ${used}`);
        return { duration, used };
    }

    private getLastClearTime(document: Document): number {
        const monthLastClearTime = document.querySelector('MonthLastClearTime')?.textContent;
        if (!monthLastClearTime) {
            throw new Error('Unable to retrieve month last clear time');
        }

        const matcher = /(\d+)-(\d+)-(\d+)/.exec(monthLastClearTime);
        if (matcher) {
            const year = matcher[1];
            const month = this.toTwo(+matcher[2]);
            const date = this.toTwo(+matcher[3]);
            return +new Date(`${year}-${month}-${date}T00:00:00.000Z`);
        }

        throw new Error(`Unable to retrieve lase clear time from : ${monthLastClearTime}`);
    }

    private toTwo(number: number): string {
        return number < 9 ? `0${number}` : `${number}`;
    }
}