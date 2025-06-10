import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { FiClock, FiCalendar, FiCheckCircle, FiFileText, FiX } from "react-icons/fi";
import "./AgentTravail.css";
import BRHForm from "./BRHForm";

const AgentTravail = () => {
  const [travails, setTravails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBRHForm, setShowBRHForm] = useState(false);
  const [selectedTravail, setSelectedTravail] = useState(null);
  const { user } = useContext(UserContext);

  const fetchAgentTravails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/getagenttravails.php",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      
      if (data.success === false) {
        setError(data.message || "Failed to fetch tasks");
      } else {
        setTravails(data);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tasks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTravails();
  }, []);

  const handleMarkComplete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/completetravail.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchAgentTravails(); // Refresh the tasks
      } else {
        alert(result.message || "Failed to mark task as complete");
      }
    } catch (err) {
      alert("Error updating task status");
    }
  };

  const handleOpenBRHForm = (travail) => {
    setSelectedTravail(travail);
    setShowBRHForm(true);
  };

  const handleCloseBRHForm = () => {
    setShowBRHForm(false);
    setSelectedTravail(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="agent-travail-container">
      <div className="agent-travail-header">
        <h1 className="agent-travail-title">Mes Tâches</h1>
        <p className="agent-travail-subtitle">Gérez vos tâches et soumettez vos rapports hebdomadaires (BRH)</p>
      </div>

      {loading ? (
        <div className="agent-travail-loading">
          <div className="agent-travail-spinner"></div>
          <p>Chargement des tâches...</p>
        </div>
      ) : error ? (
        <div className="agent-travail-error">
          <p>{error}</p>
          <button onClick={fetchAgentTravails} className="agent-travail-retry-btn">
            Réessayer
          </button>
        </div>
      ) : travails.length === 0 ? (
        <div className="agent-travail-empty">
          <p>Vous n'avez aucune tâche assignée pour le moment.</p>
        </div>
      ) : (
        <div className="agent-travail-list">
          {travails.map((travail) => {
            const daysLeft = calculateDaysLeft(travail.date_fin);
            const isOverdue = daysLeft < 0;
            
            return (
              <div key={travail.id} className="agent-travail-card">
                <div className="agent-travail-card-header">
                  <h2 className="agent-travail-card-title">{travail.titre}</h2>
                  <span className={`agent-travail-status ${travail.status}`}>
                    {travail.status === "pending" && "En attente"}
                    {travail.status === "in_progress" && "En cours"}
                    {travail.status === "completed" && "Terminé"}
                  </span>
                </div>
                
                <div className="agent-travail-card-body">
                  <p className="agent-travail-description">{travail.description}</p>
                  
                  <div className="agent-travail-details">
                    <div className="agent-travail-detail">
                      <FiCalendar className="agent-travail-icon" />
                      <span>
                        <strong>Période:</strong> {formatDate(travail.date_debut)} - {formatDate(travail.date_fin)}
                      </span>
                    </div>
                    
                    <div className="agent-travail-detail">
                      <FiClock className="agent-travail-icon" />
                      <span className={isOverdue ? "overdue" : ""}>
                        <strong>{isOverdue ? "En retard de" : "Temps restant:"}</strong>{" "}
                        {isOverdue ? Math.abs(daysLeft) : daysLeft} jour{Math.abs(daysLeft) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="agent-travail-card-footer">
                  {travail.status !== "completed" && (
                    <>
                      <button
                        className="agent-travail-brh-btn"
                        onClick={() => handleOpenBRHForm(travail)}
                      >
                        <FiFileText />
                        Remplir BRH hebdomadaire
                      </button>
                      <button
                        className="agent-travail-complete-btn"
                        onClick={() => handleMarkComplete(travail.id)}
                      >
                        <FiCheckCircle />
                        Marquer comme terminé
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showBRHForm && selectedTravail && (
        <BRHForm 
          travail={selectedTravail} 
          onClose={handleCloseBRHForm} 
          onSuccess={() => {
            handleCloseBRHForm();
            fetchAgentTravails();
          }} 
        />
      )}
    </div>
  );
};

export default AgentTravail;