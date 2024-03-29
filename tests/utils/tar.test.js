import path from 'path';
import { assert } from 'chai';
import fs from 'fs-extra';
import Test, { load, fixturesFolder, tmpFolder } from '../Test';

import '../utils';

const { tarball } = load('utils');
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
