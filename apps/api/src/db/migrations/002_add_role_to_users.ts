import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('role').defaultTo('user').notNullable();
  });

  // Promote test user to admin for testing purposes
  await knex('users')
    .where('email', 'test@atopic.com')
    .update({ role: 'admin' });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
  });
}
