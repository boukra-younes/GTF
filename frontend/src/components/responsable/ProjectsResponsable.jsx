import React, { useEffect, useState } from "react";
import "./ProjectsResponsable.css";
import { FiEdit, FiUserPlus, FiTrash2 } from "react-icons/fi";
import AffectAgent from "./AffectAgent";
import EditTravail from "./EditTravail";

const ProjectsResponsable = () => {
  const [travails, setTravails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAffectModal, setShowAffectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTravailId, setSelectedTravailId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [travailToDelete, setTravailToDelete] = useState(null);

  const fetchTravails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/gettravails.php",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setTravails(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch travails");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravails();
  }, []);

  const handleEdit = (id) => {
    setSelectedTravailId(id);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    fetchTravails(); // Refresh the table
  };

  const handleAffect = (id) => {
    setSelectedTravailId(id);
    setShowAffectModal(true);
  };

  const handleAffectSuccess = () => {
    fetchTravails(); // Refresh the table
  };

  const handleDeleteClick = (travail) => {
    setTravailToDelete(travail);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!travailToDelete) return;
    
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/deletetravail.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: travailToDelete.id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchTravails();
      } else {
        console.log(result.message || "Failed to delete travail");
      }
    } catch (err) {
      console.log("Error deleting travail");
    } finally {
      setShowDeleteConfirm(false);
      setTravailToDelete(null);
    }
  };

  return (
    <div className="projects-table-container">
      <div className="projects-table-header">
        <div className="projects-table-title">Travails</div>
      </div>
      <div className="projects-table-wrapper">
        <table className="projects-table">
          <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '28%' }} className="description-column" />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr className="projects-table-header">
              <th className="projects-header-cell">Titre</th>
              <th className="projects-header-cell">Description</th>
              <th className="projects-header-cell">Date Début</th>
              <th className="projects-header-cell">Date Fin</th>
              <th className="projects-header-cell">Status</th>
              <th className="projects-header-cell">Agent Affecté</th>
              <th className="projects-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="projects-empty-row">
                <td className="projects-empty-message" colSpan="7">
                  Chargement...
                </td>
              </tr>
            ) : error ? (
              <tr className="projects-empty-row">
                <td className="projects-empty-message" colSpan="7">
                  {error}
                </td>
              </tr>
            ) : travails.length === 0 ? (
              <tr className="projects-empty-row">
                <td className="projects-empty-message" colSpan="7">
                  Aucun travail trouvé
                </td>
              </tr>
            ) : (
              travails.map((travail) => (
                <tr key={travail.id} className="projects-table-row">
                  <td className="projects-table-cell">{travail.titre}</td>
                  <td className="projects-table-cell description-cell">{travail.description}</td>
                  <td className="projects-table-cell">{travail.date_debut}</td>
                  <td className="projects-table-cell">{travail.date_fin}</td>
                  <td className="projects-table-cell">
                    <span className={`status-badge ${travail.status}`}>{travail.status}</span>
                  </td>
                  <td className="projects-table-cell">
                    {travail.agent_name ? (
                      travail.agent_name
                    ) : (
                      <span style={{color: '#aaa'}}>Aucun</span>
                    )}
                  </td>
                  <td className="projects-table-cell projects-action-cell">
                    <div className="action-buttons-container">
                      <button
                        className="icon-action-button modify-icon-button"
                        onClick={() => handleEdit(travail.id)}
                        title="Modifier"
                      >
                        <FiEdit />
                      </button>
                      {!travail.agents_affectes_id && (
                        <button
                          className="icon-action-button approve-icon-button"
                          onClick={() => handleAffect(travail.id)}
                          title="Affecter"
                        >
                          <FiUserPlus />
                        </button>
                      )}
                      <button
                        className="icon-action-button delete-icon-button"
                        onClick={() => handleDeleteClick(travail)}
                        title="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Affect Agent Modal */}
      <AffectAgent
        isOpen={showAffectModal}
        onClose={() => setShowAffectModal(false)}
        travailId={selectedTravailId}
        onSuccess={handleAffectSuccess}
      />
      
      {/* Add EditTravail Modal */}
      <EditTravail
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        travailId={selectedTravailId}
        onSuccess={handleEditSuccess}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer le travail "{travailToDelete?.titre}" ?</p>
            <div className="confirmation-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setTravailToDelete(null);
                }}
              >
                Annuler
              </button>
              <button
                className="confirm-button"
                onClick={handleDeleteConfirm}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Modals */}
      <AffectAgent
        isOpen={showAffectModal}
        onClose={() => setShowAffectModal(false)}
        travailId={selectedTravailId}
        onSuccess={handleAffectSuccess}
      />
      
      <EditTravail
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        travailId={selectedTravailId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default ProjectsResponsable;