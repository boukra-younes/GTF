import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Search,
  Home,
  ShoppingBag,
  Calendar,
  Users,
  Settings,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

const SideBar = ({ user, initialExpanded = false, getaccess }) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [activeItem, setActiveItem] = useState("viewers");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate("/admin/" + item);
  };

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">{user.fname.charAt(0)}</span>
          {expanded && <span className="logo-text">{user.fname}</span>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <ChevronRight />
        </button>
      </div>

      {expanded && (
        <div className="search-container">
          <Search size={16} />
          <input type="text" placeholder={user.fname} />
        </div>
      )}

      {!expanded && (
        <div className="search-icon-container">
          <Search size={20} />
        </div>
      )}

      <div className="divider"></div>

      <div className="menu-container">
        <ul className="menu-list">
          <li
            className={activeItem === "dashboard" ? "active" : ""}
            onClick={() => handleItemClick("dashboard")}
          >
            <Home size={20} />
            {expanded && <span>Dashboard</span>}
          </li>

          <li
            className={activeItem === "schedule" ? "active" : ""}
            onClick={() => handleItemClick("schedule")}
          >
            <Calendar size={20} />
            {expanded && <span>Schedule</span>}
          </li>

          <li
            className={activeItem === "users" ? "active" : ""}
            onClick={() => handleItemClick("users")}
          >
            <Users size={20} />
            {expanded && <span>Users</span>}
          </li>
        </ul>

        {expanded && <div className="menu-title settings-title">SETTINGS</div>}
        <div className="divider settings-divider"></div>

        <ul className="menu-list">
          <li
            className={activeItem === "settings" ? "active" : ""}
            onClick={() => handleItemClick("settings")}
          >
            <Settings size={20} />
            {expanded && <span>Settings</span>}
          </li>

          <li
            className={activeItem === "message" ? "active" : ""}
            onClick={() => handleItemClick("message")}
          >
            <MessageSquare size={20} />
            {expanded && <span>Message</span>}
          </li>

          <li
            className={activeItem === "notification" ? "active" : ""}
            onClick={() => handleItemClick("notification")}
          >
            <Bell size={20} />
            {expanded && <span>Notification</span>}
            <span className="notification-badge">3</span>
          </li>

          <li
            className={activeItem === "help" ? "active" : ""}
            onClick={() => handleItemClick("help")}
          >
            <HelpCircle size={20} />
            {expanded && <span>Help</span>}
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <li
          className="logout-item"
          onClick={async () => {
            await fetch("http://localhost/GTF/backend/logout.php", {
              method: "GET",
              credentials: "include", // include session cookies
            });
            getaccess(location.pathname);
          }}
        >
          <LogOut size={20} color="#f43f5e" />
          {expanded && <span className="logout-text">Log out</span>}
        </li>
      </div>
    </div>
  );
};

export default SideBar;
