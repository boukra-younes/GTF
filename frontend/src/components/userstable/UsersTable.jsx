import React, { useEffect, useState } from "react";
import ModifyUser from "../ModifyUser";
import "./UsersTable.css";

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

  return (
    <>
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
                    className="action-button modify-button"
                    onClick={() => setSelectedUser({ user, action: "edit" })}
                  >
                    Modify
                  </button>
                  {user.status === "pending" && (
                    <button
                      className="action-button approve-button"
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                  )}
                  {user.status === "active" && (
                    <button
                      className="action-button deactivate-button"
                      onClick={() => handleDeactivate(user.id)}
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    className="action-button delete-button"
                    onClick={() => setSelectedUser({ user, action: "delete" })}
                  >
                    DELETE
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
