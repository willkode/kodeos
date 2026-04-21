import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function parseMarkdownTable(markdown) {
  const lines = markdown.split('\n');
  const results = [];
  
  for (const line of lines) {
    // Match table rows: | [Name](url) | Description |
    const match = line.match(/^\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*(.+?)\s*\|$/);
    if (match) {
      const name = match[1].trim();
      const url = match[2].trim();
      let description = match[3].trim();
      // Clean up HTML entities
      description = description.replace(/&#124;/g, '|');
      results.push({ name, url, description });
    }
  }
  
  return results;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { fileUrl, entityName } = await req.json();
    
    if (!fileUrl || !entityName) {
      return Response.json({ error: 'fileUrl and entityName are required' }, { status: 400 });
    }

    // Fetch the markdown file
    const response = await fetch(fileUrl);
    const markdown = await response.text();
    
    // Parse the table
    const items = parseMarkdownTable(markdown);
    console.log(`Parsed ${items.length} items from markdown`);
    
    if (items.length === 0) {
      return Response.json({ error: 'No items found in markdown' }, { status: 400 });
    }

    // Insert in batches of 50
    const batchSize = 50;
    let created = 0;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const records = batch.map(item => ({
        name: item.name,
        description: item.description,
        url: item.url,
      }));
      
      await base44.asServiceRole.entities[entityName].bulkCreate(records);
      created += records.length;
      console.log(`Created ${created}/${items.length}`);
    }

    return Response.json({ success: true, totalParsed: items.length, totalCreated: created });
  } catch (error) {
    console.error('Import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});