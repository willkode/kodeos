import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { userEmail } = await req.json();

    if (!userEmail) {
      return Response.json({ error: 'User email is required' }, { status: 400 });
    }

    await base44.asServiceRole.entities.Purchase.create({
      userEmail,
      stripePaymentIntentId: 'admin-grant-' + Date.now(),
      amount: 0,
      status: 'completed'
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});