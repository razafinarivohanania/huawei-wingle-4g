import SmsInDraft from '../../../src/page/sms/SmsInDraft';
import buildLogin from '../../LoginBuilder';

(async () => {
    const login = await buildLogin();
    const smsInDraft = new SmsInDraft(login);
    smsInDraft.activeLog(true);

    const phoneNumbers = ['0', '1', '2'];
    const content = 'Hello world!';
    await smsInDraft.saveSmsInDraft(phoneNumbers, content);
})();