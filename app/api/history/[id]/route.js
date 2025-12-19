import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// DELETE - Remove history entry
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting history:', error);
    return Response.json(
      { error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}
