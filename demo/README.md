#### Demo
 * An admin user with username: `admin` and password: `admin`.
 * A regular user with username: `demouser` and password: `demouser`.
 * Around 60-70 sample products with various brands and categories.

Demo data can be refreshed/inserted by the following command.

!!This will remove old data and then inserts new.
``` bash
# NOTE: development env will be used if env is not set explicitly.
node demo/init.js

# Start the server.
npm start
```
