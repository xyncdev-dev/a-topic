import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing rewards
  await knex('rewards').del();

  // Insert initial rewards catalog
  await knex('rewards').insert([
    {
      title: 'Cupón 5€',
      description: 'Descuento de 5€ en tu próxima compra. Sin mínimo de pedido.',
      coins_cost: 500,
      discount_value: 5.00,
      discount_type: 'fixed_amount',
      image_url: null,
      is_active: true,
    },
    {
      title: 'Cupón 10€',
      description: 'Descuento de 10€ en tu próxima compra. Pedido mínimo de 30€.',
      coins_cost: 1000,
      discount_value: 10.00,
      discount_type: 'fixed_amount',
      image_url: null,
      is_active: true,
    },
    {
      title: 'Cupón 20€',
      description: 'Descuento de 20€ en tu próxima compra. Pedido mínimo de 50€.',
      coins_cost: 2000,
      discount_value: 20.00,
      discount_type: 'fixed_amount',
      image_url: null,
      is_active: true,
    },
    {
      title: 'Cupón 50€',
      description: 'Descuento de 50€ para los más fieles. Pedido mínimo de 100€.',
      coins_cost: 5000,
      discount_value: 50.00,
      discount_type: 'fixed_amount',
      image_url: null,
      is_active: true,
    },
    {
      title: 'Envío Gratis',
      description: 'Envío gratuito en tu próximo pedido. Sin mínimo.',
      coins_cost: 800,
      discount_value: 100.00,
      discount_type: 'percentage',
      image_url: null,
      is_active: true,
    },
  ]);
}
