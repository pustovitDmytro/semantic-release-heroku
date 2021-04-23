import fse from 'fs-extra';
import { tmpFolder, fixturesFolder } from './constants';

export default class Test {
    async setTmpFolder() {
        await this.cleanTmpFolder();
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }
}

export {
    tmpFolder,
    fixturesFolder
};
