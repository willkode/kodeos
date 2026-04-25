import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { postId } = await req.json();

    // Get the post
    const post = await base44.asServiceRole.entities.MarketingPost.get(postId);
    if (!post || post.platform !== 'linkedin') {
      return Response.json({ error: 'Invalid LinkedIn post' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Get user profile to get person URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    const fullContent = `${post.content}\n\n${post.hashtags || ''}`.trim();

    // Create text post via LinkedIn Posts API
    const postBody = {
      author: personUrn,
      commentary: fullContent,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    const postRes = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202504',
      },
      body: JSON.stringify(postBody),
    });

    if (postRes.status === 201) {
      const postUrn = postRes.headers.get('x-restli-id') || 'posted';
      await base44.asServiceRole.entities.MarketingPost.update(postId, {
        status: 'posted',
        postResult: `Success: ${postUrn}`,
      });
      return Response.json({ success: true, postUrn });
    } else {
      const errText = await postRes.text();
      await base44.asServiceRole.entities.MarketingPost.update(postId, {
        status: 'failed',
        postResult: `Error ${postRes.status}: ${errText}`,
      });
      return Response.json({ error: errText }, { status: postRes.status });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});