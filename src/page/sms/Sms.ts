import Summary from "../../model/sms/Summary";
import Sms, { Type } from "../../model/sms/Sms";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import SummaryExtractor from "./SummaryExtractor";
import InboxSmsExtractor from "./InboxSmsExtractor";
import SmsAsRead from "./SmsAsRead";
import { runInThisContext } from "vm";

export default class {

    private login: Login;
    private logger: Logger;
    private summaryExtractor: SummaryExtractor;
    private inboxSmsExtractor: InboxSmsExtractor;
    private smsAsRead: SmsAsRead;

    constructor(login: Login) {
        this.login = login;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.summaryExtractor = new SummaryExtractor(login);
        this.inboxSmsExtractor = new InboxSmsExtractor(login, this.summaryExtractor);
        this.smsAsRead = new SmsAsRead(login);
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
        this.summaryExtractor.activeLog(activeLog);
        this.inboxSmsExtractor.activeLog(activeLog);
        this.smsAsRead.activeLog(activeLog);
    }

    getSummary(): Promise<Summary> {
        return this.summaryExtractor.getSummary();
    }

    getInboxSmsList(): Promise<Sms[]> {
        return this.inboxSmsExtractor.getSmsList(Type.INBOX);
    }

    getOutboxSmsList(): Promise<Sms[]> {
        return this.inboxSmsExtractor.getSmsList(Type.OUTBOX);
    }

    getDraftSmsList(): Promise<Sms[]> {
        return this.inboxSmsExtractor.getSmsList(Type.DRAFT);
    }

    setSmsAsRead(smsId: string): Promise<void> {
        return this.smsAsRead.setSmsAsRead(smsId);
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