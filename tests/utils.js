import path from 'path';
import { assert } from 'chai';
import md5 from 'md5';
import fs from 'fs-extra';
import { fixturesFolder } from './constants';

export async function checkError(promise, type, message) {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        assert.equal(error.name, type, error.toString());
        assert.match(error.message, new RegExp(message), error.toString());
    }
}

export async function checkMD5(file, hash) {
    const buff = await fs.readFile(file);
    const bb = await fs.readFile(path.join(fixturesFolder, `${hash}.tar`));

    console.log(`${hash}: ${md5(bb)}`);

    assert.equal(md5(buff), hash, `${Buffer.byteLength(buff)}: ${buff.toString()}`);
}
