import path from 'path';
import fs from 'fs-extra';
import libnpmversion from 'libnpmversion';
import { VERIFICATION_MISSED } from './Error';
import { tarball } from './utils';

export default async function prepare(pluginConfig, { logger, nextRelease } = {}) {
    if (!this.verified) throw new VERIFICATION_MISSED('prepare');
    if (this.verified.npmVersion) {
        await libnpmversion(nextRelease.version, {
            path             : this.verified.rootDir,
            allowSameVersion : false,
            commitHooks      : false,
            gitTagVersion    : false,
            force            : false,
            ignoreScripts    : false
        });
        logger.log(`Package version updated to ${nextRelease.version}`);
    }

    const tarPath = await tarball(this.verified.rootDir, undefined, { ignore: this.verified.ignore });

    this.verified.tarPath = tarPath;
    if (this.verified.tarballDir) {
        const verified = this.verified;
        const dir = path.resolve(this.verified.rootDir, verified.tarballDir);

        logger.log(`Moving tarball to ${dir}`);
        verified.tarPath = path.join(dir, `${verified.name}-${nextRelease.version}.tar`);
        await fs.move(tarPath, verified.tarPath);
        logger.log(`Created tarball for ${nextRelease.version} at ${verified.tarPath}`);
    }
}

