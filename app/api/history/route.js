import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST - Add history entry
export async function POST(request) {
  try {
    const { city, description } = await request.json();

    if (!city) {
      return Response.json(
        { error: 'City required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('history')
      .insert([
        {
          city,
          weather_description: description || '',
        },
      ])
      .select();

    if (error) throw error;

    return Response.json(
      { message: 'Added to history', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding history:', error);
    return Response.json(
      { error: 'Failed to add history' },
      { status: 500 }
    );
  }
}

// GET - Fetch all history
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('searched_at', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching history:', error);
    return Response.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
