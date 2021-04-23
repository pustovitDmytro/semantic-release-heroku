// import { assert } from 'chai';
import { prepare } from '../entry';
import { checkError } from '../utils';

suite('prepare');

test('Negative: run prepare without verify', async function () {
    await checkError(
        prepare(),
        'VERIFICATION_MISSED',
        'verifyConditions should be passed to run step [prepare]'
    );
});
