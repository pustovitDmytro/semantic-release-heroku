#!./node_modules/.bin/babel-node

import path from 'path';
import { docopt } from 'docopt';
import  publish  from '../src/publish';
import  verifyConditions  from '../src/verifyConditions';
import  prepare  from '../src/prepare';

const doc =
`Usage:
   test.js publish <name> <apiKey> <rootDir>
   test.js prepare <name> <apiKey> <rootDir>
   test.js verifyConditions <name> <apiKey> <rootDir>
   test.js -h | --help

Options:
   -h --help    Run test with real credentials.
`;

async function main(opts) {
    try {
        const name = opts['<name>'];
        const apiKey = opts['<apiKey>'];
        const rootDir = opts['<rootDir>'];

        if (opts.publish) {
            await publish.call(
                { verified: { name, apiKey, rootDir: path.resolve(rootDir) } },
                {},
                { logger: console, nextRelease: { version: '1.0.1' } }
            );
        }

        if (opts.verifyConditions) {
            await verifyConditions.call(
                {  },
                { name, npmVersion: true, tarballDir: '.' },
                {
                    logger : console,
                    env    : { HEROKU_API_KEY: apiKey },
                    cwd    : path.resolve(rootDir)
                }
            );
        }

        if (opts.prepare) {
            await prepare.call(
                { verified: { name, tarballDir: '.', rootDir: path.resolve(rootDir) } },
                { },
                {
                    logger      : console,
                    nextRelease : { version: '1.0.2' }
                }
            );
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


main(docopt(doc));
