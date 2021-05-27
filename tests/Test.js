import fse from 'fs-extra';
import { getNamespace } from 'cls-hooked';
import { tmpFolder } from './constants';
import { traces } from './mock';
import './init-hooks';


export * from './utils';
export * from './constants';

export default class Test {
    async setTmpFolder() {
        await this.cleanTmpFolder();
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }

    getTraces() {
        const traceID = getNamespace('__TEST__').get('current').id;

        return traces.filter(t => t.type === 'requestSent' && t.traceId === traceID);
    }
}
