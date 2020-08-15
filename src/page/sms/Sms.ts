import Summary from "../../model/sms/Summary";
import Sms from "../../model/sms/Sms";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

export default class {

    private login: Login;
    private logger: Logger;

    constructor(login: Login, activeLog = false) {
        this.login = login;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async getSummary(): Promise<Summary> {
        return new Promise(resolve => resolve({
            inbox: {
                seen: 0,
                total: 0
            },
            sent: 0,
            draft: 0
        }));//TODO
    }

    async getInboxSms(): Promise<Sms[]> {
        return new Promise(resolve => resolve([]));//TODO
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