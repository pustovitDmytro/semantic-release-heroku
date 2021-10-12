// import { assert } from 'chai';
import path from 'path';
import { assert } from 'chai';
import fs from 'fs-extra';
import Test, { load, tmpFolder, fixturesFolder } from '../Test';
import { checkError, MockLogger } from '../utils';

const { default: prepare } = load('prepare');

suite('prepare');

const t = new Test();

const seeds = {};

before(async function () {
    await t.setTmpFolder();
    seeds.npmFile = await path.join(tmpFolder, 'package.json');
    await fs.copy(path.join(fixturesFolder, 'npm.json'), seeds.npmFile);
});

test('Negative: run prepare without verify', async function () {
    await checkError(
        prepare.call({}),
        'VERIFICATION_MISSED',
        'verifyConditions should be passed to run step \\[prepare\\]'
    );
});

test('Negative: fail on npm version', async function () {
    await checkError(
        prepare.call(
            { verified :
                {
                    name       : 'name',
                    npmVersion : true,
                    rootDir    : path.join(fixturesFolder, 'txt_file')
                } },
            null,
            {
                logger      : console,
                nextRelease : { version: '1.0.2' }
            }
        ),
        'Error',
        'ENOENT: no such file or directory, open'
    );
});

test('Positive: libnpmversion', async function () {
    const logger = new MockLogger();

    await prepare.call(
        { verified :
                {
                    name       : 'libnpmversion',
                    rootDir    : tmpFolder,
                    npmVersion : true,
                    tarballDir : tmpFolder
                } },
        null,
        {
            logger,
            nextRelease : { version: '1.0.2' }
        }
    );

    assert.deepEqual(logger.messages[0], {
        level   : 'info',
        message : 'Package version updated to 1.0.2'
    });
    assert.deepEqual(logger.messages[2], {
        level   : 'info',
        message : `Created tarball for 1.0.2 at ${path.join(tmpFolder, 'libnpmversion-1.0.2.tar')}`
    });

    assert.ok(await fs.exists(
        path.join(tmpFolder, 'libnpmversion-1.0.2.tar')
    ));
});

test('Positive: keep tarball', async function () {
    await prepare.call(
        { verified :
                {
                    name       : 'name',
                    rootDir    : path.join(fixturesFolder, 'txt_file'),
                    tarballDir : tmpFolder
                } },
        null,
        {
            logger      : console,
            nextRelease : { version: '1.0.2' }
        }
    );
});

test('Positive: filter branches', async function () {
    const message = 'Skip branch staging, as plugin configured to only run from master';
    const logger = new MockLogger();

    await prepare.call(
        {
            verified : {
                skip : true,
                message
            }
        },
        null,
        {
            logger,
            nextRelease : { version: '1.0.2' }
        }
    );

    assert.lengthOf(t.getTraces(), 0, 'api calls');

    assert.lengthOf(logger.messages, 1);
    assert.deepEqual(logger.messages[0], {
        level : 'warn',
        message
    });
});


after(async function () {
    await t.cleanTmpFolder();
});
