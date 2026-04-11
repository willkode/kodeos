import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { entityType, batchIds } = await req.json();

    if (!entityType || !batchIds?.length) {
      return Response.json({ error: 'entityType and batchIds required' }, { status: 400 });
    }

    const entityMap = {
      AIAgentKit: 'AIAgentKit',
      AgentKit: 'AgentKit',
      MCPServer: 'MCPServer'
    };

    const entity = entityMap[entityType];
    if (!entity) {
      return Response.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    const items = [];
    for (const id of batchIds) {
      const item = await base44.asServiceRole.entities[entity].get(id);
      if (item && !item.detailed_info) {
        items.push(item);
      }
    }

    if (items.length === 0) {
      return Response.json({ success: true, processed: 0 });
    }

    const typeLabel = entityType === 'AIAgentKit' ? 'AI Model API' : entityType === 'AgentKit' ? 'Agent Kit' : 'MCP Server';

    for (const item of items) {
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are an expert AI developer. Write a concise, informative overview for this ${typeLabel}:

Name: ${item.name}
Description: ${item.description}
URL: ${item.url}
Category: ${item.category || 'N/A'}

Write 3-5 paragraphs covering:
- What it does and key features
- Common use cases
- How developers typically integrate it
- Any notable strengths or limitations

Keep it factual and developer-focused. Use markdown formatting. Do NOT include the name as a header.`,
        add_context_from_internet: true,
      });

      await base44.asServiceRole.entities[entity].update(item.id, {
        detailed_info: result
      });
    }

    return Response.json({ success: true, processed: items.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});