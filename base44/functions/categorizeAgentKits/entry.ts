import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all uncategorized kits
    const allKits = await base44.asServiceRole.entities.AIAgentKit.filter({}, '-created_date', 2000);
    const uncategorized = allKits.filter(k => !k.category || k.category === 'Uncategorized');

    if (uncategorized.length === 0) {
      return Response.json({ message: 'All kits already categorized', updated: 0 });
    }

    // Process in batches of 20 for LLM
    const batchSize = 20;
    let updated = 0;

    for (let i = 0; i < uncategorized.length; i += batchSize) {
      const batch = uncategorized.slice(i, i + batchSize);
      
      const items = batch.map((k, idx) => `${idx + 1}. "${k.name}" - ${k.description?.substring(0, 150) || 'No description'}`).join('\n');

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

      // Update each kit with its category
      for (const item of result.items) {
        const kit = batch[item.index - 1];
        if (kit && item.category) {
          await base44.asServiceRole.entities.AIAgentKit.update(kit.id, { category: item.category });
          updated++;
        }
      }
    }

    return Response.json({ message: 'Categorization complete', updated, total: uncategorized.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});