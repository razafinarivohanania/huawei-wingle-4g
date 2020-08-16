import { Home } from './page/home/Home';
import { State } from './model/home/State';
import Sms from './page/sms/Sms';
import Statistics from './page/statistics/Statistics';
import Ussd from './page/ussd/Ussd';
import HuaweiWingle4G from './HuaweiWingle4G';

export default {
    HuaweiWingle4G,
    Home,
    Sms,
    Statistics,
    Ussd,
    HomeNetworkState: State
};