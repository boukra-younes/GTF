import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiClipboard, FiBell, FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { UserContext } from "../contexts/UserContext";
import "./AgentBar.css";

const AgentBar = ({ theme, toggleTheme, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/GTF/backend/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <nav className="agent-navbar">
      <div className="agent-navbar-container">
        <div className="agent-navbar-brand">
          <Link to="/agent" className="agent-logo-link">
            <span className="agent-logo">GTF</span>
            <span className="agent-brand-text">Agent Portal</span>
          </Link>
        </div>

        <ul className="agent-navbar-menu desktop-menu">
          <li>
            <Link
              to="/agent/tasks"
              className={`agent-navbar-menu-item ${isActive("/tasks") ? "active" : ""}`}
            >
              <FiClipboard />
              <span>Mes Tâches</span>
            </Link>
          </li>
          <li>
            <Link
              to="/agent/notifications"
              className={`agent-navbar-menu-item ${isActive("/notifications") ? "active" : ""}`}
            >
              <FiBell />
              <span>Notifications</span>
            </Link>
          </li>
        </ul>

        <div className="agent-navbar-actions">
          <button
            className="agent-theme-toggle"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>

          <div className="agent-profile-container">
            <button
              className="agent-profile-circle"
              onClick={toggleProfileMenu}
              title="Profile menu"
            >
              {user && user.fname ? user.fname.charAt(0).toUpperCase() : "U"}
            </button>

            <div className={`agent-profile-menu ${profileMenuOpen ? "open" : ""}`}>
              <div className="agent-profile-header">
                <span className="agent-profile-name">{user ? user.fname : "Agent"}</span>
                <span className="agent-profile-email">{user ? user.email : ""}</span>
              </div>
              <div className="agent-profile-menu-items">
                <button
                  className="agent-profile-menu-item logout"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>

          <button
            className="agent-mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`agent-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="agent-mobile-menu-list">
          <li>
            <Link
              to="/agent/tasks"
              className={`agent-mobile-menu-item ${isActive("/tasks") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiClipboard />
              <span>Mes Tâches</span>
            </Link>
          </li>
          <li>
            <Link
              to="/agent/notifications"
              className={`agent-mobile-menu-item ${isActive("/notifications") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBell />
              <span>Notifications</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AgentBar;