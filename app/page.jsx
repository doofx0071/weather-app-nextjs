'use client';

import { useState, useEffect } from 'react';
import './page.css';
import Switch from './components/Switch';
import Loader from './components/Loader';
import PhotoGallery from './components/PhotoGallery';
import GalleryButton from './components/GalleryButton';
import Pattern from './components/Pattern';
import DeveloperCard from './components/DeveloperCard';
import ProgressLoader from './components/ProgressLoader';
import ForecastLoader from './components/ForecastLoader';
import UploadLoader from './components/UploadLoader';
import {
  fetchWeather,
  getHistory,
  addHistory,
  deleteHistory,
  getAllNotes,
  getCityNotes,
  addNote,
  updateNote,
  deleteNote,
  getCityPhotos,
  uploadPhoto,
  deletePhoto
} from '../lib/api';

// Asset paths from public directory
const assetPaths = {
  lacandula: '/lacandula.png',
  lope: '/lope.png',
  location: '/location.png',
  sunny: '/sunny.png',
  cloudy: '/cloudy.png',
  rainy: '/rainy.png',
  windy: '/windy.png',
  thunder: '/thunder.png',
  snow: '/snow.png'
};

// Fonts
import '@fontsource/inter';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

export default function Home() {
  // State Management
  const [city, setCity] = useState('Davao City');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [input, setInput] = useState('');
  const [bgClass, setBgClass] = useState('default-bg');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showAddNotePopup, setShowAddNotePopup] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [cityPhotos, setCityPhotos] = useState([]);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showDeveloperPopup, setShowDeveloperPopup] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [selectedPhotoFiles, setSelectedPhotoFiles] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Weather Icons
  const getWeatherIcon = (desc = '') => {
    desc = desc.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return assetPaths.sunny;
    if (desc.includes('cloud')) return assetPaths.cloudy;
    if (desc.includes('rain')) return assetPaths.rainy;
    if (desc.includes('wind')) return assetPaths.windy;
    if (desc.includes('thunder')) return assetPaths.thunder;
    if (desc.includes('snow')) return assetPaths.snow;
    return assetPaths.cloudy;
  };

  // Load dark mode on mount
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  // Fetch Weather and Related Data
  useEffect(() => {
    if (!city) return;

    const loadWeatherAndHistory = async () => {
      setLoadingMessage('Fetching weather data....');
      const weatherData = await fetchWeather(city);
      setLoadingMessage(null);

      if (!weatherData?.temperature) {
        // Try without " City" suffix
        if (city.toLowerCase().endsWith(' city')) {
          const altName = city.slice(0, -5).trim();
          const altData = await fetchWeather(altName);
          if (altData?.temperature) {
            setWeather(altData);
            setForecast(altData.forecast || []);
            const desc = altData.description?.toLowerCase() || '';
            updateBackground(desc);
          } else {
            setError('Location does not exist');
          }
        } else {
          setError('Location does not exist');
        }
        return;
      }

      setWeather(weatherData);
      setForecast(weatherData.forecast || []);
      setError(null);
      const desc = weatherData.description?.toLowerCase() || '';
      updateBackground(desc);

      // Fetch city notes
      try {
        const cityNotes = await getCityNotes(city);
        setNotes(cityNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setNotes([]);
      }

      // Fetch city photos
      try {
        const photos = await getCityPhotos(city);
        setCityPhotos(photos);
      } catch (err) {
        console.error('Error fetching photos:', err);
      }

      // Save to history
      if (city !== 'Davao City' && weatherData) {
        await addHistory(city, weatherData.description || 'Weather data');
        const hist = await getHistory();
        setHistory(hist);
      }
    };

    loadWeatherAndHistory();
  }, [city]);

  // Fetch all notes and history on mount
  useEffect(() => {
    const load = async () => {
      const notes = await getAllNotes();
      setAllNotes(notes);
      const hist = await getHistory();
      setHistory(hist);
    };
    load();
  }, []);

  // Update background
  const updateBackground = (desc) => {
    if (desc.includes('sun') || desc.includes('clear')) setBgClass('sunny-bg');
    else if (desc.includes('rain')) setBgClass('rainy-bg');
    else if (desc.includes('cloud')) setBgClass('cloudy-bg');
    else if (desc.includes('snow')) setBgClass('snowy-bg');
    else setBgClass('default-bg');
  };

  // Date & Time
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`app ${bgClass} ${darkMode ? 'dark-mode' : ''}`} style={{ transition: 'all 0.3s ease' }}>
      {/* SIDEBAR */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <h2>Menu</h2>

          <section onClick={() => setShowPopup(true)}>
            <h3>Recent Searches</h3>
          </section>

          <section onClick={() => setShowDeveloperPopup(true)}>
            <h3>The Developers</h3>
            <p>Click to view</p>
          </section>

          <div className="theme-section">
            <div className="sidebar-theme-toggle">
              <Switch
                checked={darkMode}
                onChange={(e) => {
                  const newMode = e.target.checked;
                  setDarkMode(newMode);
                  localStorage.setItem('darkMode', JSON.stringify(newMode));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SEARCHES POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-top" onClick={() => setShowPopup(false)}>×</button>
            <h2>Recent Searches</h2>
            {history.length > 0 ? (
              isClearing ? (
                <ProgressLoader />
              ) : (
                <>
                  <button
                    className="clear-btn-top"
                    onClick={async () => {
                      setIsClearing(true);
                      await new Promise(resolve => setTimeout(resolve, 2500));
                      for (const item of history) {
                        await deleteHistory(item.id);
                      }
                      const hist = await getHistory();
                      setHistory(hist);
                      setIsClearing(false);
                    }}
                  >
                    Clear All
                  </button>
                  <ul className="history-list">
                    {history.map((item) => (
                      <li key={item.id} onClick={() => { setCity(item.city); setShowPopup(false); }}>
                        <strong>{item.city}</strong> <br />
                        {new Date(item.searched_at).toLocaleDateString()} -{" "}
                        {new Date(item.searched_at).toLocaleTimeString()} <br />
                        <em>{item.weather_description || 'No description'}</em>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}
                          className="delete-btn"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )
            ) : (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No recent searches</p>
            )}
          </div>
        </div>
      )}

      {/* GALLERY POPUP */}
      {showGalleryPopup && (
        <div className="popup-overlay">
          <div className="popup-content gallery-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-top" onClick={() => setShowGalleryPopup(false)}>×</button>
            <h2>Photo Gallery - {city}</h2>
            <PhotoGallery
              photos={cityPhotos}
              onDelete={async (photoId) => {
                try {
                  await deletePhoto(photoId);
                  const photos = await getCityPhotos(city);
                  setCityPhotos(photos);
                } catch (err) {
                  console.error('Error deleting photo:', err);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* DEVELOPER POPUP */}
      {showDeveloperPopup && (
        <div className="popup-overlay">
          <div className="popup-content developer-popup" onClick={(e) => e.stopPropagation()}>
            <Pattern />
            <div style={{ position: 'relative', zIndex: 2, padding: '20px', color: 'white' }}>
              <button className="close-btn-top" onClick={() => setShowDeveloperPopup(false)}>×</button>
              <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>The Developers</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                <DeveloperCard
                  name=""
                  role=""
                  description=""
                  bgImage={assetPaths.lacandula}
                  cornerColor="#ff4757"
                  hoverText="Backend Developer"
                  cardName="Christian Elle Lacandula"
                />
                <DeveloperCard
                  name=""
                  role=""
                  description=""
                  bgImage={assetPaths.lope}
                  cornerColor="#3742fa"
                  hoverText="Frontend Developer"
                  cardName="Rose Angelie Lope"
                />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px', color: 'white', paddingTop: '80px' }}>
              <p>Built with React, Next.js, Node.js, Express, and Supabase</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Thanks to the open-source community!</p>
            </div>
          </div>
        </div>
      )}

      {/* PLACED NOTES POPUP */}
      {showNotePopup && (
        <div className="popup-overlay">
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>All Placed Notes</h2>
            {allNotes.length > 0 ? (
              <div style={{ marginBottom: '20px' }}>
                {allNotes.map(note => (
                  <div key={note.id} style={{ marginBottom: '15px', padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                    {editingNoteId === note.id ? (
                      <div>
                        <textarea
                          value={editNoteText}
                          onChange={(e) => setEditNoteText(e.target.value)}
                          rows={3}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={async () => {
                              try {
                                await updateNote(note.id, editNoteText);
                                setEditingNoteId(null);
                                setEditNoteText("");
                                const allN = await getAllNotes();
                                setAllNotes(allN);
                              } catch (err) {
                                console.error("Error updating note:", err);
                              }
                            }}
                            style={{ background: 'green', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditNoteText("");
                            }}
                            style={{ background: 'gray', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ margin: '0 0 10px 0', lineHeight: '1.4' }}>{note.note}</p>
                        <small style={{ color: '#666', fontSize: '0.8rem' }}>
                          📍 {note.city} • {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString()}
                        </small>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button
                            onClick={() => {
                              setEditingNoteId(note.id);
                              setEditNoteText(note.note);
                            }}
                            style={{ background: 'blue', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await deleteNote(note.id);
                                const allN = await getAllNotes();
                                setAllNotes(allN);
                              } catch (err) {
                                console.error("Error deleting note:", err);
                              }
                            }}
                            style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', margin: '40px 0' }}>
                No notes found. Use the "+ Note" button to add notes for different cities!
              </p>
            )}
            <button className="close-btn" onClick={() => { setShowNotePopup(false); setEditingNoteId(null); setEditNoteText(""); }}>Close</button>
          </div>
        </div>
      )}

      {/* ADD NOTE POPUP */}
      {showAddNotePopup && (
        <div className="popup-overlay">
          <div className="popup-content add-note-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Notes for {city}</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '8px', marginBottom: '15px', color: '#333' }}>
                Add New Note
              </h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={4}
                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="close-btn" onClick={() => { setShowAddNotePopup(false); setNewNote(""); setEditingNoteId(null); setEditNoteText(""); }}>Close</button>
              <button
                className="clear-btn"
                onClick={async () => {
                  if (!newNote.trim()) return;
                  try {
                    await addNote(city, newNote);
                    setNewNote("");
                    setShowAddNotePopup(false);
                    const cityNotes = await getCityNotes(city);
                    setNotes(cityNotes);
                    const allN = await getAllNotes();
                    setAllNotes(allN);
                  } catch (err) {
                    console.error("Error saving note:", err);
                  }
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="main" onClick={(e) => {
        if (menuOpen) setMenuOpen(false);
        if (activeNoteId) setActiveNoteId(null);
      }}>
        {!menuOpen && (
          <button className="menu-toggle" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
            ☰
          </button>
        )}

        {/* TOP LEFT */}
        <div className="top-left">
          {error ? (
            <>
              <h2>{error}</h2>
              <p className="tagline">Did you misspell it? Try again.</p>
            </>
          ) : loadingMessage ? (
            <Loader darkMode={darkMode} />
          ) : weather ? (
            <>
              <div className="temp-row">
                <h1 className="temperature">{weather.temperature}</h1>
                <img
                  src={getWeatherIcon(weather.description)}
                  alt="weather icon"
                  className="weather-icon"
                />
              </div>
              <h2>{city}</h2>
              <p>{weather.description}</p>
              <div className="location-and-note-row">
                <p className="location">
                  <img src={assetPaths.location} alt="location" className="location-icon" />{" "}
                  {city}
                </p>
                <div className="action-buttons">
                  <button className="add-note-btn" onClick={() => setShowAddNotePopup(true)}>+ Note</button>
                  <GalleryButton onClick={() => setShowGalleryPopup(true)} bgClass={bgClass} />
                </div>
              </div>

              {notes.length > 0 && (
                <div className="notes-row">
                  {notes.map(note => (
                    <div key={note.id} className="note-container">
                      <div className="note-chip">
                        <span
                          onClick={() => setActiveNoteId(activeNoteId === note.id ? null : note.id)}
                          style={{ cursor: 'pointer', display: 'block' }}
                        >
                          {note.note}
                        </span>
                        {activeNoteId === note.id && (
                          <div className="action-buttons">
                            <button
                              className="delete-btn"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this note?')) {
                                  try {
                                    await deleteNote(note.id);
                                    const cityNotes = await getCityNotes(city);
                                    setNotes(cityNotes);
                                    const allN = await getAllNotes();
                                    setAllNotes(allN);
                                    setActiveNoteId(null);
                                  } catch (err) {
                                    console.error("Error deleting note:", err);
                                  }
                                }
                              }}
                              title="Delete note"
                            >
                              ×
                            </button>
                            <button
                              className="edit-btn"
                              onClick={() => {
                                const newText = prompt('Edit note:', note.note);
                                if (newText && newText.trim() && newText !== note.note) {
                                  updateNote(note.id, newText.trim())
                                    .then(() => {
                                      getCityNotes(city).then(notes => {
                                        setNotes(notes);
                                        getAllNotes().then(allN => {
                                          setAllNotes(allN);
                                          setActiveNoteId(null);
                                        });
                                      });
                                    })
                                    .catch(err => console.error("Error updating note:", err));
                                }
                              }}
                              title="Edit note"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}

          {/* CITY PHOTO UPLOAD */}
          {weather && (
            <div className="city-photo-section">
              <p className="photo-prompt">Share photos of {city}</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={(e) => setSelectedPhotoFiles(Array.from(e.target.files))}
                className="photo-upload"
              />
              {(selectedPhotoFiles.length > 0 || isUploadingPhotos || uploadComplete) && (
                isUploadingPhotos ? (
                  <div className="upload-loader-container">
                    <UploadLoader />
                    <div className="uploading-text">Uploading</div>
                  </div>
                ) : uploadComplete ? (
                  <div className="upload-complete">Upload Complete</div>
                ) : (
                  <button
                    className="upload-photo-btn"
                    onClick={async () => {
                      if (selectedPhotoFiles.length > 0) {
                        setIsUploadingPhotos(true);
                        for (const file of selectedPhotoFiles) {
                          try {
                            await uploadPhoto(city, file);
                          } catch (err) {
                            console.error('Error uploading photo:', err);
                          }
                        }
                        const photos = await getCityPhotos(city);
                        setCityPhotos(photos);
                        setIsUploadingPhotos(false);
                        setUploadComplete(true);
                        setSelectedPhotoFiles([]);
                        const input = document.querySelector('.photo-upload');
                        if (input) input.value = '';
                        setTimeout(() => setUploadComplete(false), 2000);
                      }
                    }}
                  >
                    Upload Selected Photo
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* TOP RIGHT */}
        <div className="top-right">
          <div className="search-bar">
            <img
              src={assetPaths.location}
              alt="search location"
              className="search-icon"
            />
            <input
              type="text"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  const formatted = input
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");
                  setError(null);
                  setCity(formatted);
                  setInput("");
                }
              }}
            />
          </div>

          <div className="datetime">
            <p className="time" suppressHydrationWarning>{dateTime.toLocaleTimeString()}</p>
            <p className="date" suppressHydrationWarning>{formattedDate}</p>
          </div>

          <div className="forecast">
            {loadingMessage ? (
              [1, 2, 3].map((day) => (
                <div key={day} className="forecast-card">
                  <ForecastLoader />
                </div>
              ))
            ) : error || !forecast.length ? (
              [1, 2, 3].map((day) => (
                <div key={day} className="forecast-card">
                  <p>Day {day}</p>
                  <p>--</p>
                  <p>--</p>
                </div>
              ))
            ) : (
              forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p>Day {index + 1}</p>
                  <img
                    src={getWeatherIcon(day.temperature + " " + day.wind)}
                    alt="forecast"
                    className="forecast-icon"
                  />
                  <p>{day.temperature}</p>
                  <p>{day.wind}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM RIGHT */}
        <div className="bottom-right">
          Developed by Lacandula & Lope using{" "}
          <a
            href="https://github.com/robertoduessmann/weather-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            weather-api
          </a>
        </div>
      </div>
    </div>
  );
}
