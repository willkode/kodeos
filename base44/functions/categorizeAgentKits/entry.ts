import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { batchIds } = await req.json();
    if (!batchIds || !Array.isArray(batchIds) || batchIds.length === 0) {
      return Response.json({ error: 'batchIds array is required' }, { status: 400 });
    }

    // Fetch the specific kits by ID
    const kits = [];
    for (const id of batchIds) {
      const kit = await base44.asServiceRole.entities.AIAgentKit.get(id);
      if (kit) kits.push(kit);
    }

    const items = kits.map((k, idx) => `${idx + 1}. "${k.name}" - ${k.description?.substring(0, 150) || 'No description'}`).join('\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Categorize each of the following AI APIs/tools into exactly ONE category from this list:
- Data Scraping & Web Extraction
- Social Media & Marketing
- AI & Machine Learning
- Search & SEO
- E-Commerce & Product Data
- Communication & Messaging
- Legal & Compliance
- Finance & Business
- Maps & Location
- Content & Media
- Developer Tools
- Healthcare & Science
- Education & Research
- Real Estate & Property
- Travel & Transportation
- News & Information
- Security & Privacy
- Human Resources
- Government & Public Data
- Other

Items to categorize:
${items}

Return a JSON object with an "items" array where each element has "index" (1-based) and "category" (exact match from list above).`,
      response_json_schema: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                category: { type: "string" }
              }
            }
          }
        }
      }
    });

    let updated = 0;
    for (const item of result.items) {
      const kit = kits[item.index - 1];
      if (kit && item.category) {
        await base44.asServiceRole.entities.AIAgentKit.update(kit.id, { category: item.category });
        updated++;
      }
    }

    return Response.json({ updated, total: kits.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});