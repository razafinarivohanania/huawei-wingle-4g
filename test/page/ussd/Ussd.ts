import buildLogin from "../../LoginBuilder";
import { Ussd } from "../../../src/page/ussd/Ussd";

(async () => {
    const login = await buildLogin();
    const ussd = new Ussd(login);
    ussd.activeLog(true);
    await ussd.sendUssd('#120#');
    await ussd.sendUssd('#359#');
    await ussd.reply('1');
    await ussd.reply('1');
    await ussd.reply('1');
})();