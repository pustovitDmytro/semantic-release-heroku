import fse from 'fs-extra';
import uuid from 'uuid';
import './mock';
import { createNamespace } from 'cls-hooked';
import { tmpFolder, fixturesFolder } from './constants';

const context = createNamespace('__TEST__');

beforeEach(function setClsFromContext() {
    const old = this.currentTest.fn;

    this.currentTest._TRACE_ID = uuid.v4();
    this.currentTest.fn = function clsWrapper() {
        return new Promise((res, rej) => {
            context.run(() => {
                context.set('current', {
                    test  : this.test.title,
                    suite : this.test.parent.title,
                    body  : this.test.body,
                    id    : this.test._TRACE_ID
                });

                // eslint-disable-next-line more/no-then
                Promise.resolve(old.apply(this, arguments))
                    .then(res)
                    .catch(rej);
            });
        });
    };
});

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
