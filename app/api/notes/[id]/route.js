import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// PUT - Update a note
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { note } = await request.json();

    if (!note) {
      return Response.json(
        { error: 'Note content required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('notes')
      .update({ note })
      .eq('id', id)
      .select();

    if (error) throw error;

    return Response.json({ message: 'Note updated', data });
  } catch (error) {
    console.error('Error updating note:', error);
    return Response.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}


// DELETE - Delete a note
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return Response.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}