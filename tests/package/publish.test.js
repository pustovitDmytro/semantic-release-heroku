import path from 'path';
import { assert } from 'chai';
import Tests, { load, tmpFolder, fixturesFolder } from '../Test';
import { checkError, MockLogger } from '../utils';

const { default: publish } = load('publish');
const factory = new Tests();

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

    const apiCalls = factory.getTraces();

    assert.lengthOf(apiCalls, 3);
});

test('Positive: filter branches', async function () {
    const message = 'Skip branch staging, as plugin configured to only run from master';
    const logger = new MockLogger();

    await publish.call(
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

    assert.lengthOf(factory.getTraces(), 0, 'api calls');

    assert.lengthOf(logger.messages, 1);
    assert.deepEqual(logger.messages[0], {
        level : 'warn',
        message
    });
});
