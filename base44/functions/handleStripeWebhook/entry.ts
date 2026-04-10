import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Handle Stripe webhook for payment confirmation
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // TODO: Verify Stripe webhook signature
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // For now, parse the event manually
    const event = JSON.parse(body);

    if (event.type === 'payment_intent.succeeded') {
      const base44 = createClientFromRequest(req);
      const paymentIntent = event.data.object;

      // Create purchase record
      await base44.asServiceRole.entities.Purchase.create({
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: 'completed',
        userEmail: paymentIntent.receipt_email || paymentIntent.billing_details?.email
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});