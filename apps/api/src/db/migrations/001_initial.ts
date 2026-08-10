import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').nullable(); // null if created by webhook
    table.string('name').nullable();
    table.integer('current_balance').defaultTo(0);
    table.integer('total_earned').defaultTo(0);
    table.string('tier').defaultTo('bronze');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Transactions ledger
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enu('type', ['earn', 'redeem']).notNullable();
    table.integer('amount').notNullable();
    table.string('description').nullable();
    table.string('order_id').nullable();
    table.integer('reward_id').nullable();
    table.string('discount_code').nullable();
    table.string('webhook_id').unique().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('type');
  });

  // Rewards catalog
  await knex.schema.createTable('rewards', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.integer('coins_cost').notNullable();
    table.decimal('discount_value', 10, 2).notNullable();
    table.string('discount_type').defaultTo('fixed_amount');
    table.string('image_url').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Settings key-value store
  await knex.schema.createTable('settings', (table) => {
    table.string('key').primary();
    table.string('value').notNullable();
  });

  // Insert default settings
  await knex('settings').insert([
    { key: 'coins_multiplier', value: '10' },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('rewards');
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('users');
}
