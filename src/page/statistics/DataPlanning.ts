import Login from "../../connection/Login";
import Connection from "../../connection/Connection";
import DataPlan, { Unit } from "../../model/statistics/DataPlan";
import log4js, { Logger } from 'log4js';
import { substringAfter, toTwo } from '../../utils/StringUtils';

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
        this.login.activeLog(activeLog);
    }

    async updateDataPlan(dataPlan: DataPlan): Promise<void> {
        await this.connection.openHomePage();
        await this.login.login();

        const parameters = this.buildParameters(dataPlan);
        const response = await this.connection.post('/api/monitoring/start_date', parameters);
        if (!Connection.isSuccess(response)) {
            throw new Error('Unable to update data plan');
        }

        this.logger.debug('Updating data plan done with success');
    }

    private buildParameters(dataPlan: DataPlan): string {
        const startDate = this.getStartDate(dataPlan);
        const dataLimit = this.getDataLimit(dataPlan);
        const threshold = this.getThreshold(dataPlan);

        return `<?xml version: "1.0" encoding="UTF-8"?><request><StartDay>${startDate}</StartDay><DataLimit>${dataLimit}</DataLimit><MonthThreshold>${threshold}</MonthThreshold><SetMonthData>1</SetMonthData></request>`;
    }

    private getStartDate(dataPlan: DataPlan): string {
        const startDate = dataPlan.startDate;
        if (!this.isPositiveInteger(startDate) || startDate > 31) {
            throw new Error('Start date in data plan parameters must be between 1 and 31. 1 and 31 included');
        }

        return toTwo(startDate);
    }

    private getDataLimit(dataPlan: DataPlan): string {
        let unit = '';

        switch (dataPlan.monthlyDataPlan.unit) {
            case Unit.MG:
                unit = 'MG';
                break;
            case Unit.GB:
                unit = 'GB';
                break;
            default:
                throw new Error(`Unable to determinate data unit from : ${dataPlan.monthlyDataPlan.unit}`);
        }

        const volume = dataPlan.monthlyDataPlan.volume;
        if (!this.isPositiveInteger(volume)) {
            throw new Error('Monthly data volume must be a positive integer number');
        }

        return `${dataPlan.monthlyDataPlan.volume}${unit}`;
    }

    private getThreshold(dataPlan: DataPlan): number {
        const threshold = dataPlan.threshold;
        if (!this.isPositiveInteger(threshold) || threshold > 100) {
            throw new Error('Threshold must be a positive integer between 1 and 100. 1 and 100 included');
        }

        return threshold;
    }

    private isPositiveInteger(number: number): boolean {
        return number > 0 && !`${number}`.includes('.');
    }
}