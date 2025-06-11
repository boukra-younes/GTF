import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserContext } from "../../../contexts/UserContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./TravailForm.css";

// Define Zod schema for validation
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid start date",
  }),
  end_date: z.string().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Please enter a valid end date",
  }).optional(),
  responsable_id: z.string().min(1, "Please select a responsible person"),
  agents_affectes_id: z.string().min(1, "Please select assigned agents"),
  status: z.string().min(1, "Please select a status"),
});

// Map marker component with click handler
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationSelect(newPos);
      map.flyTo(newPos, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const TravailForm = ({ onSuccess }) => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Mostaganem, Algeria coordinates
  const defaultCenter = { lat: 35.9311, lng: 0.0916 };
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Convert location object to string format for database storage
    setValue('location', `${location.lat},${location.lng}`);
  };

  // Fetch users for dropdown selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost/GTF/backend/usersmanagement/getusers.php",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleTravailSubmit = async (data) => {
    console.log(data);
    try {
      // This would connect to your backend endpoint
      const response = await fetch("http://localhost/GTF/backend/travail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message || "Work task created successfully");
        reset();
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        setIsSuccess(false);
        setMessage(result.message || "Failed to create work task");
      }
    } catch (error) {
      console.error("Error creating work task:", error);
      setIsSuccess(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="travail-form-container">
      <h2>Nouveau Travail</h2>
      {message && (
        <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit(handleTravailSubmit)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title")} 
            />
            {errors.title && (
              <span className="error-text">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              className={`form-control ${errors.status ? "is-invalid" : ""}`}
              {...register("status")} 
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <span className="error-text">{errors.status.message}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            className="form-control"
            rows="4"
            {...register("description")} 
          ></textarea>
        </div>

        <div className="form-group map-container">
          <label>Location (Click on map to select)</label>
          <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
          </MapContainer>
          {selectedLocation && (
            <div className="selected-location">
              <p>Selected coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="start_date">Start Date</label>
            <input 
              type="date" 
              id="start_date" 
              className={`form-control ${errors.start_date ? "is-invalid" : ""}`}
              {...register("start_date")} 
            />
            {errors.start_date && (
              <span className="error-text">{errors.start_date.message}</span>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="end_date">End Date</label>
            <input 
              type="date" 
              id="end_date" 
              className={`form-control ${errors.end_date ? "is-invalid" : ""}`}
              {...register("end_date")} 
            />
            {errors.end_date && (
              <span className="error-text">{errors.end_date.message}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="responsable_id">Responsible Person</label>
          <select 
            id="responsable_id" 
            className={`form-control ${errors.responsable_id ? "is-invalid" : ""}`}
            {...register("responsable_id")} 
          >
            <option value="">Select Responsible Person</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.fname}</option>
            ))}
          </select>
          {errors.responsable_id && (
            <span className="error-text">{errors.responsable_id.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="agents_affectes_id">Assigned Agents</label>
          <select 
            id="agents_affectes_id" 
            className={`form-control ${errors.agents_affectes_id ? "is-invalid" : ""}`}
            {...register("agents_affectes_id")} 
          >
            <option value="">Select Assigned Agent</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.fname}</option>
            ))}
          </select>
          {errors.agents_affectes_id && (
            <span className="error-text">{errors.agents_affectes_id.message}</span>
          )}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">Create Work Task</button>
        </div>
      </form>
    </div>
  );
};

export default TravailForm;