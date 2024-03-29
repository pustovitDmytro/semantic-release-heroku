import path from 'path';
import { assert } from 'chai';
import md5 from 'md5';
import fs from 'fs-extra';
import tar from 'tar-fs';
import { v4 as uuid } from 'uuid';
import { tmpFolder, entry } from './constants';

export async function checkError(promise, type, message) {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        assert.equal(error.name, type, error.toString());
        assert.match(error.message, new RegExp(message), error.toString());
    }
}

async function extractTar(tarPath) {
    const tmp = path.join(tmpFolder, uuid());
    const extract = tar.extract(tmp);

    await new Promise((res, rej) => {
        extract.on('finish', res);
        extract.on('error', rej);
        fs.createReadStream(tarPath).pipe(extract);
    });

    return tmp;
}

export async function getFiles(dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);

        return (await fs.stat(res)).isDirectory() ? getFiles(res) : res;
    }));

    // eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-spread
    return files.reduce((a, f) => a.concat(f), []);
}

assert.isTarEqual = async function (actualPath, expectedPath) {
    const actTmp = await extractTar(actualPath);
    const expTmp = await extractTar(expectedPath);

    const actFiles = await getFiles(actTmp);
    const expFiles = await getFiles(expTmp);

    const relActFiles = actFiles.map(f => path.relative(actTmp, f));
    const relExpFiles = expFiles.map(f => path.relative(expTmp, f));

    assert.deepEqual(relActFiles.sort(), relExpFiles.sort());

    await Promise.all(relExpFiles.map(async f => {
        const expBuff = await fs.readFile(path.join(expTmp, f));
        const actBuff = await fs.readFile(path.join(actTmp, f));

        assert.equal(md5(actBuff), md5(expBuff), f);
    }));
};

export function load(relPath, clearCache) {
    const absPath = path.resolve(entry, relPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];
    // eslint-disable-next-line security/detect-non-literal-require
    const result =  require(absPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];

    return result;
}

export function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

export class MockLogger {
    constructor() {
        this.messages = [];
    }

    warn(message) {
        this.messages.push({ level: 'warn', message });
    }

    log(message) {
        this.messages.push({ level: 'info', message });
    }
}
