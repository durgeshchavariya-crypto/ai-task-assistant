import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await client.post("/auth/register", { username, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
          Scale your productivity with cognitive assistants.
        </h1>
        <p className="auth-hero-subtitle">
          Create an account and start managing your priorities. Nexus integrates directly with advanced neural language reasoning to structure, verify, and complete items in your logs.
        </p>

        <div className="auth-features-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
            </div>
            <div className="auth-feature-text">
              <h4>Modern Task Matrix</h4>
              <p>Keep logs clean, organized, and beautifully tracked under high-fidelity styles.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="auth-feature-text">
              <h4>Direct AI Synchronization</h4>
              <p>Query your system autonomously using a natural dialogue client.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Glassmorphic Form Card */}
      <div className="auth-form-panel">
        <div className="auth-card-glass">
          <h2>Create Account</h2>
          <p className="auth-card-subtitle">Establish your scheduling interface</p>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="auth-input-group">
              <input
                className="auth-input-premium"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || success}
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
                disabled={loading || success}
                autoComplete="new-password"
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
                disabled={loading || success}
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

            {/* Success alert */}
            {success && (
              <div className="auth-feedback auth-feedback-success">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Registered! Redirecting to login...</span>
              </div>
            )}

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
            <button className="auth-btn-gradient" type="submit" disabled={loading || success}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          <p className="auth-footer-premium">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}