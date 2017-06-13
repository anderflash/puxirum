import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('project', table => {
      table.increments().primary();
      table.integer('owner').references('id').inTable('user').onDelete("CASCADE").onUpdate("CASCADE");
      table.string('name', 64);
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('project')
  ]);
};
