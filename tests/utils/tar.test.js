import path from 'path';
import { assert } from 'chai';
import fs from 'fs-extra';
import { _load } from '../entry';
import Test, { fixturesFolder, tmpFolder } from '../Test';
import '../utils';

const { tarball } = _load('utils');
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

    await assert.isTarEqual(file, path.join(fixturesFolder, 'txt_file.tar'));
});


test('Positive: pack folder with .gitignore', async function () {
    await fs.move(
        path.join(fixturesFolder, 'gitignore', '.herokuignore'),
        path.join(fixturesFolder, 'gitignore', '.gitignore')
    );
    try {
        const file = await tarball(
            path.join(fixturesFolder, 'gitignore'),
            tmpFolder
        );

        await assert.isTarEqual(file, path.join(fixturesFolder, 'gitignore.tar'));
    // eslint-disable-next-line no-useless-catch
    } catch (err) {
        throw err;
    } finally {
        await fs.move(
            path.join(fixturesFolder, 'gitignore', '.gitignore'),
            path.join(fixturesFolder, 'gitignore', '.herokuignore')
        );
    }
});

after(async function () {
    await t.cleanTmpFolder();
});
