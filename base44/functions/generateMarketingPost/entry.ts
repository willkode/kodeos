import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { topic, platform, link } = await req.json();

    const appUrl = link || 'https://kodeos.app';

    const platformGuidance = {
      linkedin: 'Professional tone, 1-3 paragraphs, include a call to action. Max 3000 chars. Use line breaks for readability.',
      reddit: 'Casual, community-friendly tone. Avoid being overly promotional. Frame as sharing something useful. Keep it concise.',
      twitter: 'Must be under 280 characters including hashtags and link. Punchy, engaging, use emojis sparingly.',
    };

    // Generate post content
    const contentResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a social media marketing expert. Generate a ${platform} post about the following topic for promoting KodeOS — a curated AI toolkit for vibecoders (developers who build apps with AI).

Topic: ${topic}

Platform guidelines: ${platformGuidance[platform]}

App URL to promote: ${appUrl}

Requirements:
- Write the post body text (do NOT include hashtags in the body)
- Be authentic and valuable, not spammy
- Include the app URL naturally in the post
- For LinkedIn: use professional formatting with line breaks
- For Twitter: keep under 250 chars to leave room for hashtags

Return JSON with:
- content: the post body text
- hashtags: a string of 3-6 relevant hashtags (e.g. "#AI #Coding #DevTools")`,
      response_json_schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          hashtags: { type: 'string' },
        },
      },
    });

    // Generate image
    const imageResult = await base44.integrations.Core.GenerateImage({
      prompt: `Professional social media promotional graphic for a tech product called KodeOS. Topic: ${topic}. Modern, clean design with blue (#3B82F6) and purple (#A855F7) gradient accents on a dark background. Include subtle tech/code visual elements. No text in the image. 16:9 aspect ratio, suitable for ${platform}.`,
    });

    return Response.json({
      content: contentResult.content,
      hashtags: contentResult.hashtags,
      imageUrl: imageResult.url,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});