# Puxirum

Service Integration. If you want to create a workflow (REST, SOAP, etc...)

## How to use

First, we need to install dependencies

~~~.bash
$ git clone https://github.com/anderflash/puxirum.git
$ cd puxirum
$ npm i
~~~

After, we need to run postgresql, and apply the following migrations
~~~.bash
$ npm run knex -- migrate:latest --env development
$ npm run knex -- seed:run --env development
~~~

After, we need to build the builder :)
~~~.bash
$ tsc build.ts --lib es6
~~~

Finally, we need to build the server
~~~.bash
$ node build.js -w
~~~

Anytime you would run the server
~~~
$ npm run watchServer
~~~

OBS: this procedure is in development. We will simplify it.

## Contact

Anderson Tavares  [andtavar at br\.ibm\.com]