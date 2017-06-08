import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    // Creating table user
    knex.schema.createTable("user", function(table) {
      table.increments().primary();
      table.string("username");
      table.string("email");
      table.string("password");
      table.timestamps();
    }),
  ])
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable("user")
  ]);
};
