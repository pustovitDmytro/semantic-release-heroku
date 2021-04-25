import os from 'os';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs-extra';
import uuid from 'uuid';
import LIVR         from 'livr';
import extraRules   from 'livr-extra-rules';
import { VALIDATION_FAILED } from './Error';

LIVR.Validator.registerDefaultRules(extraRules);

export async function tarball(src, trg = os.tmpdir(), options = {}) {
    const outFile = `${trg}/${uuid.v4()}.tar`;
    const output = fs.createWriteStream(outFile);
    const archive = archiver('tar', {});
    const ignore  = options.ignore
    || await gitignore(path.join(src, '.herokuignore'))
    || await gitignore(path.join(src, '.gitignore'))
    || [ '.git/**', 'node_modules/**' ];

    const promise = new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('end', resolve);
        archive.on('error', reject);
    });

    archive.on('warning', e => console.error(e));
    archive.pipe(output);
    archive.glob('**', { cwd: src, ignore, matchBase: true });
    // archive.directory(src, false);
    archive.finalize();

    await promise;

    return outFile;
}

export function resolveUrl(base, relativeUrl) {
    const baseUrl = base ? new URL(base) : undefined;
    const absoluteUrl = new URL(relativeUrl, baseUrl);

    if (absoluteUrl.href === relativeUrl) {
        return new URL(absoluteUrl,  baseUrl);
    }

    const apiPrefix = baseUrl?.pathname;

    const relPath = (apiPrefix && apiPrefix !== '/')
        ? apiPrefix + absoluteUrl.pathname
        : relativeUrl;

    return new URL(relPath,  baseUrl);
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

async function gitignore(filePath) {
    if (!await fs.exists(filePath)) return;
    const content = await fs.readFile(filePath, { encoding: 'utf8' });

    return gitignoreToGlob(content.split(/\r?\n/).map(s => s.trim()));
}

export function gitignoreToGlob(lines) {
    return lines
        .filter((pattern) => !!pattern && pattern[0] !== '#') // Filter out empty lines and comments.
        // Return pairt [ignoreFlag, pattern], we'll concatenate it later.
        .map(pattern =>
            pattern[0] === '!' ? [ '!', pattern.substring(1) ] : [ '', pattern ],
        // Filter out hidden files/directories (i.e. starting with a dot).
        ).filter((patternPair) => {
            const pattern = patternPair[1];

            return (
                pattern.indexOf('/.') === -1 && pattern.indexOf('.') !== 0
            );
        }).map((patternPair) => {
            const pattern = patternPair[1];

            if (pattern[0] !== '/') {
                return [
                    patternPair[0],
                    `**/${pattern}`
                ];
            }

            return [ patternPair[0], pattern.substring(1) ];
        // We don't know whether a pattern points to a directory or a file and we need files.
        // Therefore, include both `pattern` and `pattern/**` for every pattern in the array.
        }).reduce((result, patternPair) => {
            const pattern = patternPair.join('');

            result.push(pattern);
            result.push(`${pattern}/**`);

            return result;
        }, []);
}
