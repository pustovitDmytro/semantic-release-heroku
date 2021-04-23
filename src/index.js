import verifyConditions from './verifyConditions';
import publish from './publish';
import prepare from './prepare';

const context = {};

module.exports = {
    verifyConditions : verifyConditions.bind(context),
    publish          : publish.bind(context),
    prepare          : prepare.bind(context)
};
