import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("password", 255).notNullable();
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  exports.down = function (knex) {
    return knex.schema.dropTable("users");
  };
}
