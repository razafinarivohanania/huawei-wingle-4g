import Summary from "../../model/sms/Summary";
import Sms from "../../model/sms/Sms";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import SummaryExtractor from "./SummaryExtractor";
import InboxSmsExtractor from "./InboxSmsExtractor";

export default class {

    private login: Login;
    private logger: Logger;
    private summaryExtractor: SummaryExtractor;
    private inboxSmsExtractor: InboxSmsExtractor;

    constructor(login: Login) {
        this.login = login;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.summaryExtractor = new SummaryExtractor(login);
        this.inboxSmsExtractor = new InboxSmsExtractor(login, this.summaryExtractor);
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
        this.summaryExtractor.activeLog(activeLog);
        this.inboxSmsExtractor.activeLog(activeLog);
    }

    getSummary(): Promise<Summary> {
        return this.summaryExtractor.getSummary();
    }

    getInboxSms(): Promise<Sms[]> {
        return this.inboxSmsExtractor.getInboxSms();
    }

    async getSentSms(): Promise<Sms[]> {
        return new Promise(resolve => resolve([]));//TODO
    }

    async getDraftSms(): Promise<Sms[]> {
        return new Promise(resolve => resolve([]));//TODO
    }

    async sendSms(phoneNumbers: string | string[], content: string): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async storeSmsInDraft(phoneNumbers: string | string[], content: string): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }

    async removeSms(ids: string | string[]): Promise<void> {
        return new Promise(resolve => resolve());//TODO
    }
}