import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    
    // Find all scheduled posts whose scheduledTime has passed
    const scheduledPosts = await base44.asServiceRole.entities.MarketingPost.filter(
      { status: 'scheduled' },
      'scheduledTime',
      50
    );

    const duePosts = scheduledPosts.filter(p => {
      if (!p.scheduledTime) return false;
      return new Date(p.scheduledTime) <= now;
    });

    const results = [];

    for (const post of duePosts) {
      if (post.platform === 'linkedin') {
        // Post to LinkedIn via the dedicated function
        try {
          const res = await base44.asServiceRole.functions.invoke('postToLinkedIn', { postId: post.id });
          results.push({ id: post.id, platform: 'linkedin', status: 'posted' });
        } catch (err) {
          results.push({ id: post.id, platform: 'linkedin', status: 'failed', error: err.message });
        }
      } else {
        // For Reddit and Twitter: mark as posted (manual copy-paste platforms)
        // In production, you'd integrate their APIs here
        await base44.asServiceRole.entities.MarketingPost.update(post.id, {
          status: 'posted',
          postResult: `Auto-marked as ready. Copy content and post manually to ${post.platform}.`,
        });
        results.push({ id: post.id, platform: post.platform, status: 'posted (manual)' });
      }
    }

    return Response.json({ processed: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});