import path from 'path';
import { validate } from './utils';
import Heroku from './heroku/Heroku';

const rules = {
    name       : [ { like: '^[a-z][a-z0-9-]{1,28}[a-z0-9]$' } ],
    apiKey     : [ 'required', 'string', 'uuid' ],
    rootDir    : [ 'required', 'string' ],
    npmVersion : [ 'boolean' ],
    tarballDir : [ 'string' ],
    ignore     : [ { 'list_of': 'string' } ]
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env }) {
    // eslint-disable-next-line security/detect-non-literal-require
    const info = require(path.resolve(cwd, 'package.json'));
    const raw = {
        ...pluginConfig,
        name    : pluginConfig.name || info.name,
        apiKey  : env.HEROKU_API_KEY,
        rootDir : cwd
    };

    const data = validate(raw, rules);
    const heroku = new Heroku(data.name, data.apiKey);

    logger.log(`Verify Heroku authentication for ${data.name}`);

    const appId = await heroku.test();

    this.verified = data;
    logger.log(`Verified app ${data.name} [${appId}]`);
}

