import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/auth/register", { username, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "60px auto", padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "13px" }}>Registered! Redirecting...</p>}
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px", fontSize: "13px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}