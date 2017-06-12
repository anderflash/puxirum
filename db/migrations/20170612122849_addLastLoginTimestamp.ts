import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.table('user', function(table) {
      table.timestamp("logged_at");
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.table('user', function(table) {
      table.dropColumn("logged_at");
    })
  ])
};
