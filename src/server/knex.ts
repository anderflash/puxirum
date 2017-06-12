import knexfile = require('../../knexfile');
import * as knex from 'knex';

var environment = process.env.NODE_ENV || 'development';
var config = knexfile[environment];

export = knex(config);