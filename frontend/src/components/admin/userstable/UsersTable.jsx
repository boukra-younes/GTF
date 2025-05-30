import React, { useEffect, useState } from "react";
import ModifyUser from "../ModifyUser";
import "./UsersTable.css";
import { FiTrash2, FiEdit, FiCheck, FiX } from "react-icons/fi";

function UsersTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
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
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchUsers(); // Fetch every 3 seconds
    }, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/GTF/backend/usersmanagement/deleteuser.php`,
        {
          method: "POST", // <-- Use POST usually for deletes with body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Add this function to handle user approval
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/approveuser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: userId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.error("Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Add this function to handle user deactivation
  const handleDeactivate = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/deactivateuser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: userId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.error("Failed to deactivate user");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  // Log users after state update
  useEffect(() => {
    console.log(users);
  }, [users]);

  // Calculate summary info
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const pendingUsers = users.filter(u => u.status === "pending").length;

  return (
    <>
      {/* Header Section */}
      <div className="user-table-header">
        <div className="user-table-title">Users Table</div>
        <div className="user-table-meta">
          <div><strong>Total Users:</strong> {totalUsers}</div>
          <div><strong>Active:</strong> {activeUsers}</div>
          <div><strong>Pending:</strong> {pendingUsers}</div>
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
                No users found
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
                    className="icon-action-button modify-icon-button"
                    onClick={() => setSelectedUser({ user, action: "edit" })}
                    title="Modify"
                  >
                    <FiEdit />
                  </button>
                  {user.status === "pending" && (
                    <button
                      className="icon-action-button approve-icon-button"
                      onClick={() => handleApprove(user.id)}
                      title="Approve"
                    >
                      <FiCheck />
                    </button>
                  )}
                  {user.status === "active" && (
                    <button
                      className="icon-action-button deactivate-icon-button"
                      onClick={() => handleDeactivate(user.id)}
                      title="Deactivate"
                    >
                      <FiX />
                    </button>
                  )}
                  <button
                    className="icon-action-button delete-icon-button"
                    onClick={() => setSelectedUser({ user, action: "delete" })}
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
      {selectedUser && (
        <ModifyUser
          action={selectedUser.action}
          user={selectedUser.user}
          onClose={() => setSelectedUser(null)}
          onUpdate={fetchUsers}
          className="modify-user-modal"
        />
      )}
    </>
  );
}

export default UsersTable;
