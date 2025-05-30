import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import SideBar from "../../components/sidebar/SideBar";
import { UserContext } from "../../contexts/UserContext";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const GetUser = () => {
    console.log(users);
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
    console.log(location.pathname);
    getaccess(location.pathname);
      
  }, [location.pathname]); // Add location.pathname as a dependency

  return (
    <div className="admin-container">
      <SideBar user={user} />
      <div className="home-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
