import path from 'path';
import fs from 'fs-extra';
import { isString } from 'myrmidon';
import { validate } from './utils';
import Heroku from './heroku/Heroku';

const pluginConfigRules = {
    name       : [ { like: '^[a-z][a-z0-9-]{1,28}[a-z0-9]$' } ],
    npmVersion : [ 'boolean' ],
    tarballDir : [ 'string' ],
    ignore     : [ { 'list_of': 'string' } ]
};

const rules = {
    ...pluginConfigRules,
    apiKey  : [ 'required', 'string', 'uuid' ],
    rootDir : [ 'required', 'string' ]
};

const branchRules = {
    branches : [ { 'list_of' : { 'or' : [
        'string',
        { 'nested_object' : {
            ...pluginConfigRules,
            branch : [ 'required', 'string' ]
        } }
    ] } } ]
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env, branch }) {
    // eslint-disable-next-line security/detect-non-literal-require
    const rootPackagePath = path.resolve(cwd, 'package.json');
    const info = await fs.readJSON(rootPackagePath);
    const { branches } = validate(pluginConfig, branchRules);

    const branchConfig = {};

    if (branches) {
        const normalized = branches.map(b => isString(b) ? { branch: b } : b);
        const names = normalized.map(b => b.branch);
        const match = normalized.find(b => b.branch === branch.name);

        if (!match) {
            const message = `Skip branch ${branch.name}, as plugin configured to only run from ${names.join(', ')}`;

            logger.warn(message);
            this.verified = { skip: true, message };

            return;
        }

        Object.keys(match)
            .filter(key => key !== 'branch')
            .forEach(key => branchConfig[key] = match[key]);
    }

    const raw = {
        name    : info.name,
        ...pluginConfig,
        ...branchConfig,
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
