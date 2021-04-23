// import { assert } from 'chai';
import path from 'path';
import { _load } from '../entry';
import { checkError } from '../utils';
import  Test, { tmpFolder, fixturesFolder } from '../Test';

const { default: prepare } = _load('prepare');

suite('prepare');

const t = new Test();

before(async function () {
    await t.setTmpFolder();
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
                { name: 'name', npmVersion: true, rootDir: tmpFolder }
            },
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

test('Positive: keep tarball', async function () {
    await prepare.call(
        { verified :
                {
                    name       : 'name',
                    rootDir    : path.join(fixturesFolder, 'txt_file'),
                    tarballDir : tmpFolder
                }
        },
        null,
        {
            logger      : console,
            nextRelease : { version: '1.0.2' }
        }
    );
});

after(async function () {
    await t.cleanTmpFolder();
});
