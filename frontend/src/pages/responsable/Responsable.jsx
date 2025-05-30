import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./Responsable.css";

const Responsable = () => {
  const [theme, setTheme] = useState("light");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Check if user is authenticated and has responsable role
    if (!user || user.role !== "responsable") {
      navigate("/login");
      return;
    }

    // Fetch responsable dashboard data
    fetchDashboardData();
  }, [user, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint for responsable data
      const response = await fetch("http://localhost/GTF/backend/getResponsableStats.php", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch responsable data");
      }
      
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    navigate("/responsable/add");
  };

  return (
    <div className="responsable-container">
      <header className="responsable-header">
        <div className="logo">GTF</div>
        <div className="header-actions">
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </div>
          <div className="user-info">
            <span>Welcome, {user?.fname || "Responsable"}</span>
          </div>
        </div>
      </header>

      <main className="responsable-main">
        <section className="welcome-section">
          <h1>Responsable Dashboard</h1>
          <p>Manage your environmental projects and activities</p>
        </section>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <section className="stats-section">
            <div className="stat-card">
              <h3>Active Projects</h3>
              <p className="stat-number">{stats?.activeProjects || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Projects</h3>
              <p className="stat-number">{stats?.completedProjects || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Volunteers</h3>
              <p className="stat-number">{stats?.volunteers || 0}</p>
            </div>
          </section>
        )}

        <section className="actions-section">
          <button className="action-button" onClick={handleAddProject}>
            Add New Project
          </button>
        </section>

        <section className="projects-section">
          <h2>Your Projects</h2>
          {loading ? (
            <div className="loading-spinner">Loading projects...</div>
          ) : error ? (
            <div className="error-message">Failed to load projects</div>
          ) : stats?.projects?.length > 0 ? (
            <div className="projects-grid">
              {stats.projects.map((project) => (
                <div className="project-card" key={project.id}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>Status: {project.status}</span>
                    <span>Volunteers: {project.volunteerCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects found. Start by adding a new project.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="responsable-footer">
        <p>&copy; {new Date().getFullYear()} GTF - Green Tree Foundation</p>
      </footer>
    </div>
  );
};

export default Responsable;