import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  try {
    const { path } = await params;
    const filePath = path.join('/');

    const { data, error } = await supabase.storage
      .from('city-images')
      .download(filePath);

    if (error) throw error;

    const arrayBuffer = await data.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': data.type,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response('Image not found', { status: 404 });
  }
}
