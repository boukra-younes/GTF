import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); // React Router hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/GTF/backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setMessage(result.message);
      setIsSuccess(result.success);
      console.log(result);
      if (result.success) {
        const userData = {
          id: result.id,
          email,
          fname: result.fname,
          role: result.role,
        };

        setUser(userData);
        console.log(userData);
        // Redirect based on role
        switch (result.role) {
          case "admin":
            navigate("/admin");
            break;
          case "client":
            navigate("/client");
            break;
          case "chef":
            navigate("/");
            break;
          default:
            navigate("/dashboard");

            break;
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {message && (
        <div className={`custom-alert ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
