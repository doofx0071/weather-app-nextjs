import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Fetch all notes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('city')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({ notes: data });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return Response.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Add new note
export async function POST(request) {
  try {
    const { city, note } = await request.json();

    if (!city || !note) {
      return Response.json(
        { error: 'City and note required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([{ city, note }])
      .select();

    if (error) throw error;

    return Response.json(
      { message: 'Note added', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding note:', error);
    return Response.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
