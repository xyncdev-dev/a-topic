import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('clerk_id').unique().nullable();
    table.index('clerk_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropIndex(['clerk_id']);
    table.dropColumn('clerk_id');
  });
}
