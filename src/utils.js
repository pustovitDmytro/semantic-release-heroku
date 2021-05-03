import os from 'os';
import path from 'path';
import tar from 'tar-fs';
import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';
import LIVR         from 'livr';
import extraRules   from 'livr-extra-rules';
import { VALIDATION_FAILED } from './Error';

const globby = require('globby');

LIVR.Validator.registerDefaultRules(extraRules);

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

    const pack = tar.pack(src, {
        ignore(name) {
            return isGitIgnored(name) || !isNotExcluded.includes(path.relative(src, name));
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

export function validate(data, rules) {
    const validator = new LIVR.Validator(rules).prepare();
    const result = validator.validate(data);

    if (!result) {
        const fields = validator.getErrors();

        throw new VALIDATION_FAILED(fields);
    }

    return result;
}
