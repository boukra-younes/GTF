import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./SignupForm.css";

// Define Zod schema for validation
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  accountType: z.string().min(1, "Please select an account type"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(null); // null | true | false

  const handleSignup = async (data) => {
    const { name, email, password, accountType } = data;

    const response = await fetch("http://localhost/GTF/backend/signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, accountType }),
    });

    const result = await response.json();
    console.log(result);
    if (result.message) {
      setIsSuccess(true);
      setMessage(result.message);
      reset();
    } else if (result.error) {
      setMessage(result.error);
      setIsSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      {message && (
        <div className={`custom-alert ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(handleSignup)}>
        <input type="text" placeholder="Full Name" {...register("name")} />
        {errors.name && (
          <span className="error-text">{errors.name.message}</span>
        )}

        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <span className="error-text">{errors.email.message}</span>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <span className="error-text">{errors.password.message}</span>
        )}

        <select {...register("accountType")}>
          <option value="chef">chef</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
        {errors.accountType && (
          <span className="error-text">{errors.accountType.message}</span>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
