
import { VERIFICATION_MISSED } from './Error';
import Heroku from './heroku/Heroku';

export default async function publish(pluginConfig, { logger, nextRelease }) {
    if (!this.verified) throw new VERIFICATION_MISSED('publish');
    const heroku = new Heroku(this.verified.name, this.verified.apiKey);
    const buildId = await heroku.deploy(this.verified.tarPath, nextRelease.version);

    logger.log(`Published version ${nextRelease.version} to heroku [${buildId}]`);
}
