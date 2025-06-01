import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiCheck } from "react-icons/fi";
import "./AffectAgent.css";

const AffectAgent = ({ isOpen, onClose, travailId, onSuccess }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch available agents
  const fetchAgents = async () => {
    setLoading(true);
    setError("");
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
      console.log(data)
      const activeAgents = data.filter(
        (agent) => agent.user_status === "active" 
      );
      setAgents(activeAgents);
    } catch (err) {
      setError("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  // Handle agent assignment
  // In handleSubmit, make sure agent_id is a number
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedAgent) {
    setError("Please select an agent");
    return;
  }

  setSubmitting(true);
  setError("");
  try {
    const response = await fetch("http://localhost/GTF/backend/afectagent.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        travailId,
        selectedAgent,  // <-- parseInt here
      }),
    });
    
    const result = await response.json();
    console.log("Server Response:", result, travailId);
     // <-- log parsed JSON response

    if (result.success) {
      onSuccess();
      onClose();
      setSelectedAgent("");
    } else {
      setError(result.message || "Failed to assign agent");
    }
  } finally {
    setSubmitting(false);
  }
};


  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      setSelectedAgent("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="affect-agent-modal">
      <div className="affect-agent-content">
        <div className="affect-agent-header">
          <h3>
            <FiUser className="header-icon" />
            Affecter un Agent
          </h3>
          <button
            className="close-button"
            onClick={onClose}
            disabled={submitting}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="affect-agent-form">
          <div className="form-group">
            <label htmlFor="agent-select">Sélectionner un Agent:</label>
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Chargement des agents...</span>
              </div>
            ) : error && agents.length === 0 ? (
              <div className="error-state">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={fetchAgents}
                  className="retry-button"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <select
                id="agent-select"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="agent-select"
                disabled={submitting}
                required
              >
                <option value="">-- Choisir un agent --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fname} ({agent.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={submitting || !selectedAgent || loading}
            >
              {submitting ? (
                <>
                  <div className="button-spinner"></div>
                  Affectation...
                </>
              ) : (
                <>
                  <FiCheck />
                  Affecter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AffectAgent;