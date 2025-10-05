        // ========================================
        // DATA STRUCTURE
        // ========================================
        
        // City data with coordinates (percentage positions on map)
        const cities = [
            { id: 1, name: 'Tokyo', country: 'Japan', x: 82, y: 35 },
            { id: 2, name: 'London', country: 'United Kingdom', x: 48, y: 28 },
            { id: 3, name: 'New York', country: 'USA', x: 25, y: 32 },
            { id: 4, name: 'Paris', country: 'France', x: 49, y: 30 },
            { id: 5, name: 'Sydney', country: 'Australia', x: 86, y: 75 },
            { id: 6, name: 'São Paulo', country: 'Brazil', x: 30, y: 68 },
            { id: 7, name: 'Cairo', country: 'Egypt', x: 54, y: 42 },
            { id: 8, name: 'Mumbai', country: 'India', x: 68, y: 45 },
            { id: 9, name: 'Moscow', country: 'Russia', x: 58, y: 22 },
            { id: 10, name: 'Mexico City', country: 'Mexico', x: 18, y: 45 }
        ];

        // Sound layer controls
        const soundLayers = [
            { id: 'air', label: 'Air Pollution', enabled: false },
            { id: 'temp', label: 'Temperature', enabled: false },
            { id: 'green', label: 'Green Space', enabled: false },
            { id: 'noise', label: 'Noise Pollution', enabled: false }
        ];

        // ========================================
        // STATE MANAGEMENT
        // ========================================
        
        let selectedCityId = null;

        // ========================================
        // RENDER FUNCTIONS
        // ========================================
        
        function renderCityList() {
            const container = document.getElementById('cityListContainer');
            container.innerHTML = cities.map(city => `
                <div class="city-item ${selectedCityId === city.id ? 'active' : ''}" 
                     data-city-id="${city.id}"
                     onclick="selectCity(${city.id})">
                    <div class="city-name">${city.name}</div>
                    <div class="city-country">${city.country}</div>
                </div>
            `).join('');
        }

        function renderMapMarkers() {
            const container = document.getElementById('mapMarkersContainer');
            container.innerHTML = cities.map(city => `
                <div class="map-marker ${selectedCityId === city.id ? 'active' : ''}" 
                     style="left: ${city.x}%; top: ${city.y}%;"
                     data-city-id="${city.id}"
                     onclick="selectCity(${city.id})"
                     title="${city.name}, ${city.country}">
                </div>
            `).join('');
        }

        function renderSoundControls() {
            const container = document.getElementById('controlsContainer');
            container.innerHTML = soundLayers.map(layer => `
                <div class="control-item ${layer.enabled ? 'active' : ''}" 
                     data-layer-id="${layer.id}"
                     onclick="toggleSoundLayer('${layer.id}')">
                    <div class="toggle-switch"></div>
                    <span class="control-label">${layer.label}</span>
                </div>
            `).join('');
        }

        // ========================================
        // INTERACTION HANDLERS
        // ========================================
        
        function selectCity(cityId) {
            selectedCityId = cityId;
            const city = cities.find(c => c.id === cityId);
            
            // Update UI
            renderCityList();
            renderMapMarkers();
            
            // Log for debugging - placeholder for future API integration
            console.log(`Selected city: ${city.name}, ${city.country}`);
            console.log('Active sound layers:', soundLayers.filter(l => l.enabled).map(l => l.id));
            
            // PLACEHOLDER: Future function for API call
            playCitySounds(cityId);
        }

        function toggleSoundLayer(layerId) {
            const layer = soundLayers.find(l => l.id === layerId);
            layer.enabled = !layer.enabled;
            
            // Update UI
            renderSoundControls();
            
            // Log for debugging
            console.log(`Toggled ${layer.label}: ${layer.enabled ? 'ON' : 'OFF'}`);
            
            // If a city is selected, update its sounds
            if (selectedCityId) {
                updateCitySounds(selectedCityId);
            }
        }

        // ========================================
        // SOUND PLAYBACK (PLACEHOLDER FUNCTIONS)
        // These functions are prepared for future backend integration
        // ========================================
        
        function playCitySounds(cityId) {
            // PLACEHOLDER: Future implementation will fetch and play audio
            // const audioData = await fetch(`/api/cities/${cityId}/audio`);
            // playAudio(audioData);
            
            console.log(`🎵 Playing sounds for city ID: ${cityId}`);
            console.log('Enabled layers:', getEnabledLayers());
            
            // Simulate sound playback feedback
            showFeedback(`Now playing: ${cities.find(c => c.id === cityId).name}`);
        }

        function updateCitySounds(cityId) {
            // PLACEHOLDER: Update which audio layers are playing
            // const enabledLayers = getEnabledLayers();
            // updateAudioMix(cityId, enabledLayers);
            
            console.log(`🔄 Updating sound mix for city ID: ${cityId}`);
            console.log('Active layers:', getEnabledLayers());
        }

        function getEnabledLayers() {
            return soundLayers.filter(l => l.enabled).map(l => l.id);
        }

        function showFeedback(message) {
            // Simple console feedback - could be enhanced with UI toast notifications
            console.log(`✓ ${message}`);
        }

        // ========================================
        // INITIALIZATION
        // ========================================
        
        function init() {
            renderCityList();
            renderMapMarkers();
            renderSoundControls();
            
            console.log('🎨 Sound of the City initialized');
            console.log('Ready for backend integration');
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', init);

        // ========================================
        // API INTEGRATION HELPERS (For Future Use)
        // ========================================
        
        /*
        // Example API integration structure:
        
        async function fetchCityAudio(cityId, layers) {
            try {
                const response = await fetch(`/api/cities/${cityId}/audio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ layers })
                });
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch audio:', error);
            }
        }

        async function initAudioContext() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            return audioContext;
        }
        */