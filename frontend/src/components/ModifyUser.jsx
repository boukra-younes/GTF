import React, { useState } from "react";
import "./ModifyUser.css";

const ModifyUser = ({ user, onClose, onUpdate, action }) => {
  const [fname, setFname] = useState(user.fname);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.id, fname, email);
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/modifyuser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: user.id,
            fname,
            email,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      if (data.success) {
        onUpdate(); // Refresh user list
        onClose(); // Close the popup
      }
    } catch (err) {
      setMessage("Failed to update user.");
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(user.id);
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/deleteuser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: user.id,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      if (data.success) {
        onUpdate(); // Refresh user list
        onClose(); // Close the popup
      }
    } catch (err) {
      setMessage("Failed to delete user.");
    }
  };

  return action === "delete" ? (
    <div className="modify-user-modal">
      <div className="modify-user-content">
        <h3>Delete User</h3>
        {message && <p>{message}</p>}
        <form onSubmit={handleDelete} action="delete">
          <div className="buttons">
            <button type="submit">Delete</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className="modify-user-modal">
      <div className="modify-user-content">
        <h3>Modify User</h3>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div className="buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyUser;
