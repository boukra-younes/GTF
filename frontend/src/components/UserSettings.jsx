import React, { useState, useEffect } from "react";
import "./UserSettings.css";

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('user');
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the new endpoint
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost/GTF/backend/getUserInfo.php", {
          method: "GET",
          credentials: "include",
        });
        
        const result = await response.json();
        
        if (result.success && result.user) {
          setUser(result.user);
          setFormData(prevData => ({
            ...prevData,
            fname: result.user.fname || "",
            email: result.user.email || ""
          }));
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

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUserSettingsSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://localhost/GTF/backend/usersmanagement/modifyprofile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fname: formData.fname,
          email: formData.email,
          currentPassword: formData.currentPassword || null,
          newPassword: formData.newPassword || null
        }),
      });

      const result = await response.json();
      setMessage(result.message);
      setIsSuccess(result.success);
      
      if (result.success && result.user) {
        // Update the local user state with new information
        setUser(result.user);
        
        // Clear password fields
        setFormData(prevData => ({
          ...prevData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
      console.error(error);
    }
  };

  const handleSystemSettingsSubmit = async (e) => {
    e.preventDefault();
    // Implement system settings update logic here
    setMessage("System settings updated successfully");
    setIsSuccess(true);
  };

  if (loading) {
    return <div className="settings-container">Loading user data...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      {message && (
        <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            User Settings
          </button>
          <button 
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System Settings
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'user' && (
            <form onSubmit={handleUserSettingsSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="fname">Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          )}
          
          {activeTab === 'system' && (
            <form onSubmit={handleSystemSettingsSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select 
                  id="language" 
                  name="language" 
                  className="form-control"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Notifications</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                    />
                    <label htmlFor="emailNotifications">
                      Email Notifications
                    </label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      name="smsNotifications"
                    />
                    <label htmlFor="smsNotifications">
                      SMS Notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary">Save System Settings</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;