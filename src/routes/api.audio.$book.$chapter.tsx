import { createServerFileRoute } from '@tanstack/react-start/server';

const AUDIO_BASE_URL = 'https://4bbl.ru/data/syn-kozlov';

export const ServerRoute = createServerFileRoute(
  '/api/audio/$book/$chapter',
).methods({
  GET: async ({ request, params }) => {
    const { book, chapter: chapterParam } = params;
    const chapter = chapterParam.replace(/\.mp3$/, '');

    try {
      const res = await fetch(`${AUDIO_BASE_URL}/${book}/${chapter}.mp3`);

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Audio not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get the audio data as an array buffer
      const audioData = await res.arrayBuffer();

      // Return the audio data with appropriate headers
      return new Response(audioData, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioData.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
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
  HEAD: async ({ request, params }) => {
    const { book, chapter: chapterParam } = params;
    const chapter = chapterParam.replace(/\.mp3$/, '');

    try {
      const res = await fetch(`${AUDIO_BASE_URL}/${book}/${chapter}.mp3`, {
        method: 'HEAD',
      });

      if (!res.ok) {
        return new Response(null, {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Return just the headers for HEAD requests
      return new Response(null, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': res.headers.get('Content-Length') || '0',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      });
    } catch (error) {
      console.error('Error checking audio:', error);
      return new Response(null, {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});
