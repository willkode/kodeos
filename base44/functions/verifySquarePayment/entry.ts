import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find pending purchases for this user
    const pendingPurchases = await base44.asServiceRole.entities.Purchase.filter({
      userEmail: user.email,
      status: 'pending',
    });

    if (pendingPurchases.length === 0) {
      return Response.json({ verified: false });
    }

    // Check each pending purchase with Square
    for (const purchase of pendingPurchases) {
      if (!purchase.squareOrderId) continue;

      const response = await fetch(`${SQUARE_BASE_URL}/orders/${purchase.squareOrderId}`, {
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const order = data.order;

        if (order?.state === 'COMPLETED') {
          await base44.asServiceRole.entities.Purchase.update(purchase.id, {
            status: 'completed',
          });
          return Response.json({ verified: true });
        }
      }
    }

    return Response.json({ verified: false });
  } catch (error) {
    console.error('Verify error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});