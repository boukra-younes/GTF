import React, { useEffect, useState } from "react";
import "./UsersTable.css";
import { FiTrash2, FiCheck } from "react-icons/fi";

function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users and filter for pending
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/getusers.php",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data)
      setUsers(Array.isArray(data) ? data.filter(u => u.status === "pending") : []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers(); // Fetch every 3 seconds
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/approveuser.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: userId }),
        }
      );
      const data = await response.json();
      if (data.success) fetchUsers();
      else setError("Failed to approve user");
    } catch (err) {
      setError("Error approving user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/deleteuser.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        }
      );
      const data = await response.json();
      if (data.success) fetchUsers();
      else setError("Failed to delete user");
    } catch (err) {
      setError("Error deleting user");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="user-table-header">
        <div className="user-table-title">Pending Users</div>
        <div className="user-table-meta">
          <div><strong>Total Pending:</strong> {users.length}</div>
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr className="table-header">
            <th className="header-cell">Name</th>
            <th className="header-cell">Email</th>
            <th className="header-cell">Status</th>
            <th className="header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr className="empty-row">
              <td className="empty-message" colSpan="4">
                No pending users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={index} className="table-row">
                <td className="table-cell">{user.fname}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td className="table-cell action-cell">
                  <button
                    className="icon-action-button approve-icon-button"
                    onClick={() => handleApprove(user.id)}
                    title="Approve"
                  >
                    <FiCheck />
                  </button>
                  <button
                    className="icon-action-button delete-icon-button"
                    onClick={() => handleDelete(user.id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default PendingUsers;