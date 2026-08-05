// Cloudflare Worker: Likes API
// KV Namespace binding: LIKES_KV

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    
    // Match /likes/:slug
    const match = path.match(/^\/likes\/([a-z0-9-]+)$/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    
    const slug = match[1];
    
    if (request.method === 'GET') {
      const count = parseInt(await env.LIKES_KV.get(`likes:${slug}`) || '0');
      return new Response(JSON.stringify({ slug, count }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    
    if (request.method === 'POST') {
      // Rate limiting: 1 like per IP per slug per 24h
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateKey = `rate:${slug}:${ip}`;
      const existing = await env.LIKES_KV.get(rateKey);
      
      if (existing) {
        const currentCount = parseInt(await env.LIKES_KV.get(`likes:${slug}`) || '0');
        return new Response(JSON.stringify({ slug, count: currentCount, limited: true }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      
      // Increment count
      const current = parseInt(await env.LIKES_KV.get(`likes:${slug}`) || '0');
      const newCount = current + 1;
      await env.LIKES_KV.put(`likes:${slug}`, newCount.toString());
      
      // Set rate limit (24h TTL)
      await env.LIKES_KV.put(rateKey, '1', { expirationTtl: 86400 });
      
      return new Response(JSON.stringify({ slug, count: newCount }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    
    // --- VIEWS ENDPOINT ---
    const viewMatch = path.match(/^\/views\/([a-z0-9-]+)$/);
    if (viewMatch) {
      const viewSlug = viewMatch[1];
      
      if (request.method === 'GET') {
        const count = parseInt(await env.LIKES_KV.get(`views:${viewSlug}`) || '0');
        return new Response(JSON.stringify({ slug: viewSlug, count }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      
      if (request.method === 'POST') {
        // Increment count unconditionally for views (or could add basic rate limit, but it's fine for now)
        const current = parseInt(await env.LIKES_KV.get(`views:${viewSlug}`) || '0');
        const newCount = current + 1;
        await env.LIKES_KV.put(`views:${viewSlug}`, newCount.toString());
        return new Response(JSON.stringify({ slug: viewSlug, count: newCount }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
