import path from 'path';
import fs from 'fs-extra';
import { validate } from './utils';
import Heroku from './heroku/Heroku';

const rules = {
    name       : [ { like: '^[a-z][a-z0-9-]{1,28}[a-z0-9]$' } ],
    apiKey     : [ 'required', 'string', 'uuid' ],
    rootDir    : [ 'required', 'string' ],
    npmVersion : [ 'boolean' ],
    tarballDir : [ 'string' ],
    branches   : [ { 'list_of': 'string' } ],
    ignore     : [ { 'list_of': 'string' } ]
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env, branch }) {
    // eslint-disable-next-line security/detect-non-literal-require
    const rootPackagePath = path.resolve(cwd, 'package.json');
    const info = await fs.readJSON(rootPackagePath);
    const raw = {
        ...pluginConfig,
        name    : pluginConfig.name || info.name,
        apiKey  : env.HEROKU_API_KEY,
        rootDir : cwd
    };

    const data = validate(raw, rules);

    if (data.branches && !data.branches.includes(branch.name)) {
        const message = `Skip branch ${branch.name}, as plugin configured to only run from ${data.branches.join(', ')}`;

        logger.warn(message);
        this.verified = { skip: true, message };

        return;
    }

    const heroku = new Heroku(data.name, data.apiKey);

    logger.log(`Verify Heroku authentication for ${data.name}`);

    const appId = await heroku.test();

    this.verified = data;
    logger.log(`Verified app ${data.name} [${appId}]`);
}
