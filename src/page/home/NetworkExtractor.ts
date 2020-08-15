import Connection from "../../connection/Connection";
import Network, { Signal } from "../../model/home/Network";
import { State } from '../../model/home/State';
import log4js, { Logger } from 'log4js';
import { substringAfter } from '../../utils/StringUtils';

const NET_WORK_TYPE_EX_GSM = '1';
const NET_WORK_TYPE_EX_GPRS = '2';
const NET_WORK_TYPE_EX_EDGE = '3';
const NET_WORK_TYPE_EX_IS95A = '21';
const NET_WORK_TYPE_EX_IS95B = '22';
const NET_WORK_TYPE_EX_CDMA_1x = '23';
const NET_WORK_TYPE_EX_HYBRID_CDMA_1x = '27';

const NET_WORK_TYPE_EX_EVDO_REV_0 = '24';
const NET_WORK_TYPE_EX_EVDO_REV_A = '25';
const NET_WORK_TYPE_EX_EVDO_REV_B = '26';
const NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0 = '28';
const NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A = '29';
const NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B = '30';
const NET_WORK_TYPE_EX_EHRPD_REL_0 = '31';
const NET_WORK_TYPE_EX_EHRPD_REL_A = '32';
const NET_WORK_TYPE_EX_EHRPD_REL_B = '33';
const NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_0 = '34';
const NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_A = '35';
const NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_B = '36';
const NET_WORK_TYPE_EX_WCDMA = '41';
const NET_WORK_TYPE_EX_HSDPA = '42';
const NET_WORK_TYPE_EX_HSUPA = '43';
const NET_WORK_TYPE_EX_HSPA = '44';
const NET_WORK_TYPE_EX_HSPA_PLUS = '45';
const NET_WORK_TYPE_EX_DC_HSPA_PLUS = '46';
const NET_WORK_TYPE_EX_TD_SCDMA = '61';
const NET_WORK_TYPE_EX_TD_HSDPA = '62';
const NET_WORK_TYPE_EX_TD_HSUPA = '63';
const NET_WORK_TYPE_EX_TD_HSPA = '64';
const NET_WORK_TYPE_EX_TD_HSPA_PLUS = '65';
const NET_WORK_TYPE_EX_LTE = '101';

const NET_WORK_TYPE_GSM = '1';
const NET_WORK_TYPE_GPRS = '2';
const NET_WORK_TYPE_EDGE = '3';
const NET_WORK_TYPE_1xRTT = '13';
const NET_WORK_TYPE_1xEVDV = '15';

const NET_WORK_TYPE_WCDMA = '4';
const NET_WORK_TYPE_TDSCDMA = '8';
const NET_WORK_TYPE_EVDO_REV_0 = '10';
const NET_WORK_TYPE_EVDO_REV_A = '11';
const NET_WORK_TYPE_EVDO_REV_B = '12';
const NET_WORK_TYPE_HSDPA = '5';
const NET_WORK_TYPE_HSUPA = '6';
const NET_WORK_TYPE_HSPA = '7';
const NET_WORK_TYPE_HSPA_PLUS = '9';
const NET_WORK_TYPE_HSPA_PLUS_64QAM = '17';
const NET_WORK_TYPE_HSPA_PLUS_MIMO = '18';

const NET_WORK_TYPE_LTE = '19';

const DISCONNECTED_STATUS = [
    '2',
    '3',
    '5',
    '8',
    '20',
    '21',
    '23',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '65538',
    '65539',
    '65567',
    '65568',
    '131073',
    '131074',
    '131076',
    '131078',
    '7',
    '11',
    '14',
    '37',
    '131079',
    '131080',
    '131081',
    '131082',
    '131083',
    '131084',
    '131085',
    '131086',
    '131087',
    '131088',
    '131089',
    '905',
    '12',
    '13',
    '902',
    '112',
    '114',
    '113',
    '115'
];

const CONNECTING_STATUS = '900';
const DISCONNECTING_STATUS = '903';
const CONNECTED_STATUS = '901';

const STATISTIC_TRAFFIC_EXCEEDED_LIMITED = '201';

export default class {

    private connection: Connection;
    private logger: Logger;

    constructor(connection: Connection, activeLog: boolean) {
        this.connection = connection;
        this.logger = log4js.getLogger(substringAfter(__filename, 'huawei-wingle-4g'));
        this.logger.level = activeLog ? 'debug' : 'OFF';
    }

    async getNetwork(): Promise<Network> {
        await this.connection.get('/');

        const statusDocument = await this.connectStatus();

        const operator = await this.getOperator();
        this.logger.debug(`Operator : ${operator}`);

        const type = this.getType(statusDocument);
        this.logger.debug(`Type : ${type}`);

        const signal = this.getSignal(statusDocument);
        const state = this.getState(statusDocument);
        this.logger.debug(`State : ${state}`);

        return {
            type,
            operator,
            signal,
            state
        };
    }

    private async getOperator(): Promise<string> {
        const response = await this.connection.get('/api/net/current-plmn');
        const document = response.document;

        let operatorElement = document.querySelector('ShortName');
        let operator = operatorElement?.textContent;

        if (!operator) {
            operatorElement = document.querySelector('FullName');
            operator = operatorElement?.textContent;
        }

        if (!operator) {
            throw new Error('Unable to find network operator');
        }

        return operator;
    }

