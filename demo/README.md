#### Demo
 * An admin user with username: `admin` and password: `admin`.
 * A regular user with username: `demouser` and password: `demouser`.
 * Around 100 sample products with various brands and categories.

Demo data can be refreshed/inserted by the following command.

#### Quick demo setup
```bash
docker-compose -f demo/docker-compose.yml up --build
```

#### Demo setup on local.
!!This will remove old data and then inserts new.
``` bash
# NOTE: development env will be used if env is not set explicitly.
node demo/init.js

# Start the server.
npm start
```

Examples requests after the setup.
```bash
curl 'http://localhost:3000/products/'

curl -i -X POST 'http://localhost:3000/register/' --data 'name=Lohith%20Royal%20Pinto&username=royalpinto&email=royalpinto@gmail.com&password=password'
```
