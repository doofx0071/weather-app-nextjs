import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// DELETE - Remove a city photo
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Get photo data first to get the image URL
    const { data: photoData, error: fetchError } = await supabase
      .from('city_photos')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const fileName = photoData.image_url.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('city-images')
      .remove([fileName]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('city_photos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return Response.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return Response.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
