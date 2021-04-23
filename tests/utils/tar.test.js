// import { assert } from 'chai';
import path from 'path';
import { _load } from '../entry';
import Test, { fixturesFolder, tmpFolder } from '../Test';
import { checkMD5 } from '../utils';

const { tarball } = _load('utils');
const t = new Test();

suite('tar');

before(async function () {
    await t.setTmpFolder();
});

test('Positive: pack folder without ignore', async function () {
    const file = await tarball(
        path.join(fixturesFolder, 'txt_file'),
        tmpFolder
    );

    await checkMD5(file, '1c018477609a1158276d4eb5297e3c3b');
});
