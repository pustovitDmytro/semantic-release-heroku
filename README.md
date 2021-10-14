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
[![Security][snyk-badge]][snyk-url]
[![Build Status][tests-badge]][tests-url]
[![Coverage Status][badge-coverage]][url-coverage]

[![Commit activity][commit-activity-badge]][github]
[![FOSSA][fossa-badge]][fossa-url]
[![License][badge-lic]][github]

## Table of Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contribute](#contribute)

## Requirements
[![Platform Status][appveyor-badge]][appveyor-url]

To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `>=10`
* npm `>=6`

Package is [continuously tested][appveyor-url] on darwin, linux, win32 platforms. All active and maintenance [LTS](https://nodejs.org/en/about/releases/) node releases are supported.

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
| `branches`      | no | ```array``` | The branches on which releases should happen. See details on [branches configuration](#branches). | -

### branches
semantic-release [allow to manage][sr-complex-workflows] and automate complex release workflows. You can vary plugin settings based on the target branch. Use the `branches` keyword for this:
 1. Skip specific branch from heroku deploy:
   ```json
    "branches": ["master", "next"],
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [ 
            "semantic-release-heroku", {
                "branches": ["master"]
            } 
        ]
    ]
   ```
   here semantic release will run both *master* and *next* branches, but `semantic-release-heroku` will skip the *next* branch. 
  
  2. Use different plugin settings for contrasting branches. You can override any setting on the branch level. See example for custom app names:
   ```json
   [ 
      "semantic-release-heroku", {
          "branches": [
            "master", 
            { "branch": "next", "name": "staging-app" }
          ],
          "name": "production-app",
          "npmVersion": true
      } 
   ]
   ```
   here for both *master* and *next* branches package.json version will be updated `("npmVersion": true)`. But Heroku apps will have different names (`staging-app` for *next* and `production-app` for *master* )

[sr-url]: https://github.com/semantic-release/semantic-release
[sr-config]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration
[sr-complex-workflows]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md
[h-url]: https://www.heroku.com/home
[h-profile]: https://dashboard.heroku.com/account

### Authentication

In order to publish stuff to Heroku, you should obtain the Heroku API token. The easiest way to achieve this is to open [profile page][h-profile] and reveal the API key.

If you already have an API key, add it as an environment variable:
```sh
  HEROKU_API_KEY='<uuid>'
```

## Contribute

Make the changes to the code and tests. Then commit to your branch. Be sure to follow the commit message conventions. Read [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

[npm]: https://www.npmjs.com/package/semantic-release-heroku
[github]: https://github.com/pustovitDmytro/semantic-release-heroku
[coveralls]: https://coveralls.io/github/pustovitDmytro/semantic-release-heroku?branch=master
[badge-deps]: https://img.shields.io/david/pustovitDmytro/semantic-release-heroku.svg
[badge-vers]: https://img.shields.io/npm/v/semantic-release-heroku.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/semantic-release-heroku.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/semantic-release-heroku/badge.svg?branch=master
[url-coverage]: https://coveralls.io/github/pustovitDmytro/semantic-release-heroku?branch=master

[snyk-badge]: https://snyk-widget.herokuapp.com/badge/npm/semantic-release-heroku/badge.svg
[snyk-url]: https://snyk.io/advisor/npm-package/semantic-release-heroku

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

[appveyor-badge]: https://ci.appveyor.com/api/projects/status/9qu5eo8au95gs5om/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/pustovitDmytro/semantic-release-heroku/branch/master

[fossa-badge]: https://app.fossa.com/api/projects/custom%2B24828%2Fsemantic-release-heroku.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/custom%2B24828%2Fsemantic-release-heroku?ref=badge_shield