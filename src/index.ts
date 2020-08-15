import HuaweiWingle4G from './HuaweiWingle4G';

export default function getInstance(username: string, password: string, host =  HuaweiWingle4G.getDefaultHost(), activeLog = false) {
    return new HuaweiWingle4G(username, password, host, activeLog);
}