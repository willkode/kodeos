import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_ENTITIES = ['Prompt', 'AgentKit', 'AIAgentKit', 'MCPServer', 'AppStarterKit'];
const API_KEY = Deno.env.get('EXPORT_API_KEY');

Deno.serve(async (req) => {
  try {
    // Authenticate via API key header
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!API_KEY || token !== API_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
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