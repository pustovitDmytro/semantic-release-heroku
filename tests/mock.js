/* eslint-disable security/detect-object-injection */
import sinon from 'sinon';
import { _load } from './entry';
import API_ERROR from 'base-api-client/lib/Error';

const { default: API } = _load('heroku/HerokuApi');

function axiosResponse(data) {
    return { data };
}

function axiosError(message, data) {
    const err = new Error(message);

    err.response = { data };

    return new API_ERROR(err);
}

class MOCK_API extends API {
    async _axios(opts) {
        if (opts.method === 'POST' && opts.url.match('/apps/fail/sources')) {
            throw axiosError('Not Found', { name: 'name_not_found' });
        }

        if (opts.method === 'POST' && opts.url.match('/apps/publish/sources')) {
            return axiosResponse({ 'source_blob' : {
                'get_url' : 'http://ziel.tp/fig',
                'put_url' : 'http://ek.tr/ibebowohu'
            } });
        }

        if (opts.url.match('conncection-error')) {
            throw axiosError('Not Found');
        }

        return axiosResponse(1);
    }
}

const methods = Object.getOwnPropertyNames(MOCK_API.prototype).filter(m => m !== 'constructor');

methods.forEach(methodName => {
    sinon.replace(API.prototype, methodName, MOCK_API.prototype[methodName]);
});

