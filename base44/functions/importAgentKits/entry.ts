import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { servers } = await req.json();

    const batchSize = 40;
    const allCategorized = [];

    for (let i = 0; i < servers.length; i += batchSize) {
      const batch = servers.slice(i, i + batchSize);
      const prompt = `Categorize each agent kit into exactly ONE category from this list:
- Web Scraping & Crawling
- Social Media
- SEO & Marketing
- Finance & Crypto
- Real Estate
- Job Market & HR
- Government Data
- Developer Tools
- AI & LLM Tools
- E-Commerce
- Communication & Messaging
- Productivity & Project Management
- Research & Academic
- News & Media
- Travel & Hospitality
- Healthcare & Pharma
- Legal & Compliance
- Data & Analytics
- Sports
- Weather & Environment
- Food & Dining
- Automotive
- Document Processing
- Content Creation
- Lead Generation & Sales
- Review & Reputation
- Gaming & Entertainment
- Education
- Other

Here are the kits to categorize:
${batch.map((s, idx) => `${idx}. "${s.name}" - ${s.description}`).join('\n')}

Return a JSON array of objects with "index" and "category" for each kit.`;

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
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

      for (const item of result.items) {
        const server = batch[item.index];
        if (server) {
          allCategorized.push({
            name: server.name,
            description: server.description,
            url: server.url,
            category: item.category
          });
        }
      }
    }

    // Bulk create in batches of 50
    let created = 0;
    for (let i = 0; i < allCategorized.length; i += 50) {
      const batch = allCategorized.slice(i, i + 50);
      await base44.asServiceRole.entities.AgentKit.bulkCreate(batch);
      created += batch.length;
    }

    return Response.json({ success: true, created, total: allCategorized.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});