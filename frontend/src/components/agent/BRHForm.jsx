import React, { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import "./BRHForm.css";

const BRHForm = ({ travail, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    travail_id: travail.id,
    volume_prevu: "",
    nbr_ouvriers: "",
    moyens_materiel: "",
    volume_realise: "",
    volume_restant: "",
    observation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/GTF/backend/submitBRH.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),   
        }
      );

      const result = await response.json();
      console.log(result);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "Failed to submit BRH report");
      }
    } catch (err) {
      setError("Error submitting form: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return weekNumber;
  };

  return (
    <div className="brh-form-modal">
      <div className="brh-form-content">
        <div className="brh-form-header">
          <h2>Bulletin de Rapport Hebdomadaire (BRH)</h2>
          <p>Tâche: {travail.titre} - Semaine {getCurrentWeek()}</p>
          <button className="brh-close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="brh-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="brh-form">
          <div className="brh-form-row">
            <div className="brh-form-group">
              <label htmlFor="volume_prevu">Volume Prévu</label>
              <input
                type="number"
                id="volume_prevu"
                name="volume_prevu"
                value={formData.volume_prevu}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="brh-form-group">
              <label htmlFor="nbr_ouvriers">Nombre d'Ouvriers</label>
              <input
                type="number"
                id="nbr_ouvriers"
                name="nbr_ouvriers"
                value={formData.nbr_ouvriers}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="brh-form-group">
            <label htmlFor="moyens_materiel">Moyens Matériels</label>
            <input
              type="text"
              id="moyens_materiel"
              name="moyens_materiel"
              value={formData.moyens_materiel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="brh-form-row">
            <div className="brh-form-group">
              <label htmlFor="volume_realise">Volume Réalisé</label>
              <input
                type="number"
                id="volume_realise"
                name="volume_realise"
                value={formData.volume_realise}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="brh-form-group">
              <label htmlFor="volume_restant">Volume Restant</label>
              <input
                type="number"
                id="volume_restant"
                name="volume_restant"
                value={formData.volume_restant}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="brh-form-group">
            <label htmlFor="observation">Observations</label>
            <textarea
              id="observation"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="brh-form-actions">
            <button type="button" className="brh-cancel-button" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="brh-submit-button" disabled={loading}>
              {loading ? (
                <span className="brh-loading-spinner"></span>
              ) : (
                <>
                  <FiSave />
                  Soumettre le rapport
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BRHForm;