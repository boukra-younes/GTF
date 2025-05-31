import { React, useState, useEffect } from "react";
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
  Sun,
  Moon,
  UserCheck,
} from "lucide-react";
import "./Sidebar.css";

const SideBar = ({ user, initialExpanded = false }) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [activeItem, setActiveItem] = useState("viewers");
  const [theme, setTheme] = useState("light");
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/notifications/get_notifications.php",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const notifications = await response.json();
        const unreadCount = notifications.filter((n) => !n.is_read).length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate("/admin/" + item);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/GTF/backend/logout.php", {
        method: "GET",
        credentials: "include",
      });
      // Redirect to login page after successful logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
            className={activeItem === "pending" ? "active" : ""}
            onClick={() => handleItemClick("pending")}
          >
            <UserCheck size={20} />
            {expanded && <span>Pending</span>}
          </li>

          <li
            className={activeItem === "users" ? "active" : ""}
            onClick={() => handleItemClick("users")}
          >
            <Users size={20} />
            {expanded && <span>Users</span>}
          </li>
        </ul>

        

        <ul className="menu-list">
        <li
            className={activeItem === "activity" ? "active" : ""}
            onClick={() => handleItemClick("activity")}
          >
            <MessageSquare size={20} />
            {expanded && <span>Message</span>}
          </li>
          <li
            className={activeItem === "settings" ? "active" : ""}
            onClick={() => handleItemClick("settings")}
          >
            <Settings size={20} />
            {expanded && <span>Settings</span>}
          </li>

         

          <li
            className={activeItem === "notifications" ? "active" : ""}
            onClick={() => handleItemClick("notifications")}
          >
            <Bell size={20} />
            {expanded && <span>Notifications</span>}
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </li>

          <li
            className={activeItem === "help" ? "active" : ""}
            onClick={() => handleItemClick("help")}
          >
            <HelpCircle size={20} />
            {expanded && <span>Help</span>}
          </li>

          <div className="divider settings-divider"></div>

          <li onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            {expanded && <span>Theme</span>}
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <li className="logout-item" onClick={handleLogout}>
          <LogOut size={20} color="#f43f5e" />
          {expanded && <span className="logout-text">Log out</span>}
        </li>
      </div>
    </div>
  );
};

export default SideBar;
