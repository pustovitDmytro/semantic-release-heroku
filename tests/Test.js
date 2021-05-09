import path from 'path';
import fse from 'fs-extra';
import { tmpFolder, fixturesFolder, entry } from './constants';
import './mock';
import './init-hooks';
// import * as utils from './utils';

export default class Test {
    async setTmpFolder() {
        await this.cleanTmpFolder();
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }
}

function load(relPath) {
    // eslint-disable-next-line security/detect-non-literal-require
    return require(path.join(entry, relPath));
}

function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

export {
    tmpFolder,
    fixturesFolder,
    entry,
    load,
    resolve
};

export * from './utils';
