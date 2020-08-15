import Summary from "../model/sms/Summary";
import Sms from "../model/sms/Sms";
import Connection from "../connection/Connection";

export default class {

    private username: string;
    private password: string;
    private connection: Connection;

    constructor(username: string, password: string, connection: Connection) {
        this.username = username;
        this.password = password;
        this.connection = connection;
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