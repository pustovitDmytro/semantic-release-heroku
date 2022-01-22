// import { promisify } from 'util';
import { assert } from 'chai';
import { load, checkError } from '../Test';

import '../utils';

const { validate } = load('utils');
const validateAsync = async (...args) => validate(...args);

suite('validate');

const herokuNameRules = { name: 'heroku-name' };
const herokuNameError = 'WRONG_HEROKU_NAME: Add-on app:name should follow pattern.*';

test('Positive: heroku-name', async function () {
    const valid = validate({ name: 'marc-sullivan14' }, herokuNameRules);

    assert.exists(valid.name, 'marcsullivan14');
});

test('Negative: heroku-name', async function () {
    for (const name of [
        '14marcsullivan',
        'marcSullivan',
        'marc@sullivan'
    ]) {
        await checkError(
            validateAsync({ name }, herokuNameRules),
            'VALIDATION_FAILED',
            `{"name":"${herokuNameError}"}`
        );
    }
});
