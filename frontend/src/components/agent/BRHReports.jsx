import React, { useEffect, useState } from "react";
import { FiFileText, FiCalendar } from "react-icons/fi";
import "./BRHReports.css";

const BRHReports = ({ travailId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const url = travailId
          ? `http://localhost/GTF/backend/getBRHReports.php?travail_id=${travailId}`
          : "http://localhost/GTF/backend/getBRHReports.php";

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.message || "Failed to fetch BRH reports");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch BRH reports: " + err.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, [travailId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWeekDates = (year, weekNumber) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = firstDayOfYear.getDay() - 1; // Adjust for Monday as first day of week
    const firstWeekDay = new Date(year, 0, 1 + (weekNumber - 1) * 7 - daysOffset);
    const lastWeekDay = new Date(firstWeekDay);
    lastWeekDay.setDate(lastWeekDay.getDate() + 6);
    
    return `${formatDate(firstWeekDay)} - ${formatDate(lastWeekDay)}`;
  };

  return (
    <div className="brh-reports-container">
      <div className="brh-reports-header">
        <h2 className="brh-reports-title">
          <FiFileText className="brh-reports-icon" />
          Rapports BRH
        </h2>
      </div>

      {loading ? (
        <div className="brh-reports-loading">
          <div className="brh-reports-spinner"></div>
          <p>Chargement des rapports...</p>
        </div>
      ) : error ? (
        <div className="brh-reports-error">
          <p>{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="brh-reports-empty">
          <p>Aucun rapport BRH trouvé.</p>
        </div>
      ) : (
        <div className="brh-reports-list">
          {reports.map((report) => (
            <div key={report.id} className="brh-report-card">
              <div className="brh-report-header">
                <h3 className="brh-report-title">
                  {report.travail_titre}
                </h3>
                <span className="brh-report-week">
                  <FiCalendar className="brh-report-icon" />
                  Semaine {report.week_number}, {report.year}
                </span>
              </div>
              
              <div className="brh-report-dates">
                {getWeekDates(report.year, report.week_number)}
              </div>
              
              <div className="brh-report-details">
                <div className="brh-report-detail-group">
                  <div className="brh-report-detail">
                    <span className="brh-report-label">Volume Prévu:</span>
                    <span className="brh-report-value">{report.volume_prevu}</span>
                  </div>
                  
                  <div className="brh-report-detail">
                    <span className="brh-report-label">Nombre d'Ouvriers:</span>
                    <span className="brh-report-value">{report.nbr_ouvriers}</span>
                  </div>
                </div>
                
                <div className="brh-report-detail">
                  <span className="brh-report-label">Moyens Matériels:</span>
                  <span className="brh-report-value">{report.moyens_materiel}</span>
                </div>
                
                <div className="brh-report-detail-group">
                  <div className="brh-report-detail">
                    <span className="brh-report-label">Volume Réalisé:</span>
                    <span className="brh-report-value">{report.volume_realise}</span>
                  </div>
                  
                  <div className="brh-report-detail">
                    <span className="brh-report-label">Volume Restant:</span>
                    <span className="brh-report-value">{report.volume_restant}</span>
                  </div>
                </div>
                
                {report.observation && (
                  <div className="brh-report-detail">
                    <span className="brh-report-label">Observations:</span>
                    <span className="brh-report-value observation">{report.observation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BRHReports;