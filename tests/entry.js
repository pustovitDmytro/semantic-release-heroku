/* eslint-disable security/detect-non-literal-require */
import { entry } from './constants';

const m = require(entry);

export default m.default;

const {
    verifyConditions,
    publish,
    prepare
} = m;

export {
    verifyConditions,
    publish,
    prepare
};
