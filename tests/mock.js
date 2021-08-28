/* eslint-disable security/detect-object-injection */
import { replace } from 'sinon';
import API_ERROR from 'base-api-client/lib/Error';
import { assert } from 'chai';
import { getNamespace } from 'cls-hooked';
import { load } from './utils';

const { default: API } = load('heroku/HerokuApi');

function axiosResponse(data) {
    return { data };
}

function axiosError(message, data) {
    const err = new Error(message);

    err.response = { data };

    return new API_ERROR(err);
}

// eslint-disable-next-line sonarjs/no-unused-collection
export const traces = [];

class MOCK_API extends API {
    log(level, data) {
        traces.push(data);
    }

    async _axios(opts) {
        const isCallToHeroku = opts.url.match('heroku');

        assert.exists(opts.headers);
        if (isCallToHeroku) {
            assert.include(opts.headers.authorization, 'Bearer');
            assert.notInclude(opts.headers.authorization, 'undefined');
            assert.equal(opts.headers.accept, 'application/vnd.heroku+json; version=3');
        } else {
            assert.exists(opts.headers['Content-Length']);
            assert.isEmpty(opts.headers['Content-Type']);
        }

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

    getTraceId() {
        return getNamespace('__TEST__').get('current').id;
    }
}

const methods = Object.getOwnPropertyNames(MOCK_API.prototype).filter(m => m !== 'constructor');

methods.forEach(methodName => {
    replace(API.prototype, methodName, MOCK_API.prototype[methodName]);
});

