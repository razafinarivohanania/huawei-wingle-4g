import Login from "../../connection/Login";
import Connection from "../../connection/Connection";
import Sms from "../../model/sms/Sms";
import SummaryExtractor from "./SummaryExtractor";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import getFieldValue from '../../utils/ElemenUtils';
import { State } from "../../model/sms/Sms";

const SMS_COUNT_PER_PAGE = 20;

export default class {

    private login: Login;
    private connection: Connection;
    private summaryExtractor: SummaryExtractor;
    private logger: Logger;

    constructor(login: Login, summaryExtractor: SummaryExtractor) {
        this.login = login;
        this.connection = login.getConnnection();
        this.summaryExtractor = summaryExtractor;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(true);
        this.summaryExtractor.activeLog(true);
    }

    async getInboxSms(): Promise<Sms[]> {
        const totalPageSms = await this.getTotalPageSms();
        const inboxSms: Sms[] = [];

        for (let page = 1; page <= totalPageSms; page++) {
            const currentInboxSms = await this.getInboxSmsPerPage(page);
            currentInboxSms.forEach(sms => inboxSms.push(sms));
        }

        return inboxSms;
    }

    private async getTotalPageSms(): Promise<number> {
        const summary = await this.summaryExtractor.getSummary();
        const totalPageSms = Math.ceil(summary.inbox.total / SMS_COUNT_PER_PAGE);
        this.logger.debug(`Total page SMS : ${totalPageSms}`);
        return totalPageSms;
    }

    private async getInboxSmsPerPage(page: number): Promise<Sms[]> {
        const parameters = this.buildParameters(page);
        const response = await this.connection.post('/api/sms/sms-list', parameters);
        const smsElements = response.document.querySelectorAll('Message');
        const inboxSms: Sms[] = [];

        if (smsElements && smsElements.length) {
            smsElements.forEach(smsElement => {
                const id = getFieldValue(smsElement, 'Index', 'ID SMS', this.logger);
                const state = this.getSmsState(smsElement);
                const phoneNumber = getFieldValue(smsElement, 'Phone', 'Phone number', this.logger);
                const content = getFieldValue(smsElement, 'Content', 'Content SMS', this.logger);
                const date = this.getDateSms(smsElement);

                inboxSms.push({id, state, phoneNumber, content, date});
            });
        }

        return inboxSms;
    }

    private buildParameters(page: number): string {
        return `<?xml version: "1.0" encoding="UTF-8"?><request><PageIndex>${page}</PageIndex><ReadCount>${SMS_COUNT_PER_PAGE}</ReadCount><BoxType>1</BoxType><SortType>0</SortType><Ascending>0</Ascending><UnreadPreferred>0</UnreadPreferred></request>`;
    }

    private getSmsState(smsElement: Element): State {
        const rawState = getFieldValue(smsElement, 'Smstat', 'Raw state SMS', this.logger);

        switch (rawState) {
            case '0':
                return State.UNREAD;
            case '1':
                return State.READ;
            default:
                throw new Error(`Unable to determinate state SMS from : ${rawState}`);
        }
    }

    private getDateSms(smsElement: Element) : number {
        const rawDate = getFieldValue(smsElement, 'Date', 'Raw date SMS', this.logger);
        const matcher = /(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/.exec(rawDate);
        if (matcher) {
            return +new Date(`${matcher[1]}-${matcher[2]}-${matcher[3]}T${matcher[4]}:${matcher[5]}:${matcher[6]}.000Z`);
        }

        throw new Error(`Unable to extract date from : ${rawDate}`);
    }
}