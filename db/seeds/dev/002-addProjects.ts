import * as Knex from "knex";

import * as Promise from 'bluebird';
global.Promise = require('bluebird');

exports.seed = function (knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('project').del()
    .then(function () {
      // Inserts seed entries
      return knex('project').insert([
        {id: 1, owner: 1, name: 'Um projeto legal'},
        {id: 2, owner: 1, name: 'Outro projeto bacana'},
        {id: 3, owner: 2, name: 'Um projeto super legal, sabia?'}
      ]);
    });
};
