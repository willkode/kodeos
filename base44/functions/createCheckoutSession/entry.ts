import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID');
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/+$/, '') || 'https://app.base44.com';
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(`${SQUARE_BASE_URL}/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        quick_pay: {
          name: 'KodeOS Pro — Lifetime Access',
          price_money: {
            amount: 1000, // $10.00 in cents
            currency: 'USD',
          },
          location_id: SQUARE_LOCATION_ID,
        },
        checkout_options: {
          redirect_url: `${origin}/dashboard?payment=success`,
          allow_tipping: false,
        },
        pre_populated_data: {
          buyer_email: user.email,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square API error:', JSON.stringify(data));
      return Response.json({ error: data.errors?.[0]?.detail || 'Square checkout failed' }, { status: 500 });
    }

    // Store pending purchase with the order ID
    const orderId = data.payment_link?.order_id || data.related_resources?.orders?.[0] || idempotencyKey;
    await base44.asServiceRole.entities.Purchase.create({
      squareOrderId: orderId,
      squarePaymentLinkId: data.payment_link?.id || '',
      amount: 1000,
      status: 'pending',
      userEmail: user.email,
    });

    return Response.json({ url: data.payment_link?.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});