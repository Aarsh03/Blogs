# Deploy Guide for Likes API

This project uses a Cloudflare Worker backed by Workers KV for a simple, fast, and scalable "Likes" counter on blog posts.

## Prerequisites

1. Create a free [Cloudflare](https://dash.cloudflare.com/sign-up) account
2. Make sure you have Node.js and npm installed locally

## Step-by-Step Deployment

1. **Install Wrangler**
   Install the official Cloudflare Workers CLI globally:
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate Wrangler**
   Log into your Cloudflare account via the CLI:
   ```bash
   wrangler login
   ```
   Follow the instructions in your browser to grant access.

3. **Create the KV Namespace**
   Create a new KV namespace to store the likes data:
   ```bash
   wrangler kv namespace create LIKES_KV
   ```
   *Note: This command will output a snippet with an `id` value.*

4. **Update Configuration**
   Open `workers/wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID` with the actual ID returned from step 3.

5. **Deploy the Worker**
   Navigate to the workers directory and deploy your worker:
   ```bash
   cd workers
   wrangler deploy
   ```

6. **Configure the Blog**
   After successful deployment, wrangler will output your worker URL (e.g., `https://blog-likes.your-subdomain.workers.dev`).
   
   Open `src/components/LikeButton.astro` (or wherever your `LIKES_API_URL` is defined) and update the API URL to point to your new worker:
   ```javascript
   const LIKES_API_URL = "https://blog-likes.your-subdomain.workers.dev";
   ```

You are now ready to collect likes!
