import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Fetch notes for a specific city
export async function GET(request, { params }) {
  try {
    const { cityname } = await params;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .ilike('city', cityname)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({ notes: data });
  } catch (error) {
    console.error('Error fetching city notes:', error);
    return Response.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
