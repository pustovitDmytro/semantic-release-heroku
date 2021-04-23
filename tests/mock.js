import sinon from 'sinon';
import createAxiosError from 'axios/lib/core/createError';
import { _load } from './entry';

const { default: API } = _load('heroku/HerokuApi');

function axiosResponse(data) {
    return { data };
}

function axiosError(opts, { message, code }, data) {
    return createAxiosError(message, opts, code, {}, { data });
}

class MOCK_API extends API {
    async _axios(opts) {
        if (opts.method === 'POST' && opts.url.match('/apps/fail/sources')) {
            throw axiosError(opts, {
                message : 'Not Found',
                code    : 404
            }, { name: 'name_not_found' });
        }
        if (opts.method === 'POST' && opts.url.match('/apps/publish/sources')) {
            return axiosResponse({ 'source_blob' : {
                'get_url' : 'http://ziel.tp/fig',
                'put_url' : 'http://ek.tr/ibebowohu'
            } });
        }

        return axiosResponse(1);
    }
}

const methods = Object.getOwnPropertyNames(MOCK_API.prototype).filter(m => m !== 'constructor');

methods.forEach(methodName => {
    sinon.replace(API.prototype, methodName, MOCK_API.prototype[methodName]);
});

