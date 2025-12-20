import { createServerFileRoute } from '@tanstack/react-start/server';

const AUDIO_BASE_URL = 'https://4bbl.ru/data/syn-kozlov';

export const ServerRoute = createServerFileRoute(
  '/api/audio/$book/$chapter',
).methods({
  GET: async ({ request, params }) => {
    const { book, chapter: chapterParam } = params;
    const chapter = chapterParam.replace(/\.mp3$/, '');
    const audioUrl = `${AUDIO_BASE_URL}/${book}/${chapter}.mp3`;

    try {
      // 1. Forward the Range header and force identity encoding
      const headers = new Headers();
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        headers.set('Range', rangeHeader);
      }
      // Critical: Tell upstream NOT to compress the response (e.g. gzip/br).
      // If node-fetch decompresses transparently, the Content-Length/Content-Range headers 
      // from upstream might not match the byte stream we pipe to the user.
      headers.set('Accept-Encoding', 'identity');

      // 2. Fetch from source
      const res = await fetch(audioUrl, { headers });

      // 3. Prepare response headers
      // Forward ALL headers from the upstream response to ensure a 1:1 proxy match
      const responseHeaders = new Headers();
      
      // List of hop-by-hop headers to ignore (RFC 2616, section 13.5.1)
      const hopByHopHeaders = new Set([
        'connection',
        'keep-alive',
        'proxy-authenticate',
        'proxy-authorization',
        'te',
        'trailer',
        'transfer-encoding',
        'upgrade',
        'content-encoding'
      ]);

      res.headers.forEach((value, key) => {
        if (!hopByHopHeaders.has(key.toLowerCase())) {
          responseHeaders.set(key, value);
        }
      });

      // Vital: Prevent Cloudflare/Vercel/Next from messing with the body
      responseHeaders.set('Cache-Control', 'no-transform, public, max-age=2592000');
      // Critical: Ensure downstream caches (Cloudflare) respect the Range header.
      responseHeaders.set('Vary', 'Range');

      // 4. Return the stream directly with the exact status code from upstream
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      console.error('Error fetching audio:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch audio' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});