import Login from "../model/Login";
import Summary from "../model/sms/Summary";
import Sms from "../model/sms/Sms";

export default class {

    private login: Login;

    constructor(login: Login) {
        this.login = login;
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