import { useNavigate } from "react-router-dom";
import './Chatbot.css';

function Chatbot() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <div className="chatbot-wrapper">
      <button className="chatbot-btn" onClick={handleClick}>
        💬
      </button>
      <span className="chatbot-tooltip">Chat with us</span>
    </div>
  );
}

export default Chatbot;
