import React, { useEffect, useState } from "react";
import ModifyUser from "../ModifyUser";

function UsersTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost/GTF/backend/usersmanagement/getusers.php"
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

  // Log users after state update
  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.fname}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => setSelectedUser({ user, action: "edit" })}
                  >
                    Modify
                  </button>
                  <button
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
        />
      )}
    </>
  );
}

export default UsersTable;
