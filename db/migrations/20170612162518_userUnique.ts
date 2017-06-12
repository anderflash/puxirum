import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.table('user', function(table) {
      table.unique(["username"]);
      table.unique(["email"]);
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.table('user', function(table) {
      table.dropUnique(["username"]);
      table.dropUnique(["email"]);
    })
  ])
};
