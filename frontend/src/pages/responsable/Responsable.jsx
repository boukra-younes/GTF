import React, { useState, useEffect, useContext } from "react";
import { useNavigate ,Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import ResponsableBar from "../../components/ResponsableBar";
import "./Responsable.css";

const Responsable = () => {
  const [theme, setTheme] = useState("light");
  const [stats, setStats] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [Message, setMessage] = useState(null);
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
     console.log(response);
      if (result.success && result.user) {
        
        return result.user;
      } else {
        setMessage("Failed to load user data");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred while fetching user data");
      setIsSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getaccess = async (route) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/getuseracess.php",
        {
          method: "POST",
          // Required to send cookies (session)
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ route }), // Send route
        }
      );

      const data = await response.json(); // Expect JSON
      console.log(data);

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
     console.log(location.pathname);
    getaccess(location.pathname);
    const user = fetchUserData();

    
  }, [user, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };




  return (
    <div className="responsable-layout">
      <ResponsableBar theme={theme} toggleTheme={toggleTheme} user={user} />
      <div className="responsable-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Responsable;