import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/useAuth";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await client.post("/api/chat", { message: input });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: could not get a response." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "UX";

  return (
    <div className="chat-wrapper">
      {/* Premium Chat Header */}
      <header className="chat-header">
        <div className="chat-agent-info">
          <div className="chat-agent-status-ring"></div>
          <div className="chat-agent-title">
            <h2>Nexus AI assistant</h2>
            <div className="chat-agent-subtitle">Connected & Active</div>
          </div>
        </div>

        <button className="dash-btn dash-btn-secondary" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to tasks</span>
        </button>
      </header>

      {/* Messages Feed Area */}
      <main className="chat-feed">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>How can I assist you?</h3>
            <p>
              Ask questions about your current task list, check pending tasks, or brainstorm optimization steps.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`chat-msg-row ${msg.role === "user" ? "user" : "assistant"}`}>
              {/* Message Avatar */}
              <div className="chat-msg-avatar">
                {msg.role === "user" ? (
                  userInitials
                ) : (
                  <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8.01" y2="16" />
                    <line x1="16" y1="16" x2="16.01" y2="16" />
                  </svg>
                )}
              </div>

              {/* Message Bubble */}
              <div className="chat-bubble">
                {msg.content}
              </div>
            </div>
          ))
        )}

        {/* Typing Loader Indicator */}
        {loading && (
          <div className="chat-msg-row assistant">
            <div className="chat-msg-avatar">
              <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8.01" y2="16" />
                <line x1="16" y1="16" x2="16.01" y2="16" />
              </svg>
            </div>
            <div className="chat-bubble chat-typing-bubble">
              <span className="chat-typing-dot"></span>
              <span className="chat-typing-dot"></span>
              <span className="chat-typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </main>

      {/* Input toolbar layout */}
      <footer className="chat-input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your tasks..."
          className="chat-input-premium"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="chat-send-btn"
          disabled={loading || !input.trim()}
          title="Send message"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </footer>
    </div>
  );
}