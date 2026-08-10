import { config } from '../config';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

/**
 * Find a Shopify customer by email using GraphQL Admin API.
 * Returns the customer GID (e.g., "gid://shopify/Customer/12345") or null.
 */
export async function findCustomerByEmail(email: string): Promise<string | null> {
  const { storeUrl, accessToken } = config.shopify;

  if (!storeUrl || !accessToken) {
    console.warn('Shopify credentials not configured. Skipping customer lookup.');
    return null;
  }

  const query = `
    query findCustomer($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${storeUrl}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables: { query: `email:${email}` },
      }),
    });

    const data: any = await response.json();
    const edges = data?.data?.customers?.edges;

    if (edges && edges.length > 0) {
      return edges[0].node.id;
    }

    return null;
  } catch (error) {
    console.error('Error finding Shopify customer:', error);
    return null;
  }
}

/**
 * Create a single-use discount code on Shopify via GraphQL Admin API.
 * The discount is restricted to a specific customer.
 */
export async function createDiscountCode(
  customerGid: string | null,
  discountValue: number,
  discountType: 'fixed_amount' | 'percentage',
  title: string
): Promise<string> {
  const code = `ATOPIC-${generateCode()}`;
  const { storeUrl, accessToken } = config.shopify;

  if (!storeUrl || !accessToken) {
    console.warn('Shopify credentials not configured. Returning mock discount code.');
    return code; // Return the code anyway for demo/testing
  }

  const startsAt = new Date().toISOString();

  // Build the value object based on discount type
  const value =
    discountType === 'percentage'
      ? { percentage: discountValue / 100 }
      : { discountAmount: { amount: discountValue.toString(), appliesOnEachItem: false } };

  // Build customer selection
  const customerSelection = customerGid
    ? { customers: { add: [customerGid] } }
    : { all: true };

  const mutation = `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 1) {
                nodes {
                  code
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    basicCodeDiscount: {
      title: `A-Topic Rewards: ${title}`,
      code,
      startsAt,
      customerSelection,
      customerGets: {
        value,
        items: { all: true },
      },
      usageLimit: 1,
      appliesOncePerCustomer: true,
    },
  };

  try {
    const response = await fetch(`https://${storeUrl}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const data: any = await response.json();
    const userErrors = data?.data?.discountCodeBasicCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      console.error('Shopify discount creation errors:', userErrors);
      throw new Error(`Shopify error: ${userErrors.map((e: any) => e.message).join(', ')}`);
    }

    // Return the actual code from Shopify response
    const createdCode =
      data?.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount?.codes?.nodes?.[0]?.code;

    return createdCode || code;
  } catch (error) {
    console.error('Error creating Shopify discount:', error);
    // Still return the code for logging purposes, but the discount won't exist on Shopify
    return code;
  }
}

/**
 * Find a Shopify order by its name (e.g., "#1024" or "1024").
 */
export async function getOrderByName(orderName: string): Promise<any> {
  const { storeUrl, accessToken } = config.shopify;

  if (!storeUrl || !accessToken) {
    console.warn('Shopify credentials not configured. Returning mock order.');
    return {
      id: Math.floor(Math.random() * 1000000000).toString(),
      name: orderName.startsWith('#') ? orderName : `#${orderName}`,
      email: 'test@atopic.com', // Mock email must match test user
      total_price: '50.00',
      financial_status: 'paid',
    };
  }

  try {
    const response = await fetch(`https://${storeUrl}/admin/api/2024-01/orders.json?name=${encodeURIComponent(orderName)}&status=any`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });

    const data: any = await response.json();
    if (data?.orders && data.orders.length > 0) {
      return data.orders[0];
    }
    return null;
  } catch (error) {
    console.error('Error finding Shopify order:', error);
    return null;
  }
}
