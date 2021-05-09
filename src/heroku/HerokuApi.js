import fs from 'fs-extra';
import API from 'base-api-client';

export default class HerokuAPI extends API {
    constructor(name, apiKey) {
        super('https://api.heroku.com/');
        this.name = name;
        this.apiKey = apiKey;
    }

    getHeaders() {
        return {
            accept        : 'application/vnd.heroku+json; version=3',
            authorization : `Bearer ${this.apiKey}`
        };
    }

    async createBuild(src, version) {
        const build = await this.post(
            `/apps/${this.name}/builds`,
            { 'source_blob': { url: src, version } }
        );

        return {
            id     : build.id,
            source : build.source_blob,
            status : build.status
        };
    }

    async createSource(src, version) {
        const source = await this.post(
            `/apps/${this.name}/sources`,
            { 'source_blob': { url: src, version } }
        );

        return {
            get : source.source_blob.get_url,
            put : source.source_blob.put_url
        };
    }

    async upload(url, file) {
        const info = await fs.stat(file);
        const readmeStream = fs.createReadStream(file);

        readmeStream.on('error', console.error);

        await this.put(
            url,
            readmeStream,
            { headers : {
                'Content-Type'   : '',
                'Content-Length' : info.size
            } }
        );
    }

    async test() {
        const app = await this.get(`apps/${this.name}`);

        return app.id;
    }
}
