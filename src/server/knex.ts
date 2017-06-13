import * as knex            from 'knex';
import knexfile = require('../../knexfile');

var environment = process.env.NODE_ENV || 'development';
var config = knexfile[environment];

export = knex(config);