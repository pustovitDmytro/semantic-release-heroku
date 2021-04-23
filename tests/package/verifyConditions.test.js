// import { assert } from 'chai';
import { assert } from 'chai';
import { _load } from '../entry';
import { checkError } from '../utils';

const { default: verifyConditions } = _load('verifyConditions');

suite('verifyConditions');

test('Negative: validation failed', async function () {
    await checkError(
        verifyConditions(
            {},
            {
                cwd : process.cwd(),
                env : { HEROKU_API_KEY: '1234' }
            },

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
        },
    );

    assert.deepEqual(context.verified,
        {
            name    : 'package-name',
            apiKey  : 'c5977e4b-970e-4965-aa69-85e781ab488c',
            rootDir : process.cwd()
        }
    );
});
