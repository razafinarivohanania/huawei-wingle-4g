import Summary from "../../model/sms/Summary";
import SmsModel, { Type } from "../../model/sms/Sms";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import SummaryExtractor from "./SummaryExtractor";
import InboxSmsExtractor from "./InboxSmsExtractor";
import SmsAsRead from "./SmsAsRead";
import SmsRemover from "./SmsRemover";
import SmsInDraft from "./SmsInDraft";
import SmsSender from "./SmsSender";

export class Sms {

    private login: Login;
    private logger: Logger;
    private summaryExtractor: SummaryExtractor;
    private inboxSmsExtractor: InboxSmsExtractor;
    private smsAsRead: SmsAsRead;
    private smsRemover: SmsRemover;
    private smsInDraft: SmsInDraft;
    private smsSender: SmsSender;

    constructor(login: Login) {
        this.login = login;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.summaryExtractor = new SummaryExtractor(login);
        this.inboxSmsExtractor = new InboxSmsExtractor(login, this.summaryExtractor);
        this.smsAsRead = new SmsAsRead(login);
        this.smsRemover = new SmsRemover(login);
        this.smsInDraft = new SmsInDraft(login);
        this.smsSender = new SmsSender(login);
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
        this.summaryExtractor.activeLog(activeLog);
        this.inboxSmsExtractor.activeLog(activeLog);
        this.smsAsRead.activeLog(activeLog);
        this.smsRemover.activeLog(activeLog);
        this.smsSender.activeLog(activeLog);
    }

    getSummary(): Promise<Summary> {
        return this.summaryExtractor.getSummary();
    }

    getInboxSmsList(): Promise<SmsModel[]> {
        return this.inboxSmsExtractor.getSmsList(Type.INBOX);
    }

    getOutboxSmsList(): Promise<SmsModel[]> {
        return this.inboxSmsExtractor.getSmsList(Type.OUTBOX);
    }

    getDraftSmsList(): Promise<SmsModel[]> {
        return this.inboxSmsExtractor.getSmsList(Type.DRAFT);
    }

    setSmsAsRead(smsId: string): Promise<void> {
        return this.smsAsRead.setSmsAsRead(smsId);
    }

    sendSms(phoneNumbers: string | string[], content: string): Promise<Map<string, boolean>> {
        return this.smsSender.sendSms(phoneNumbers, content);
    }

    saveSmsInDraft(phoneNumbers: string | string[], content: string): Promise<void> {
        return this.smsInDraft.saveSmsInDraft(phoneNumbers, content);
    }

    removeSms(smsIds: string | string[]): Promise<void> {
        return this.smsRemover.removeSms(smsIds);
    }
}