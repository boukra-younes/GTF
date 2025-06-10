import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import AgentBar from "../../components/AgentBar";
import "./Agent.css";

const Agent = () => {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/GTF/backend/getUserInfo.php", {
        method: "GET",
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.success && result.user) {
        return result.user;
      } else {
        setError("Failed to load user data");
      }
    } catch (error) {
      setError("An error occurred while fetching user data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async (route) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/getuseracess.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ route }),
        }
      );

      const data = await response.json();

      if (!data.access) {
        navigate("/"); // Redirect if not authorized
      }
    } catch (error) {
      console.error("Access check failed:", error);
      navigate("/"); // Fallback redirect
    }
  }; 

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    checkAccess(location.pathname);
    fetchUserData();
  }, [user, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="agent-layout">
      <AgentBar theme={theme} toggleTheme={toggleTheme} user={user} />
      <div className="agent-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Agent;