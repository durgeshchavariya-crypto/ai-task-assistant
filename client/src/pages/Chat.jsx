import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
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
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>AI Task Assistant</h2>
        <button onClick={() => navigate("/dashboard")}>Back to tasks</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
          margin: "16px 0",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "#007bff" : "#e5e5ea",
                color: msg.role === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "16px",
                maxWidth: "70%",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p style={{ fontStyle: "italic" }}>AI is typing...</p>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your tasks..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}