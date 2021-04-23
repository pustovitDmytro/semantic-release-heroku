import { assert } from 'chai';
import md5 from 'md5';
import fs from 'fs-extra';

export async function checkError(promise, type, message) {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        assert.equal(error.name, type, error.toString());
        assert.match(error.message, new RegExp(message), error.toString());
    }
}

export async function checkMD5(file, hash, message) {
    const buff = await fs.readFile(file);

    assert.equal(md5(buff), hash, message);
}