    private async connectStatus(): Promise<Document> {
        const response = await this.connection.get('/api/monitoring/status');
        return response.document;
    }

    private getType(document: Document): string {
        const currentNetworkTypeExElement = document.querySelector('CurrentNetworkTypeEx');
        const currentNetworkTypeEx = currentNetworkTypeExElement?.textContent;
        if (currentNetworkTypeEx) {
            switch (currentNetworkTypeEx) {
                case NET_WORK_TYPE_EX_GSM:
                case NET_WORK_TYPE_EX_GPRS:
                case NET_WORK_TYPE_EX_EDGE:
                case NET_WORK_TYPE_EX_IS95A:
                case NET_WORK_TYPE_EX_IS95B:
                case NET_WORK_TYPE_EX_CDMA_1x:
                case NET_WORK_TYPE_EX_HYBRID_CDMA_1x:
                    return '2G';
                case NET_WORK_TYPE_EX_EVDO_REV_0:
                case NET_WORK_TYPE_EX_EVDO_REV_A:
                case NET_WORK_TYPE_EX_EVDO_REV_B:
                case NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0:
                case NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A:
                case NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B:
                case NET_WORK_TYPE_EX_EHRPD_REL_0:
                case NET_WORK_TYPE_EX_EHRPD_REL_A:
                case NET_WORK_TYPE_EX_EHRPD_REL_B:
                case NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_0:
                case NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_A:
                case NET_WORK_TYPE_EX_HYBRID_EHRPD_REL_B:
                case NET_WORK_TYPE_EX_WCDMA:
                case NET_WORK_TYPE_EX_HSDPA:
                case NET_WORK_TYPE_EX_HSUPA:
                case NET_WORK_TYPE_EX_HSPA:
                case NET_WORK_TYPE_EX_HSPA_PLUS:
                case NET_WORK_TYPE_EX_DC_HSPA_PLUS:
                case NET_WORK_TYPE_EX_TD_SCDMA:
                case NET_WORK_TYPE_EX_TD_HSDPA:
                case NET_WORK_TYPE_EX_TD_HSUPA:
                case NET_WORK_TYPE_EX_TD_HSPA:
                case NET_WORK_TYPE_EX_TD_HSPA_PLUS:
                    return '3G';
                case NET_WORK_TYPE_EX_LTE:
                    return '4G';
                default:
                    throw new Error(`Unable to determinate network generation from raw current network type ex : ${currentNetworkTypeEx}'`);
            }
        }

        const currentNetworkTypeElement = document.querySelector('CurrentNetworkType');
        const currentNetworkType = currentNetworkTypeElement?.textContent;
        switch (currentNetworkType) {
            case NET_WORK_TYPE_GSM:
            case NET_WORK_TYPE_GPRS:
            case NET_WORK_TYPE_EDGE:
            case NET_WORK_TYPE_1xRTT:
            case NET_WORK_TYPE_1xEVDV:
                return '2G';
            case NET_WORK_TYPE_WCDMA:
            case NET_WORK_TYPE_TDSCDMA:
            case NET_WORK_TYPE_EVDO_REV_0:
            case NET_WORK_TYPE_EVDO_REV_A:
            case NET_WORK_TYPE_EVDO_REV_B:
            case NET_WORK_TYPE_HSDPA:
            case NET_WORK_TYPE_HSUPA:
            case NET_WORK_TYPE_HSPA:
            case NET_WORK_TYPE_HSPA_PLUS:
            case NET_WORK_TYPE_HSPA_PLUS_64QAM:
            case NET_WORK_TYPE_HSPA_PLUS_MIMO:
                return '3G';
            case NET_WORK_TYPE_LTE:
                return '4G';
            default:
                throw new Error(`Unable to determinate network generation from raw current network type : ${currentNetworkType}'`);
        }
    }

    private getSignal(document: Document): Signal {
        let signalElement = document.querySelector('SignalStrength');
        let signal = signalElement?.textContent;

        if (!signal) {
            signalElement = document.querySelector('SignalIcon');
            signal = signalElement?.textContent;
        }

        if (!signal) {
            throw new Error('Unable to retrieve signal');
        }

        const strength = +signal;
        this.logger.debug(`Signal strength : ${strength}`);

        const total = 5;
        this.logger.debug(`Signal total : ${total}`);

        return { strength, total };
    }

    private getState(document: Document): State {
        const connectionStatusElement = document.querySelector('ConnectionStatus');
        const connectionStatus = connectionStatusElement?.textContent;

        if (!connectionStatus) {
            throw new Error('Unable to retrieve network state');
        }

        if (DISCONNECTED_STATUS.includes(connectionStatus)) {
            return State.DISCONNECTED;
        }

        switch (connectionStatus) {
            case STATISTIC_TRAFFIC_EXCEEDED_LIMITED:
                return State.STATISTIC_TRAFFIC_EXCEEDED_LIMITED;
            case CONNECTING_STATUS:
                return State.CONNECTING;
            case DISCONNECTING_STATUS:
                return State.DISCONNECTING;
            case CONNECTED_STATUS:
                return State.CONNECTED;
            default:
                return State.DISCONNECTED;
        }
    }
}