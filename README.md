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


#### Documentation
Run the following command and visit doc/ directory for documentation.
```bash
npm run doc
```
