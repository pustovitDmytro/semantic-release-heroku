import { assert } from 'chai';
import entry from '../entry';

suite('Configurations');

test('Default configuration', function () {
    assert.exists(entry);
});

test('verifyConditions', function () {
    assert.isFunction(entry.verifyConditions);
});

test('prepare', function () {
    assert.isFunction(entry.prepare);
});

test('publish', function () {
    assert.isFunction(entry.publish);
});
