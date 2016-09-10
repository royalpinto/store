Store
===

Simple shopping experience.
------

A project developed using `node` to provide simple shopping experience.

#### Features:
 * REST APIs with complete documentation according to `API Blueprint` spec.
 * Quick setup using `docker` and `npm`.
 * Test cases using `mocha` and `chai` with 100 % code coverage.
 * Minimal production dependencies with hardly 50-60 internal dependencies: `npm list --production | wc -l`

#### Installation

A quick installation using `docker` with self database container:

``` bash
# --build can be used if source code has changes from the previous build.
docker-compose up
```

A customized installation:
```bash
# NOTE: Optionally pass --production to skip dev dependencies.
npm install

# Edit env specific config file to set the port, database and other settings.
# Ex: config/production.json

export NODE_ENV=<env>
# Ex: export NODE_ENV=production

npm start
```

#### Test
```bash
# This uses test env config.
npm test
```

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
// install `aglio` https://github.com/danielgtaylor/aglio
npm install aglio

// Convert to html and open the output html on browser.
aglio -i doc/api/index.apib -o output.html
```
