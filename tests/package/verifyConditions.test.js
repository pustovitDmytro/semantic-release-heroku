/* eslint-disable unicorn/filename-case */
// import { assert } from 'chai';
import { assert } from 'chai';
import Test, { load, checkError, MockLogger } from '../Test';

const factory = new Test();

const { default: verifyConditions } = load('verifyConditions');

suite('verifyConditions');

test('Negative: validation failed', async function () {
    await checkError(
        verifyConditions(
            {},
            {
                cwd : process.cwd(),
                env : { HEROKU_API_KEY: '1234' }
            }

        ),
        'VALIDATION_FAILED',
        '{"apiKey":"NOT_UUID"}'
    );
});

test('Positive: valid config', async function () {
    const context = {};

    await verifyConditions.call(
        context,
        { name: 'package-name' },
        {
            cwd    : process.cwd(),
            env    : { HEROKU_API_KEY: 'c5977e4b-970e-4965-aa69-85e781ab488c' },
            logger : console
        }
    );

    assert.deepEqual(
        context.verified,
        {
            name    : 'package-name',
            apiKey  : 'c5977e4b-970e-4965-aa69-85e781ab488c',
            rootDir : process.cwd()
        }
    );

    const apiCalls = factory.getTraces();

    assert.lengthOf(apiCalls, 1);
    assert.deepOwnInclude(apiCalls[0], {
        method : 'GET',
        url    : 'apps/package-name',
        api    : 'HerokuAPI'
    });
});

test('Negative: cant connect heroku api', async function () {
    await checkError(
        verifyConditions.call(
            {},
            { name: 'connection-error' },
            {
                cwd    : process.cwd(),
                env    : { HEROKU_API_KEY: 'c5977e4b-970e-4965-aa69-85e781ab488c' },
                logger : console
            }
        ),
        'API_ERROR',
        'Not Found'
    );
});

test('Positive: filter branches', async function () {
    const context = {};
    const logger = new MockLogger();
    const message = 'Skip branch staging, as plugin configured to only run from master';

    await verifyConditions.call(
        context,
        { name: 'package-name', branches: [ 'master' ] },
        {
            cwd    : process.cwd(),
            env    : { HEROKU_API_KEY: 'c5977e4b-970e-4965-aa69-85e781ab488c' },
            logger,
            branch : { name: 'staging' }
        }
    );
    assert.lengthOf(logger.messages, 1);
    assert.deepEqual(logger.messages[0], {
        level : 'warn',
        message
    });
    assert.deepEqual(
        context.verified,
        {
            skip : true,
            message
        }
    );

    const apiCalls = factory.getTraces();

    assert.lengthOf(apiCalls, 0);
});

test('Positive: branches Config', async function () {
    const context = {};
    const logger = new MockLogger();

    await verifyConditions.call(
        context,
        {
            name     : 'master-name',
            branches : [ 'master', {
                branch : 'staging',
                name   : 'staging-app'
            } ]
        },
        {
            cwd    : process.cwd(),
            env    : { HEROKU_API_KEY: 'c5977e4b-970e-4965-aa69-85e781ab488c' },
            logger,
            branch : { name: 'staging' }
        }
    );
    assert.lengthOf(logger.messages, 2);
    assert.deepEqual(logger.messages, [
        {
            level   : 'info',
            message : 'Verify Heroku authentication for staging-app'
        },
        { level: 'info', message: 'Verified app staging-app [1234]' }
    ]);
    assert.deepEqual(
        context.verified,
        {
            name    : 'staging-app',
            apiKey  : 'c5977e4b-970e-4965-aa69-85e781ab488c',
            rootDir : process.cwd()
        }
    );

    const apiCalls = factory.getTraces();

    assert.lengthOf(apiCalls, 1);
    assert.deepOwnInclude(apiCalls[0], {
        method : 'GET',
        url    : 'apps/staging-app',
        api    : 'HerokuAPI'
    });
});
