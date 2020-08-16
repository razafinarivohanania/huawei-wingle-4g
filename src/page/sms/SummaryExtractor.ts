import Connection from "../../connection/Connection";
import Login from "../../connection/Login";
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';
import Summary from '../../model/sms/Summary';
import getFieldValue from '../../utils/ElemenUtils';

export default class {

    private login: Login;
    private connection: Connection;
    private logger: Logger;

    constructor(login: Login) {
        this.login = login;
        this.connection = login.getConnnection();
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
    }

    activeLog(activeLog: boolean) {
        this.logger.level = activeLog ? 'debug' : 'OFF';
        this.login.activeLog(activeLog);
    }

    async getSummary(): Promise<Summary> {
        await this.connection.openHomePage();
        await this.login.login();

        const response = await this.connection.get('/api/sms/sms-count');
        const document = response.document;

        const unread = getFieldValue(document, 'LocalUnread', 'Unread received SMS', this.logger);
        const total = getFieldValue(document, 'LocalInbox', 'Total received SMS', this.logger);
        const sent = getFieldValue(document, 'LocalOutbox', 'Sent SMS', this.logger);
        const draft = getFieldValue(document, 'LocalDraft', 'Draft SMS', this.logger);

        return {
            inbox: {
                unread: +unread,
                total: +total
            },
            outbox: +sent,
            draft: +draft
        };
    }
}