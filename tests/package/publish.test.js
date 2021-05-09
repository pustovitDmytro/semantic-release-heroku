import path from 'path';
import { assert } from 'chai';
import { load, tmpFolder, fixturesFolder, getTraces } from '../Test';
import { checkError } from '../utils';


const { default: publish } = load('publish');

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
                    apiKey  : '9046ceb0-55c6-5bf3-91f9-0a0ef236c00f',
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
                apiKey  : '9046ceb0-55c6-5bf3-91f9-0a0ef236c00f',
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

    const apiCalls = getTraces();

    assert.lengthOf(apiCalls, 3);
});
