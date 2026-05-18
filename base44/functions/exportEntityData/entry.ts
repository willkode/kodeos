import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_ENTITIES = ['Prompt', 'AgentKit', 'AIAgentKit', 'MCPServer', 'AppStarterKit'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { entity, skip = 0, limit = 100 } = await req.json();

    if (!entity || !ALLOWED_ENTITIES.includes(entity)) {
      return Response.json({ error: `Invalid entity. Allowed: ${ALLOWED_ENTITIES.join(', ')}` }, { status: 400 });
    }

    const allRecords = await base44.asServiceRole.entities[entity].list('-created_date', skip + limit + 1);
    const total = allRecords.length;
    const records = allRecords.slice(skip, skip + limit);
    const has_more = skip + limit < total;

    return Response.json({ records, has_more, total });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});