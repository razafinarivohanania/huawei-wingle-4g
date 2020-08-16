import buildLogin from "../../LoginBuilder";
import SmsSender from "../../../src/page/sms/SmsSender";

(async () => {
    const login = await buildLogin();

    const smsSender = new SmsSender(login);
    smsSender.activeLog(true);

    const phoneNumbers = ['0', '1', '4'];
    const content = 'Hello world!';
    await smsSender.sendSms(phoneNumbers, content);
})();