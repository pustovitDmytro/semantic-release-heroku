import { URL } from 'url';
import axios from 'axios';
import uuid from 'uuid';
import { API_ERROR } from '../Error';
import { resolveUrl } from '../utils';

const mockLogger = { log: () => {} };

export default class API {
    constructor(url, auth, { timeout = 60 * 1000 } = {}) {
        this.url = new URL(url);
        this.auth = auth;
        this.timeout = timeout;
        this.initLogger();
    }

    initLogger(logger = mockLogger) {
        this.logger = logger;
    }

    onError(error) {
        if (error.isAxiosError) throw new API_ERROR(error);
        throw error;
    }

    onResponse(res) {
        return res.data;
    }

    _getUrl(relativeUrl) {
        return resolveUrl(this.url, relativeUrl);
    }

    _getHeaders() {
        return {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json'
        };
    }

    async _axios(axiosOptions) {
        return axios(axiosOptions);
    }

    getTraceId({ traceId }) {
        return traceId || uuid.v4();
    }

    async request(method, url, reqOptions = {}, settings = {}) {
        const { headers, data, params, ...options } = reqOptions;
        const traceId = this.getTraceId(settings);

        this.logger.log('debug', { method, url, ...reqOptions, api: this.constructor.name, traceId, type: 'requestSent' });
        const axiosOptions = {
            timeout : this.timeout,
            method,
            url     : this._getUrl(url).href,
            headers : headers || this._getHeaders(),
            data    : data || {},
            params  : params || {},
            ...options
        };

        try {
            const response = await this._axios(axiosOptions);

            this.logger.log('verbose', { traceId, type: 'responseReceived', data: response.data });

            const handleResponse = settings.onResponse || this.onResponse;

            return handleResponse(response);
        } catch (error) {
            this.logger.log('verbose', { traceId, error: error.toString(), data: error.response?.data, stack: error.stack, type: 'errorOccured' });
            const onError = settings.onError || this.onError;

            onError(error);
        }
    }

    get(url, params, options = {}) {
        return this.request('GET', url, {
            params,
            ...options
        });
    }

    post(url, data, options = {}) {
        return this.request('POST', url, {
            data,
            ...options
        });
    }

    put(url, data, options = {}) {
        return this.request('PUT', url, {
            data,
            ...options
        });
    }

    delete(url, options = {}) {
        return this.request('DELETE', url, {
            ...options
        });
    }

    async mock() {
        return { data: {} };
    }
}
