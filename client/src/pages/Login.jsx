import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await client.post("/auth/login", { username, password });
      login(res.data.accessToken, res.data.refreshToken, { username });
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "60px auto", padding: "20px" }}>
      <h2>Login</h2>
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
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Log in
        </button>
      </form>
      <p style={{ marginTop: "10px", fontSize: "13px" }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}