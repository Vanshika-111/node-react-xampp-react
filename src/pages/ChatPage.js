import React, { useState, useRef, useEffect } from "react";
import './ChatPage.css';

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m bot 🤖 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Form & chat control
  const [chatLocked, setChatLocked] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send user message to backend
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || (chatLocked && !formSubmitted)) return;

    const userMessage = input;
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, name, email, phone }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);

      if (data.showPopup) {
        setChatLocked(true);
        setMessages(prev => [...prev, { from: "bot", type: "form" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Error connecting to AI 🤖" }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission inline in chat
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Form submitted successfully!");
        setFormSubmitted(true);
        setChatLocked(false);
        setName("");
        setEmail("");
        setPhone("");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting form!");
    }
  };

  return (
    <div className="chatpage-wrapper">
      {/* Sidebar for chat history */}
      <div className="chat-sidebar">
        <h3>History</h3>
        <div className="chat-history">
          {messages.filter(msg => msg.from === "user").map((msg, idx) => (
            <div
              key={idx}
              className="chat-history-item"
              onClick={() => {
                setMessages([
                  { from: "bot", text: "Hi! I’m bot 🤖 How can I help you today?" },
                  { from: "user", text: msg.text }
                ]);
              }}
            >
              {msg.text.length > 20 ? msg.text.slice(0, 20) + "..." : msg.text}
            </div>
          ))}
        </div>
        <button
          className="new-chat-btn"
          onClick={() => {
            setMessages([{ from: "bot", text: "Hi! I’m bot 🤖 How can I help you today?" }]);
            setFormSubmitted(false);
            setChatLocked(false);
          }}
        >
          + New Chat
        </button>
      </div>

      {/* Chat main area */}
      <div className="chat-main">
        <div className="chat-header">💬 Bandook Chat</div>

        <div className="chat-messages">
          {messages.map((msg, idx) => {
            if (msg.from === "bot") {
              return (
                <div key={idx} className="chat-message bot">
                  {msg.type === "form" ? (
                    <form onSubmit={handleFormSubmit} className="chat-form">
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <button type="submit">Submit & Continue</button>
                    </form>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  )}
                </div>
              );
            }

            return (
              <div key={idx} className="chat-message user">
                {msg.text}
              </div>
            );
          })}

          {loading && (
            <div className="chat-message bot typing">
              Typing<span className="dots">...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {!chatLocked && !formSubmitted && (
          <form className="chat-input-wrapper" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
