# Likes API — Cloudflare Worker

The likes counter uses a Cloudflare Worker backed by Workers KV.

## Status: ✅ Deployed

- **Worker URL:** `https://blog-likes.aarsh-blog-likes.workers.dev`
- **KV Namespace ID:** `0560a131bd22403b9b8053b57db6606a`
- **Routes:** `GET /likes/:slug` · `POST /likes/:slug`

---

## Re-deploying or Updating the Worker

If you ever need to redeploy (e.g. after editing `workers/likes-worker.js`):

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Authenticate (only needed once)
wrangler login

# Deploy from the workers directory
cd workers
wrangler deploy
```

---

## Creating a New KV Namespace (if starting fresh)

```bash
wrangler kv namespace create LIKES_KV
```

Copy the output `id` into `workers/wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "LIKES_KV"
id = "your-namespace-id-here"
```

Then update `LIKES_API_URL` in `src/components/LikeButton.astro` with your new worker URL.
