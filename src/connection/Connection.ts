import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import tough, { CookieJar } from 'tough-cookie';
import log4js, { Logger } from 'log4js';
import { JSDOM } from 'jsdom';
import { substringAfter } from '../utils/StringUtils';
import Response from './Response';

export default class Connection {
    private connection: AxiosInstance;
    private cookieJar: CookieJar;
    private logger: Logger;
    private requestVerificationToken: string | undefined;

    constructor(activeLog = false) {
        this.connection = this.createConnection();
        this.cookieJar = new tough.CookieJar();
        this.logger = this.buildLogger(activeLog);
        this.requestVerificationToken = undefined;
    }

    private buildLogger(activeLog: boolean): Logger {
        const logger = log4js.getLogger(substringAfter(__filename, 'telma-4g'));
        logger.level = activeLog ? 'debug' : 'OFF';
        return logger;
    }

    private createConnection(): AxiosInstance {
        return axios.create({
            withCredentials: true,
            maxRedirects: 0,
            validateStatus: () => true,
            headers: {
                Connection: 'keep-alive',
                Pragma: 'no-cache',
                'Cache-Control': 'no-cache',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                Accept: ' text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
    }

    async get(url: string, maxRedirection = 5): Promise<Response> {
        this.logger.debug(`GET connect on url : ${url}`);

        const cookies = await this.getCookies(url);

        const request: AxiosRequestConfig = {
            method: 'get',
            url
        };

        if (cookies) {
            request.headers = {
                Cookie: cookies
            };
        }

        const response = await this.connection.request(request);
        this.logger.debug(`Status : ${response.status}`);
        this.storeCookies(response, url);

        if (this.isRedirection(response.status)) {
            const redirectUrl = response.request.res.headers.location;
            this.logger.debug('Redirect url', redirectUrl);

            if (maxRedirection <= 0) {
                const messageError = 'Max redirect reached';
                this.logger.error(messageError);
                throw new Error(messageError);
            }

            return await this.get(redirectUrl, maxRedirection - 1);
        }

        this.requestVerificationToken = Connection.getTokenFromHeaders(response);

        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        return {
            status: response.status,
            document
        };
    }

    async post(url: string, parameters: string, additionalHeaders: any, maxRedirection = 5): Promise<Response> {
        this.logger.debug(`POST connect on url : ${url}`);
        this.logger.debug(`Parameters : ${parameters}`);

        const cookies = await this.getCookies(url);
        const request: AxiosRequestConfig = {
            method: 'post',
            url,
            data: parameters
        };

        if (additionalHeaders) {
            request.headers = additionalHeaders;
        }

        if (cookies) {
            if (!request.headers) {
                request.headers = {};
            }

            request.headers.Cookie = cookies;
        }

        const response = await this.connection.request(request);
        this.logger.debug(`Status : ${response.status}`);
        this.storeCookies(response, url);

        if (this.isRedirection(response.status)) {
            const redirectUrl = response.request.res.headers.location;
            this.logger.debug(`Redirect url : ${redirectUrl}`);

            if (maxRedirection <= 0) {
                const messageError = 'Max redirect reached';
                throw new Error(messageError);
            }

            return await this.get(redirectUrl, maxRedirection - 1);
        }

        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        this.requestVerificationToken = Connection.getTokenFromHeaders(response);

        return {
            status: response.status,
            document
        };
    }

    private async getCookies(url: string) {
        return new Promise((resolve, reject) => {
            this.cookieJar.getCookies(url, { secure: true }, (err, cookies) => {
                if (err) {
                    reject(err);
                } else {
                    const stringCookies = cookies.map(cookie => cookie.cookieString()).join('; ');
                    this.logger.debug(`Cookies [${stringCookies}] for [${url}]`);
                    resolve(cookies.map(cookie => cookie.cookieString()).join('; '));
                }
            })
        });
    }

    private isRedirection(status: number): boolean {
        return [301, 302, 307].includes(status);
    }

    private async storeCookies(response: AxiosResponse, url: string) {
        const headers = response.headers;
        if (!headers) {
            return;
        }

        const cookies = headers['set-cookie'];
        if (!cookies) {
            return;
        }

        if (Array.isArray(cookies)) {
            cookies.forEach(cookie => this.cookieJar.setCookie(cookie, url, () => { }))
        } else {
            this.cookieJar.setCookie(cookies, url, () => { });
        }
    }

    static getTokenFromHeaders(response: AxiosResponse): string | undefined {
        if (!response) {
            return;
        }

        const headers = response.headers;
        if (!headers) {
            return;
        }

        const names = ['__requestverificationtokenone', '__requestverificationtoken'];
        for (const name of names) {
            if (headers[name]) {
                return headers[name];
            }
        }
    }
}