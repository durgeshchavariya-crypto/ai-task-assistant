import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await client.post("/auth/login", { username, password });
      login(res.data.accessToken, res.data.refreshToken, { username });
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Column: Product Landing Panel */}
      <div className="auth-hero-panel">
        <div className="auth-brand">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>NEXUS AI</span>
        </div>

        <h1 className="auth-hero-title">
          Orchestrate your tasks with machine intelligence.
        </h1>
        <p className="auth-hero-subtitle">
          Supercharge your workflow. Organize, optimize, and execute your daily tasks under the guidance of our advanced language models.
        </p>

        <div className="auth-features-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="auth-feature-text">
              <h4>Advanced Agentic Systems</h4>
              <p>Execute subtasks autonomously with dynamic contextual retrieval.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="auth-feature-text">
              <h4>Time Optimization</h4>
              <p>Predict priority values and build clean schedules using AI analytics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Glassmorphic Form Card */}
      <div className="auth-form-panel">
        <div className="auth-card-glass">
          <h2>Welcome Back</h2>
          <p className="auth-card-subtitle">Access your cognitive workspace</p>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="auth-input-group">
              <input
                className="auth-input-premium"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
              <span className="auth-input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <input
                className="auth-input-premium auth-input-premium-pwd"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <span className="auth-input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="auth-feedback auth-feedback-error">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Glowing Submit Button */}
            <button className="auth-btn-gradient" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          <p className="auth-footer-premium">
            New to Nexus? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}