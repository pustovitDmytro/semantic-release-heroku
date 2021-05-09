
import Api from './HerokuApi';

export default class Heroku {
    constructor(name, apiKey, logger) {
        this.api = new Api(name, apiKey);
        this.logger = logger;
    }

    async deploy(file, version) {
        const source = await this.api.createSource();

        await this.api.upload(source.put, file);
        const build = await this.api.createBuild(source.get, version);

        return build.id;
    }

    test() {
        return this.api.test();
    }
}
