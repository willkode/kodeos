import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { fileUrl } = await req.json();
    if (!fileUrl) {
      return Response.json({ error: 'fileUrl is required' }, { status: 400 });
    }

    // Fetch the markdown file
    const response = await fetch(fileUrl);
    const markdown = await response.text();

    // Parse markdown table rows
    // Format: | [Name](url) | Description |
    const lines = markdown.split('\n');
    const entries = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('|')) continue;
      if (trimmed.includes('API Name') || trimmed.includes('-------')) continue;

      // Extract name, url, and description from markdown table row
      // Pattern: | [Name](url) | Description |
      const match = trimmed.match(/\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*(.*?)\s*\|/);
      if (match) {
        const name = match[1].trim();
        const url = match[2].trim();
        const description = match[3].trim();
        
        if (name && url && description) {
          entries.push({ name, description, url });
        }
      }
    }

    // Bulk create in batches of 50
    let created = 0;
    const batchSize = 50;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      await base44.asServiceRole.entities.AIAgentKit.bulkCreate(batch);
      created += batch.length;
    }

    return Response.json({ 
      total_parsed: entries.length, 
      created,
      sample: entries.slice(0, 3)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});