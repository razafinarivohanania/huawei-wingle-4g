import builLogin from '../../LoginBuilder';
import { Sms } from '../../../src/page/sms/Sms';
import { State } from '../../../src/model/sms/Sms';

(async () => {
    const login = await builLogin();

    const sms = new Sms(login);
    sms.activeLog(true);

    await sms.getSummary();

    let inboxSmsList = await sms.getInboxSmsList();
    for (const inboxSms of inboxSmsList) {
        if (inboxSms.state == State.UNREAD) {
            await sms.setSmsAsRead(inboxSms.id);
            break;
        }
    }

    inboxSmsList = await sms.getInboxSmsList();
    const smsIds: string[] = [];
    for (let i = 0; i < inboxSmsList.length && i < 2; i++) {
        smsIds.push(inboxSmsList[i].id);
    }
    await sms.removeSms(smsIds);

    await sms.getOutboxSmsList();
    await sms.getDraftSmsList();
})();