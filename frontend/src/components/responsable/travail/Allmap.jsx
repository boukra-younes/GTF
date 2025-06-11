import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Allmap.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Allmap = () => {
  const [travails, setTravails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mostaganem, Algeria coordinates as default center
  const defaultCenter = { lat: 35.9311, lng: 0.0916 };

  useEffect(() => {
    const fetchTravails = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/GTF/backend/gettravails.php', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTravails(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching travails:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTravails();
  }, []);

  // Parse location string to coordinates
  const parseLocation = (locationStr) => {
    if (!locationStr) return null;
    
    try {
      const [lat, lng] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) return null;
      return { lat, lng };
    } catch (error) {
      console.error('Error parsing location:', error);
      return null;
    }
  };

  // Filter travails with valid locations
  const travailsWithLocations = travails.filter(travail => {
    const location = parseLocation(travail.location);
    return location !== null;
  });

  if (loading) return <div className="loading">Loading map data...</div>;
  if (error) return <div className="error">Error loading map: {error}</div>;

  return (
    <div className="allmap-container">
      <h2>All Travails Map</h2>
      <div className="map-wrapper">
        <MapContainer 
          center={defaultCenter} 
          zoom={10} 
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {travailsWithLocations.map(travail => {
            const location = parseLocation(travail.location);
            if (!location) return null;
            
            return (
              <Marker 
                key={travail.id} 
                position={[location.lat, location.lng]}
              >
                <Popup>
                  <div className="travail-popup">
                    <h3>{travail.titre}</h3>
                    <p><strong>Status:</strong> {travail.status}</p>
                    <p><strong>Description:</strong> {travail.description}</p>
                    <p><strong>Start Date:</strong> {travail.date_debut}</p>
                    <p><strong>End Date:</strong> {travail.date_fin || 'Not specified'}</p>
                    <p><strong>Assigned Agent:</strong> {travail.agent_name || 'None'}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <div className="travail-count">
        <p>Showing {travailsWithLocations.length} travails on the map (out of {travails.length} total)</p>
      </div>
    </div>
  );
};

export default Allmap;