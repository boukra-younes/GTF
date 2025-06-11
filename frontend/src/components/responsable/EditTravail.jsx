import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./EditTravail.css";

// Map marker component with click handler
function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition);

  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationSelect(newPos);
      map.flyTo(newPos, map.getZoom());
    },
  });

  useEffect(() => {
    if (initialPosition && map) {
      setPosition(initialPosition);
      map.flyTo(initialPosition, map.getZoom());
    }
  }, [initialPosition, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const EditTravail = ({ isOpen, onClose, travailId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    location: "",
    agents_affectes_id: ""
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.9311, lng: 0.0916 }); // Mostaganem, Algeria

  useEffect(() => {
    if (travailId && isOpen) {
      fetchTravailDetails();
      fetchAgents();
    }
  }, [travailId, isOpen]);

  const fetchTravailDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost/GTF/backend/gettravail.php?id=${travailId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        const travail = data.travail;
        
        // Parse location if it exists
        let locationObj = null;
        if (travail.location) {
          const [lat, lng] = travail.location.split(',').map(coord => parseFloat(coord));
          if (!isNaN(lat) && !isNaN(lng)) {
            locationObj = { lat, lng };
            setMapCenter(locationObj);
            setSelectedLocation(locationObj);
          }
        }
        
        setFormData({
          title: travail.titre,
          description: travail.description,
          start_date: travail.date_debut,
          end_date: travail.date_fin,
          status: travail.status,
          location: travail.location || "",
          agents_affectes_id: travail.agents_affectes_id || ""
        });
      }
    } catch (error) {
      console.error("Error fetching travail details:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/gatagents.php",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const activeAgents = data.filter(
        (agent) => agent.user_status === "active"
      );
      setAgents(activeAgents);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Convert location object to string format for database storage
    setFormData(prev => ({
      ...prev,
      location: `${location.lat},${location.lng}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/GTF/backend/updatetravail.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: travailId,
          ...formData
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setMessage("Travail updated successfully");
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        setIsSuccess(false);
        setMessage(result.message || "Failed to update travail");
      }
    } catch (error) {
      console.error("Error updating travail:", error);
      setIsSuccess(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Travail</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group map-container">
            <label>Location (Click on map to select)</label>
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker 
                onLocationSelect={handleLocationSelect} 
                initialPosition={selectedLocation}
              />
            </MapContainer>
            {selectedLocation && (
              <div className="selected-location">
                <p>Selected coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="agents_affectes_id">Assigned Agent</label>
              <select
                id="agents_affectes_id"
                name="agents_affectes_id"
                value={formData.agents_affectes_id}
                onChange={handleChange}
              >
                <option value="">-- Select Agent --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fname} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <div className={`message ${isSuccess ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="submit-button">
              Update
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTravail;