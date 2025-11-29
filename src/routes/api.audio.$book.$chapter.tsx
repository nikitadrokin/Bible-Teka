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
      const headers: HeadersInit = {};
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        headers['Range'] = rangeHeader;
      }

      const res = await fetch(audioUrl, { headers });

      if (!res.ok && res.status !== 206) {
        return new Response(JSON.stringify({ error: 'Audio not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(res.body, {
        status: res.status,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': res.headers.get('Content-Length') ?? '',
          'Content-Range': res.headers.get('Content-Range') ?? '',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (error) {
      console.error('Error fetching audio:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch audio' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  HEAD: async ({ params }) => {
    const { book, chapter: chapterParam } = params;
    const chapter = chapterParam.replace(/\.mp3$/, '');

    try {
      const res = await fetch(`${AUDIO_BASE_URL}/${book}/${chapter}.mp3`, {
        method: 'HEAD',
      });

      if (!res.ok) {
        return new Response(null, { status: 404 });
      }

      return new Response(null, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': res.headers.get('Content-Length') ?? '0',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (error) {
      console.error('Error checking audio:', error);
      return new Response(null, { status: 500 });
    }
  },
});
