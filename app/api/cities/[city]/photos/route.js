import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Fetch photos for a specific city
export async function GET(request, { params }) {
  try {
    const { city } = await params;

    const { data, error } = await supabase
      .from('city_photos')
      .select('*')
      .ilike('city', city)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return Response.json({ photos: data });
  } catch (error) {
    console.error('Error fetching city photos:', error);
    return Response.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST - Upload photo for city
export async function POST(request, { params }) {
  try {
    const { city } = await params;
    const formData = await request.formData();
    const file = formData.get('photo');

    if (!file) {
      return Response.json(
        { error: 'No photo file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('city-images')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // Use API route to serve image (proxy through backend)
    const imageUrl = `/api/images/${fileName}`;

    // Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('city_photos')
      .insert([{ city, image_url: imageUrl }])
      .select();

    if (dbError) throw dbError;

    return Response.json(
      { message: 'Photo uploaded', imageUrl, data: dbData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading photo:', error);
    return Response.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
