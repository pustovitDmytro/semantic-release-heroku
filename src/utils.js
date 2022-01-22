import os from 'os';
import path from 'path';
import tar from 'tar-fs';
import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';
import globby from 'globby';
import cottus from 'cottus';

import BaseCottusRule from 'cottus/lib/rules/Base';
import BaseCottusError from 'cottus/lib/errors/format/Base';
import { VALIDATION_FAILED } from './Error';

export async function tarball(src, trg = os.tmpdir(), options = {}) {
    const { exclude = [ 'node_modules' ], include = [] } = options;
    const outFile = `${trg}/${uuid()}.tar`;
    const output = fs.createWriteStream(outFile);
    const isGitIgnored = await globby.gitignore({
        cwd    : src,
        ignore : include
    });

    const isNotExcluded = await globby('**', {
        followSymbolicLinks : false,
        onlyFiles           : false,
        expandDirectories   : true,
        dot                 : true,
        cwd                 : src,
        ignore              : exclude
    });
    const osNormalized = new Set(isNotExcluded.map(p => path.normalize(p)));
    const pack = tar.pack(src, {
        ignore(name) {
            return isGitIgnored(name) || !osNormalized.has(path.relative(src, name));
        }
    });

    await new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('end', resolve);
        pack.on('error', reject);
        pack.pipe(output);
    });

    return outFile;
}

class HerokuNameError extends BaseCottusError {
    message = 'Add-on app:name should follow pattern ^[a-z][a-z0-9-]{1,28}[a-z0-9]$'

    code = 'WRONG_HEROKU_NAME'
}

class HerokuNameRule extends BaseCottusRule {
    static schema = 'heroku-name';

    validate(input) {
        const StringRule = this.cottus.rules.string;
        const parentRule = this.createChildRule(StringRule);
        const string = parentRule.validate(input);

        if (!/^[a-z][\da-z-]{1,28}[\da-z]$/.test(string)) throw new HerokuNameError();

        return string;
    }
}

cottus.addRule(HerokuNameRule);

export function validate(data, rules) {
    const validator = cottus.compile([ 'required', { 'attributes': rules } ]);

    try {
        return validator.validate(data);
    } catch (error) {
        throw new VALIDATION_FAILED(JSON.parse(error.prettify));
    }
}
