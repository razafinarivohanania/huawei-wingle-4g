import Login from "../../connection/Login";
import Connection from "../../connection/Connection";
import Sms from "../../model/sms/Sms";
import SummaryExtractor from "./SummaryExtractor";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import getFieldValue from '../../utils/ElemenUtils';
import { State, Type } from "../../model/sms/Sms";
import { ERANGE } from "constants";

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

    async getSmsList(type: Type): Promise<Sms[]> {
        const totalPageSms = await this.getTotalPageSms(type);
        const listSms: Sms[] = [];

        for (let page = 1; page <= totalPageSms; page++) {
            const currentSmsList = await this.getSmsListPerPage(type, page);
            currentSmsList.forEach(currentSms => listSms.push(currentSms));
        }

        return listSms;
    }

    private async getTotalPageSms(type: Type): Promise<number> {
        const summary = await this.summaryExtractor.getSummary();

        let total;
        switch (type) {
            case Type.INBOX:
                total = summary.inbox.total;
                break;
            case Type.OUTBOX:
                total = summary.outbox;
                break;
            case Type.DRAFT:
                total = summary.draft;
                break;
            default:
                throw new Error(`Unable to determinate total sms from type : ${type}`);
        }

        const totalPageSms = Math.ceil(total / SMS_COUNT_PER_PAGE);
        this.logger.debug(`Total page SMS : ${totalPageSms}`);
        return totalPageSms;
    }

    private async getSmsListPerPage(type: Type, page: number): Promise<Sms[]> {
        const parameters = this.buildParameters(type, page);
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

                inboxSms.push({ id, state, phoneNumber, content, date });
            });
        }

        return inboxSms;
    }

    private buildParameters(type: Type, page: number): string {
        let boxType: number;

        switch (type) {
            case Type.INBOX:
                boxType = 1;
                break;
            case Type.OUTBOX:
                boxType = 2;
                break;
            case Type.DRAFT:
                boxType = 3;
                break;
            default:
                throw new Error(`Unable to determinate box type from : ${type}`);
        }

        return `<?xml version: "1.0" encoding="UTF-8"?><request><PageIndex>${page}</PageIndex><ReadCount>${SMS_COUNT_PER_PAGE}</ReadCount><BoxType>${boxType}</BoxType><SortType>0</SortType><Ascending>0</Ascending><UnreadPreferred>0</UnreadPreferred></request>`;
    }

    private getSmsState(smsElement: Element): State {
        const rawState = getFieldValue(smsElement, 'Smstat', 'Raw state SMS', this.logger);

        switch (rawState) {
            case '0':
                return State.UNREAD;
            case '1':
                return State.READ;
            case '2':
                return State.DRAFT;
            case '3':
                return State.SENT;
            default:
                throw new Error(`Unable to determinate state SMS from : ${rawState}`);
        }
    }

    private getDateSms(smsElement: Element): number {
        const rawDate = getFieldValue(smsElement, 'Date', 'Raw date SMS', this.logger);
        const matcher = /(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/.exec(rawDate);
        if (matcher) {
            return +new Date(`${matcher[1]}-${matcher[2]}-${matcher[3]}T${matcher[4]}:${matcher[5]}:${matcher[6]}.000Z`);
        }

        throw new Error(`Unable to extract date from : ${rawDate}`);
    }
}