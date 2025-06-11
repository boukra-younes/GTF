import React, { useState, useEffect } from 'react';
import './ViewBRH.css';

const ViewBRH = () => {
    const [brhReports, setBrhReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refuseMessage, setRefuseMessage] = useState('');
    const [selectedBRH, setSelectedBRH] = useState(null);

    useEffect(() => {
        fetchBRHReports();
    }, []);

    const fetchBRHReports = async () => {
        try {
            const response = await fetch('http://localhost/GTF/backend/getResponsableBRH.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setBrhReports(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch BRH reports');
        } finally {
            setLoading(false);
        }
    };

    const handleValidation = async (brhId, status) => {
        try {
            const response = await fetch('http://localhost/GTF/backend/validateBRH.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    brh_id: brhId,
                    status: status,
                    message: refuseMessage
                })
            });
            const data = await response.json();

            if (data.success) {
                await fetchBRHReports();
                setRefuseMessage('');
                setSelectedBRH(null);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to validate BRH');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="view-brh-container">
            <h2>BRH Reports</h2>
            <div className="brh-list">
                {brhReports.map((brh) => (
                    <div key={brh.id} className={`brh-card ${brh.statusR}`}>
                        <h3>{brh.titre}</h3>
                        <p>Agent: {brh.agent_name}</p>
                        <p>Week: {brh.week_number} - {brh.year}</p>
                        <p>Volume Prévu: {brh.volume_prevu}</p>
                        <p>Volume Réalisé: {brh.volume_realise}</p>
                        <p>Volume Restant: {brh.volume_restant}</p>
                        <p>Nombre d'Ouvriers: {brh.nbr_ouvriers}</p>
                        <p>Moyens Matériel: {brh.moyens_materiel}</p>
                        {brh.observation && <p>Observation: {brh.observation}</p>}
                        <p>Status: {brh.statusR}</p>
                        
                        {brh.statusR === 'pending' && (
                            <div className="validation-actions">
                                <button 
                                    className="accept-btn"
                                    onClick={() => handleValidation(brh.id, 'accepted')}
                                >
                                    Accepter
                                </button>
                                <button 
                                    className="refuse-btn"
                                    onClick={() => setSelectedBRH(brh.id)}
                                >
                                    Refuser
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedBRH && (
                <div className="refuse-modal">
                    <div className="modal-content">
                        <h3>Raison du refus</h3>
                        <textarea
                            value={refuseMessage}
                            onChange={(e) => setRefuseMessage(e.target.value)}
                            placeholder="Entrez la raison du refus..."
                        />
                        <div className="modal-actions">
                            <button 
                                onClick={() => handleValidation(selectedBRH, 'refused')}
                                disabled={!refuseMessage.trim()}
                            >
                                Confirmer
                            </button>
                            <button onClick={() => setSelectedBRH(null)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewBRH;