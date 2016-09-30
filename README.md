Store
===

Simple shopping experience.
------

A project developed using `node` to provide simple shopping experience.

#### [Click here for dev (ES5) Branch](https://github.com/royalpinto/store/tree/dev)

#### Features:
 * REST APIs with complete documentation according to `API Blueprint` spec.
 * Quick setup using `docker` and `npm`.
 * Test cases using `mocha` and `chai` with 100 % code coverage.
 * Minimal production dependencies with hardly 50-60 internal dependencies: `npm list --production | wc -l`
 * Dependencies are mainly used to parse cookies and body, database driver. The core design is completely based on `node` core modules.
 * Standard design patterns like `middlewares` for easy integration with other modules.
 * Well tested on `node` stable LTS versions `4.*.*`
 * UI
  - Material design.
  - Pre processing of CSS and JS minification using `gulp`.
  - Minimal CSS for easier theme migrations.
  - Cross browser support (works on all recent versions of `Chrome`, `Firefox` and `Safari`).
  - Response design supports almost all devices.

#### Configuration
 * The configuration files have to be placed in the config directory and should have filename pattern: `<env>.json`.
 * Based on the env is set (Ex: export NODE_ENV=test), an appropriate configuration file will be loaded when app or test starts.
 * The config file should be a valid JSON file with following fields.

```js
{
    "db": {
        // This is a mandatory field, will be used to connect to mongo db server.
        "uri": '<mongodb database uri>' // Ex: "mongodb://localhost/store"
    },


    "server": {
        // The mandatory field port number to let server know
        // on which port server should listen.
        "port": '<port number on which app should listen>' // Ex: 3000

        // This is an optional parameter to let server
        // know on what hostname server should start.
        "interface": '<optional hostname>' // Ex: "127.0.0.1"
    }
}
```


#### Installation

A quick installation using `docker` with self database container:

``` bash
docker-compose up --build
```

A customized installation:
```bash
# NOTE: Optionally pass --production to skip dev dependencies, however packages
# `gulp gulp-uglify pump gulp-concat gulp-less` have to be available for minification on production.
npm install

# Install client dependencies...
bower install

# Run JS and CSS pre processor.
npm run compile
# `npm run compile -- --development`, to skip minification.

# Edit env specific config file to set the port, database and other settings.
# Ex: config/production.json

export NODE_ENV=<env>
# Ex: export NODE_ENV=production

npm start
```

#### [Dump sample data for Demonstration](https://github.com/royalpinto/store/tree/dev/demo)

#### Test
```bash
# This uses test env config.
npm test
```

#### Logging
 * Winston library is used for application logging.
 * Logging is configured with two transports to log messages to `logs/info.log` and `logs/error.log`.
 * More transports can be easily plugged-in at logging module.

#### Code Coverage

```bash
# NOTE: This uses test env config.
# Command runs test cases using mocha & generates code coverage report using istanbul.
# Browse for `coverage/lcov-report/index.html` for the detailed report upon completion.
npm run coverage
```


#### Documentation

##### REST API Documentation
REST APIs are documented according to [API Blueprint](https://apiblueprint.org/) specification. Use your favorite API Blueprint renderer tool to render from the API documentation available here: [doc/api/index.apib](https://github.com/royalpinto/store/blob/dev/doc/api/index.apib).

One example of generating doc from the API spec is given below:
```bash
# Install `aglio` https://github.com/danielgtaylor/aglio
npm install aglio

# Convert doc spec to html and open it on the browser.
aglio -i doc/api/index.apib -o output.html
```

##### Code Documentation
Source Code documented using JSDoc specification. Use your favorite JSDoc renderer tool to render source code documentation to the desired output.

A MarkDown format of source code is available here.
[doc/SourceCode.md](https://github.com/royalpinto/store/blob/dev/doc/SourceCode.md).

One example of generating doc is given below:
```bash
# Install `jsdoc-to-markdown`
jsdoc2md models/*.js controllers/*.js app/*.js errors.js > doc/SourceCode.md
# Open doc/SourceCode.md using your favorite mark down viewer.
```
