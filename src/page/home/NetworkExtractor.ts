import Connection from "../../connection/Connection";
import Network from "../../model/home/Network";
import { State } from '../../model/home/State';

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

const MACRO_NET_WORK_TYPE_GSM = '1';
const MACRO_NET_WORK_TYPE_GPRS = '2';
const MACRO_NET_WORK_TYPE_EDGE = '3';
const MACRO_NET_WORK_TYPE_1xRTT = '13';
const MACRO_NET_WORK_TYPE_1xEVDV = '15';

const MACRO_NET_WORK_TYPE_WCDMA = '4';
const MACRO_NET_WORK_TYPE_TDSCDMA = '8';
const MACRO_NET_WORK_TYPE_EVDO_REV_0 = '10';
const MACRO_NET_WORK_TYPE_EVDO_REV_A = '11';
const MACRO_NET_WORK_TYPE_EVDO_REV_B = '12';
const MACRO_NET_WORK_TYPE_HSDPA = '5';
const MACRO_NET_WORK_TYPE_HSUPA = '6';
const MACRO_NET_WORK_TYPE_HSPA = '7';
const MACRO_NET_WORK_TYPE_HSPA_PLUS = '9';
const MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM = '17';
const MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO = '18';

const MACRO_NET_WORK_TYPE_LTE = '19';

export default class {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getNetwork(): Promise<Network> {
        const response = await this.connection.get('/api/net/current-plmn');
        const document = response.document;

        const operator = this.getOperator(document);
        const type = await this.getType();
        return {
            type,
            operator,
            signal: {
                value: 0,
                total: 5
            },
            state: State.OFF
        };
    }

    private getOperator(document: Document): string | null | undefined {
        let operatorElement = document.querySelector('ShortName');
        let operator = operatorElement?.textContent;

        if (!operator) {
            operatorElement = document.querySelector('FullName');
            operator = operatorElement?.textContent;
        }

        return operator;
    }

    private async getType(): Promise<string> {
        const response = await this.connection.get('/api/monitoring/status');
        const document = response.document;

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
            case MACRO_NET_WORK_TYPE_GSM:
            case MACRO_NET_WORK_TYPE_GPRS:
            case MACRO_NET_WORK_TYPE_EDGE:
            case MACRO_NET_WORK_TYPE_1xRTT:
            case MACRO_NET_WORK_TYPE_1xEVDV:
                return '2G';
            case MACRO_NET_WORK_TYPE_WCDMA:
            case MACRO_NET_WORK_TYPE_TDSCDMA:
            case MACRO_NET_WORK_TYPE_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_HSDPA:
            case MACRO_NET_WORK_TYPE_HSUPA:
            case MACRO_NET_WORK_TYPE_HSPA:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO:
                return '3G';
            case MACRO_NET_WORK_TYPE_LTE:
                return '4G';
            default:
                throw new Error(`Unable to determinate network generation from raw current network type : ${currentNetworkType}'`);
        }
    }

}