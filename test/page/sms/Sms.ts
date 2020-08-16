import builLogin from '../../LoginBuilder';
import Sms from '../../../src/page/sms/Sms';

(async () => {
    const login = await builLogin();

    const sms = new Sms(login);
    sms.activeLog(true);
    
    await sms.getSummary();
    await sms.getInboxSms();
})();