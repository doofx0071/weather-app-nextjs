import axios from 'axios';

const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

// Weather API
export const fetchWeather = async (cityName) => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}${encodeURIComponent(cityName)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

// History APIs
export const getHistory = async () => {
  try {
    const response = await axios.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const addHistory = async (city, description) => {
  try {
    const response = await axios.post('/api/history', {
      city,
      description: description || 'Weather data'
    });
    return response.data;
  } catch (error) {
    console.error('Error adding history:', error);
  }
};

export const deleteHistory = async (id) => {
  try {
    await axios.delete(`/api/history/${id}`);
  } catch (error) {
    console.error('Error deleting history:', error);
  }
};

// Notes APIs
export const getAllNotes = async () => {
  try {
    const response = await axios.get('/api/notes');
    return response.data.notes || [];
  } catch (error) {
    console.error('Error fetching all notes:', error);
    return [];
  }
};

export const getCityNotes = async (city) => {
  try {
    const response = await axios.get(`/api/notes/city/${encodeURIComponent(city)}`);
    return response.data.notes || [];
  } catch (error) {
    console.error('Error fetching city notes:', error);
    return [];
  }
};

export const addNote = async (city, note) => {
  try {
    const response = await axios.post('/api/notes', {
      city,
      note
    });
    return response.data;
  } catch (error) {
    console.error('Error adding note:', error);
  }
};

export const updateNote = async (id, note) => {
  try {
    const response = await axios.put(`/api/notes/${id}`, {
      note
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

export const deleteNote = async (id) => {
  try {
    await axios.delete(`/api/notes/${id}`);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

// Note: getNoteImages endpoint not implemented - images stored directly in Supabase
// export const getNoteImages = async (noteId) => {
//   try {
//     const response = await axios.get(`/api/notes/${noteId}/images`);
//     return response.data.images || [];
//   } catch (error) {
//     console.error('Error fetching note images:', error);
//     return [];
//   }
// };

// Photos APIs
export const getCityPhotos = async (city) => {
  try {
    const response = await axios.get(`/api/cities/${encodeURIComponent(city)}/photos`);
    return response.data.photos || [];
  } catch (error) {
    console.error('Error fetching city photos:', error);
    return [];
  }
};

export const uploadPhoto = async (city, file) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await axios.post(
      `/api/cities/${encodeURIComponent(city)}/photos`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
};

export const deletePhoto = async (photoId) => {
  try {
    await axios.delete(`/api/photos/${photoId}`);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};
