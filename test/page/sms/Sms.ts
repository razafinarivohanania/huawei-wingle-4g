import builLogin from '../../LoginBuilder';
import Sms from '../../../src/page/sms/Sms';
import { State } from '../../../src/model/sms/Sms';

(async () => {
    const login = await builLogin();

    const sms = new Sms(login);
    sms.activeLog(true);

    await sms.getSummary();

    const inboxSmsList = await sms.getInboxSmsList();
    for (const inboxSms of inboxSmsList) {
        if (inboxSms.state == State.UNREAD) {
            await sms.setSmsAsRead(inboxSms.id);
            break;
        }
    }

    await sms.getOutboxSmsList();
    await sms.getDraftSmsList();
})();