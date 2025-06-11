import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes, FaProjectDiagram, FaNewspaper, FaBullhorn, FaBell, FaUser, FaSignOutAlt,FaPlus, FaMap  } from 'react-icons/fa';
import './ResponsableBar.css';

const ResponsableBar = ({ theme, toggleTheme,user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();


  const menuItems = [
    { path: 'projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: 'map', icon: <FaMap />, label: 'Map' },
    { path: 'campaigns', icon: <FaBullhorn />, label: 'Campaigns' },
    { path: 'add', icon: <FaPlus  />, label: 'add' },
  ];

    const onLogout = async () => {
      try {
        const response = await fetch("http://localhost/GTF/backend/logout.php", {
          method: "POST",
          credentials: "include",
        });
       
       
          setUser(null);
          navigate("/");
        
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);

      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <nav className="responsable-navbar">
      <div className="responsable-navbar-container">
        <div className="responsable-navbar-brand">
          <Link to="/" className="responsable-logo-link">
           
            <span className="responsable-logo-text">GTF</span>
          </Link>
        </div>

        <div className="responsable-navbar-menu desktop-menu">
          <ul className="responsable-menu-list">
            {menuItems.map((item) => (
              <li key={item.path} className="responsable-menu-list-item">
                <Link
                  to={item.path}
                  className={`responsable-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="responsable-navbar-actions">
          <button className="responsable-theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          
            <Link to="notifications" className="responsable-notification-btn" >
            <FaBell />
            </Link>
            {hasNotifications && <span className="responsable-notification-badge" />}
         

          <div className="responsable-profile-container" ref={profileMenuRef}>
            <button 
              className="responsable-profile-circle" 
              onClick={toggleProfileMenu}
              title={user.fname || 'User profile'}
            >
              {user.fname?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            <div className={`responsable-profile-menu ${isProfileMenuOpen ? 'open' : ''}`}>
              <div className="responsable-profile-header">
                <span className="responsable-profile-name">{user.fname || 'User'}</span>
                <span className="responsable-profile-email">{user.email || 'user@example.com'}</span>
              </div>
              <div className="responsable-profile-menu-items">
                <Link to="/profile" className="responsable-profile-menu-item" onClick={() => setIsProfileMenuOpen(false)}>
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <button className="responsable-profile-menu-item logout" onClick={onLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            className="responsable-mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className={`responsable-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="responsable-mobile-menu-list">
          {menuItems.map((item) => (
            <li key={item.path} className="responsable-menu-list-item">
              <Link
                to={item.path}
                className={`responsable-mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
   {isMobileMenuOpen ? (
    <>
      {item.icon}
      <span>{item.label}</span>
     </>
                        ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ResponsableBar;