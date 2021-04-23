// import { assert } from 'chai';
import path from 'path';
import { _load } from '../entry';
import { checkError } from '../utils';
import  { tmpFolder, fixturesFolder } from '../Test';

const { default: publish } = _load('publish');

suite('publish');

test('Negative: run publish without verify', async function () {
    await checkError(
        publish.call({}, null, {}),
        'VERIFICATION_MISSED',
        'verifyConditions should be passed to run step \\[publish\\]'
    );
});

test('Negative: unexpected error from heroku api', async function () {
    await checkError(
        publish.call(
            {
                verified : {
                    name    : 'fail',
                    rootDir : tmpFolder,
                    tarPath : path.join(fixturesFolder, 'tarball.tar')
                }
            },
            null,
            {
                logger      : console,
                nextRelease : { version: '1.0.2' }
            }
        ),
        'API_ERROR',
        '{"name":"name_not_found"}'
    );
});

test('Positive: deploy to heroku', async function () {
    await publish.call(
        {
            verified : {
                name    : 'publish',
                rootDir : tmpFolder,
                tarPath : path.join(fixturesFolder, 'tarball.tar')
            }
        },
        null,
        {
            logger      : console,
            nextRelease : { version: '1.0.2' }
        }
    );
});
