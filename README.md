# semantic-release-heroku
[semantic-release][sr-url] plugin. Provides the ability to publish [Heroku][h-url] apps.

[![Version][badge-vers]][npm]
[![Bundle size][npm-size-badge]][npm-size-url]
[![Downloads][npm-downloads-badge]][npm]

[![CodeFactor][codefactor-badge]][codefactor-url]
[![SonarCloud][sonarcloud-badge]][sonarcloud-url]
[![Codacy][codacy-badge]][codacy-url]
[![Total alerts][lgtm-alerts-badge]][lgtm-alerts-url]
[![Language grade][lgtm-lg-badge]][lgtm-lg-url]
[![Scrutinizer][scrutinizer-badge]][scrutinizer-url]

[![Dependencies][badge-deps]][npm]
[![Vulnerabilities][badge-vuln]](https://snyk.io/)
[![Build Status][tests-badge]][tests-url]
[![Coverage Status][badge-coverage]][url-coverage]

[![Commit activity][commit-activity-badge]][github]
[![License][badge-lic]][github]

## Table of Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contribute](#contribute)

## Requirements
To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `6.0+`
* npm `3.0+`

This package is shipped as [semantic-release][sr-url] plugin, so you need to have semantic-release installed and configured.

## Installation

To install the library, run the following command:

```bash
  npm i --save-dev semantic-release-heroku
```

## Usage

The plugin can be configured in the semantic-release [configuration file][sr-config]:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-heroku"
  ]
}
```
This is a minimal usage sample with a default configuration. 
### Configuration

if needed, the configuration can be extended:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["semantic-release-heroku", {
      "name": "funny-app",
      "npmVersion": false,
      "tarballDir": "./dist"
    }]
  ]
}
```
Config attribute description:

| Option | Required | Type | Description | Default |
|----|---|---|------------------------------------|------------------------------------|
| `name`          | no | ```string```  | Heroku application name.    | name from package.json |
| `npmVersion`    | no | ```boolean``` | Whether to update package.json and package-lock with new version value | ```false```, package.json won't be touched      |
| `tarballDir`    | no |  ```string```  | Path to directory, where you can keep generated tarball. | Tarball will be generated into os /tmp directory |


[sr-url]: https://github.com/semantic-release/semantic-release
[sr-config]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration
[h-url]: https://www.heroku.com/home
[h-profile]: https://dashboard.heroku.com/account

### Authentication

In order to publish stuff to Heroku, you should obtain the Heroku API token. The easiest way to achieve this is to open [profile page][h-profile] and reveal the API key.

If you already have an API key, add it as an environment variable:
```sh
  HEROKU_API_KEY='<uuid>'
```

## Contribute

Make the changes to the code and tests. Then commit to your branch. Be sure to follow the commit message conventions.

Commit message summaries must follow this basic format:
```
  Tag: Message (fixes #1234)
```

The Tag is one of the following:
* **Fix** - for a bug fix.
* **Update** - for a backwards-compatible enhancement.
* **Breaking** - for a backwards-incompatible enhancement.
* **Docs** - changes to documentation only.
* **Build** - changes to build process only.
* **New** - implemented a new feature.
* **Upgrade** - for a dependency upgrade.
* **Chore** - for tests, refactor, style, etc.

The message summary should be a one-sentence description of the change. The issue number should be mentioned at the end.


[npm]: https://www.npmjs.com/package/semantic-release-heroku
[github]: https://github.com/pustovitDmytro/semantic-release-heroku
[coveralls]: https://coveralls.io/github/pustovitDmytro/semantic-release-heroku?branch=master
[badge-deps]: https://img.shields.io/david/pustovitDmytro/semantic-release-heroku.svg
[badge-vuln]: https://img.shields.io/snyk/vulnerabilities/npm/semantic-release-heroku.svg?style=popout
[badge-vers]: https://img.shields.io/npm/v/semantic-release-heroku.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/semantic-release-heroku.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/semantic-release-heroku/badge.svg?branch=master
[url-coverage]: https://coveralls.io/github/pustovitDmytro/semantic-release-heroku?branch=master

[tests-badge]: https://img.shields.io/circleci/build/github/pustovitDmytro/semantic-release-heroku
[tests-url]: https://app.circleci.com/pipelines/github/pustovitDmytro/semantic-release-heroku

[codefactor-badge]: https://www.codefactor.io/repository/github/pustovitdmytro/semantic-release-heroku/badge
[codefactor-url]: https://www.codefactor.io/repository/github/pustovitdmytro/semantic-release-heroku

[commit-activity-badge]: https://img.shields.io/github/commit-activity/m/pustovitDmytro/semantic-release-heroku

[scrutinizer-badge]: https://scrutinizer-ci.com/g/pustovitDmytro/semantic-release-heroku/badges/quality-score.png?b=master
[scrutinizer-url]: https://scrutinizer-ci.com/g/pustovitDmytro/semantic-release-heroku/?branch=master

[lgtm-lg-badge]: https://img.shields.io/lgtm/grade/javascript/g/pustovitDmytro/semantic-release-heroku.svg?logo=lgtm&logoWidth=18
[lgtm-lg-url]: https://lgtm.com/projects/g/pustovitDmytro/semantic-release-heroku/context:javascript

[lgtm-alerts-badge]: https://img.shields.io/lgtm/alerts/g/pustovitDmytro/semantic-release-heroku.svg?logo=lgtm&logoWidth=18
[lgtm-alerts-url]: https://lgtm.com/projects/g/pustovitDmytro/semantic-release-heroku/alerts/

[codacy-badge]: https://app.codacy.com/project/badge/Grade/38a4099c7c0841c38dac84e234306649
[codacy-url]: https://www.codacy.com/gh/pustovitDmytro/semantic-release-heroku/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pustovitDmytro/semantic-release-heroku&amp;utm_campaign=Badge_Grade

[sonarcloud-badge]: https://sonarcloud.io/api/project_badges/measure?project=pustovitDmytro_semantic-release-heroku&metric=alert_status
[sonarcloud-url]: https://sonarcloud.io/dashboard?id=pustovitDmytro_semantic-release-heroku

[npm-downloads-badge]: https://img.shields.io/npm/dw/semantic-release-heroku
[npm-size-badge]: https://img.shields.io/bundlephobia/min/semantic-release-heroku
[npm-size-url]: https://bundlephobia.com/result?p=semantic-release-heroku
