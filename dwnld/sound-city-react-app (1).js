// ============================================
// IMPORTS
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// ============================================
// DATA CONFIGURATION
// ============================================

// Capital cities data
const CITIES = [
  { id: 1, name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { id: 2, name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { id: 3, name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { id: 4, name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { id: 5, name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { id: 6, name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { id: 7, name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  { id: 8, name: 'Rio', lat: -22.9068, lng: -43.1729, country: 'Brazil' },
  { id: 9, name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  { id: 10, name: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia' }
];

// Sound layer types configuration
const SOUND_TYPES = [
  { id: 'air', label: 'Air Pollution', color: '#FF6B6B', freq: 220 },
  { id: 'temp', label: 'Temperature', color: '#FFA07A', freq: 330 },
  { id: 'green', label: 'Green Space', color: '#4ECDC4', freq: 440 },
  { id: 'noise', label: 'Noise Pollution', color: '#95E1D3', freq: 550 }
];

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    air: true,
    temp: true,
    green: true,
    noise: true
  });
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for audio context and oscillators
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef({});

  // ============================================
  // AUDIO INITIALIZATION
  // ============================================
  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ============================================
  // SONIFICATION FUNCTIONS
  // ============================================
  
  // Create individual oscillator for sound layer
  const createOscillator = (type) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type.freq, audioContextRef.current.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    oscillator.start();
    
    return { oscillator, gainNode };
  };

  // Start sonification for selected city
  const startSonification = (city) => {
    if (!audioContextRef.current) return;
    
    stopAllOscillators();
    
    SOUND_TYPES.forEach(type => {
      if (activeLayers[type.id]) {
        oscillatorsRef.current[type.id] = createOscillator(type);
      }
    });
  };

  // Stop all active oscillators
  const stopAllOscillators = () => {
    Object.values(oscillatorsRef.current).forEach(({ oscillator }) => {
      try {
        oscillator.stop();
      } catch (e) {
        console.log('Oscillator already stopped');
      }
    });
    oscillatorsRef.current = {};
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsPlaying(true);
    startSonification(city);
  };

  // Toggle play/pause
  const togglePlayback = () => {
    if (isPlaying) {
      stopAllOscillators();
      setIsPlaying(false);
    } else if (selectedCity) {
      startSonification(selectedCity);
      setIsPlaying(true);
    }
  };

  // Toggle individual sound layer
  const toggleLayer = (layerId) => {
    const newActiveLayers = { ...activeLayers, [layerId]: !activeLayers[layerId] };
    setActiveLayers(newActiveLayers);
    
    if (selectedCity && isPlaying) {
      if (newActiveLayers[layerId]) {
        // Add sound layer
        const type = SOUND_TYPES.find(t => t.id === layerId);
        oscillatorsRef.current[layerId] = createOscillator(type);
      } else {
        // Remove sound layer
        if (oscillatorsRef.current[layerId]) {
          try {
            oscillatorsRef.current[layerId].oscillator.stop();
          } catch (e) {
            console.log('Oscillator already stopped');
          }
          delete oscillatorsRef.current[layerId];
        }
      }
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="header-title">Sound of the City</h1>
            <p className="header-subtitle">Data Sonification Experience</p>
          </div>
          {selectedCity && (
            <button onClick={togglePlayback} className="play-button">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="map-container">
            <h2 className="map-title">Select a City</h2>
            
            {/* CITY GRID */}
            <div className="city-grid">
              {CITIES.map(city => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`city-button ${selectedCity?.id === city.id ? 'selected' : ''}`}
                >
                  <div className="city-icon">
                    {isPlaying && selectedCity?.id === city.id ? (
                      <Volume2 size={24} />
                    ) : (
                      <VolumeX size={24} />
                    )}
                  </div>
                  <div className="city-info">
                    <div className="city-name">{city.name}</div>
                    <div className="city-country">{city.country}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* SELECTED CITY INFO */}
            {selectedCity && (
              <div className="selected-info">
                <p>
                  Now sonifying: <span className="selected-city-name">{selectedCity.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="footer">
        <div className="footer-content">
          <h3 className="footer-title">Sound Layers</h3>
          <div className="sound-layers-grid">
            {SOUND_TYPES.map(type => (
              <label
                key={type.id}
                className={`layer-toggle ${activeLayers[type.id] ? 'active' : ''}`}
                style={{
                  boxShadow: activeLayers[type.id] ? `0 0 20px ${type.color}50` : 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={activeLayers[type.id]}
                  onChange={() => toggleLayer(type.id)}
                  className="layer-checkbox"
                />
                <div className="layer-info">
                  <div className="layer-name">{type.label}</div>
                  <div className="layer-frequency">{type.freq} Hz</div>
                </div>
                <div
                  className="layer-color-indicator"
                  style={{ backgroundColor: type.color }}
                />
              </label>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;