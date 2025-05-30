import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserContext } from "../../contexts/UserContext";
import "./TravailForm.css";

// Define Zod schema for validation
const schema = z.object({
  titre: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  date_debut: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid start date",
  }),
  date_fin: z.string().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Please enter a valid end date",
  }).optional(),
  responsable_id: z.string().min(1, "Please select a responsible person"),
  agents_affectes_id: z.string().min(1, "Please select assigned agents"),
  status: z.string().min(1, "Please select a status"),
});

const TravailForm = ({ onSuccess }) => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      responsable_id: user?.id || "",
      status: "pending"
    }
  });

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
    try {
      // This would connect to your backend endpoint
      const response = await fetch("http://localhost/GTF/backend/travail/create_travail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
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
      <h2>Create New Work Task</h2>

      {message && (
        <div className={`custom-alert ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(handleTravailSubmit)}>
        <div className="form-group">
          <label htmlFor="titre">Title</label>
          <input 
            type="text" 
            id="titre" 
            className={`form-control ${errors.titre ? "is-invalid" : ""}`}
            {...register("titre")} 
          />
          {errors.titre && (
            <span className="error-text">{errors.titre.message}</span>
          )}
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

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location" 
            className="form-control"
            {...register("location")} 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_debut">Start Date</label>
            <input 
              type="date" 
              id="date_debut" 
              className={`form-control ${errors.date_debut ? "is-invalid" : ""}`}
              {...register("date_debut")} 
            />
            {errors.date_debut && (
              <span className="error-text">{errors.date_debut.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date_fin">End Date</label>
            <input 
              type="date" 
              id="date_fin" 
              className={`form-control ${errors.date_fin ? "is-invalid" : ""}`}
              {...register("date_fin")} 
            />
            {errors.date_fin && (
              <span className="error-text">{errors.date_fin.message}</span>
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
          <label htmlFor="status">Status</label>
          <select 
            id="status" 
            className={`form-control ${errors.status ? "is-invalid" : ""}`}
            {...register("status")} 
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <span className="error-text">{errors.status.message}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">Create Work Task</button>
      </form>
    </div>
  );
};

export default TravailForm;