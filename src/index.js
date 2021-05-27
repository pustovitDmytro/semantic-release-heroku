import verifyConditionsFn from './verifyConditions';
import publishFn from './publish';
import prepareFn from './prepare';

const context = {};

const verifyConditions = verifyConditionsFn.bind(context);
const publish          = publishFn.bind(context);
const prepare          = prepareFn.bind(context);

export {
    verifyConditions,
    publish,
    prepare
};
