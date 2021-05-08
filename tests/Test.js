import path from 'path';
import fse from 'fs-extra';
import { v4 as uuid } from 'uuid';
import { createNamespace } from 'cls-hooked';
import { tmpFolder, fixturesFolder, entry } from './constants';
import './mock';

const context = createNamespace('__TEST__');

beforeEach(function setClsFromContext() {
    const old = this.currentTest.fn;

    this.currentTest._TRACE_ID = uuid();
    this.currentTest.fn = function clsWrapper() {
        return new Promise((res, rej) => {
            context.run(() => {
                context.set('current', {
                    test  : this.test.title,
                    suite : this.test.parent.title,
                    body  : this.test.body,
                    id    : this.test._TRACE_ID
                });

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
