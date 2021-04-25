import path from 'path';
import { assert } from 'chai';
import { _load } from '../entry';
import Test, { fixturesFolder, tmpFolder } from '../Test';
import { checkMD5 } from '../utils';

const { tarball, gitignoreToGlob } = _load('utils');
const t = new Test();

suite('tar');

before(async function () {
    await t.setTmpFolder();
});

test('Positive: pack folder default ignore', async function () {
    const file = await tarball(
        path.join(fixturesFolder, 'txt_file'),
        tmpFolder
    );

    await checkMD5(file, '1c018477609a1158276d4eb5297e3c3b');
});


test('Positive: pack folder with .gitignore', async function () {
    const file = await tarball(
        path.join(fixturesFolder, 'gitignore'),
        tmpFolder
    );

    await checkMD5(file, 'befa71531e37e0b757be155d5e63a8f4');
});


test('Positive: gitignoreToGlob', async function () {
    [
        [ 'dir', [ '**/dir', '**/dir/**' ] ],
        [ '!dir', [ '!**/dir', '!**/dir/**' ] ],
        [ '/dir', [ 'dir', 'dir/**' ] ]
    ].forEach(([ gitignore, glob ]) => {
        const actual = gitignoreToGlob([ gitignore ]);

        assert.deepEqual(actual, glob);
    });
});

after(async function () {
    // await t.cleanTmpFolder();
});
