import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const eventType = body.type;
    console.log('Square webhook event:', eventType);

    if (eventType === 'payment.completed' || eventType === 'order.fulfillment.updated') {
      const payment = body.data?.object?.payment || body.data?.object;
      const orderId = payment?.order_id;
      const buyerEmail = payment?.buyer_email_address;

      if (orderId) {
        // Find the pending purchase by order ID
        const purchases = await base44.asServiceRole.entities.Purchase.filter({
          squareOrderId: orderId,
          status: 'pending',
        });

        if (purchases.length > 0) {
          await base44.asServiceRole.entities.Purchase.update(purchases[0].id, {
            status: 'completed',
            squarePaymentId: payment?.id || '',
          });
          console.log('Purchase completed for order:', orderId);
        } else if (buyerEmail) {
          // Create a new purchase if we didn't find a pending one
          await base44.asServiceRole.entities.Purchase.create({
            squareOrderId: orderId,
            squarePaymentId: payment?.id || '',
            amount: payment?.amount_money?.amount || 1000,
            status: 'completed',
            userEmail: buyerEmail,
          });
          console.log('New purchase created for:', buyerEmail);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});