import { useEffect, useState } from "react";
import { FaArrowLeft, FaEllipsisV, FaTrashAlt, FaCheck, FaCheckDouble } from "react-icons/fa"; // Add icons for ticks
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Api from "../Api";
import '../css/message.css';  // Import the CSS file

const Message = ({ setUser }) => {
  const navigate = useNavigate();
  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState(""); 
  const [messages, setMessages] = useState([]); 
  const [uid, setUid] = useState('');
  const [showDeleteMenu, setShowDeleteMenu] = useState(false); 
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);  // State for the new menu
  const [deleteMenuMessageId, setDeleteMenuMessageId] = useState(null);
  const token = localStorage.getItem("Token");
  const { _id } = useParams();
  useEffect(() => {
    const interval = setInterval(() => {
      fetchContacts();
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  
  const fetchContacts = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getcontact/${_id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
  
        const updatedMessages = res.data.chats.map((msg) =>
          msg.senderId !== uid && msg.status === "sent"
            ? { ...msg, status: "delivered" } // Update status to "delivered"
            : msg
        );
  
        setMessages(updatedMessages);
        setUid(res.data.uid);
        setReceiver(res.data.receiver);
        setSender(res.data.sender);
        setUser(res.data.sender.username);
  
        // Send update request to mark messages as delivered
        await axios.put(`${Api()}/updatemessage/${_id}`, { status: "delivered" }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };
  

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentDate = new Date();
      const [date, time] = currentDate.toLocaleString().split(", ");

      try {
        const res = await axios.post(`${Api()}/addmessage/${_id}`, { message, date, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Add a status for "sent" and update the message list
        const newMessage = { ...res.data, status: 'sent' };
        setMessages([...messages, newMessage]);  // Append the new message with status 'sent'
        setMessage(""); // Clear the input
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleDeleteMenu = (messageId) => {
    setDeleteMenuMessageId(deleteMenuMessageId === messageId ? null : messageId);
  };

  const handleDeleteMessage = async (_id) => {
    try {
      await axios.delete(`${Api()}/deletemessage/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== _id));
      setDeleteMenuMessageId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearChat = async () => {
    try {
      await axios.delete(`${Api()}/clearchat/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      setShowOptionsMenu(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    console.log("Search triggered");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button
          onClick={() => navigate("/")}
          className="back-button"
        >
          <FaArrowLeft size={10} />
        </button>
        <Link to={`/userprofile/${receiver._id}`} className="profile-container1">
          <div className="avatar">
            <img
              className="avpro"
              src={receiver.profile}
              alt="User Avatar"
            />
          </div>
          <h2>{receiver.username}</h2>
        </Link>
        <div className="menu">
          <button onClick={() => setShowOptionsMenu(!showOptionsMenu)}>
            <FaEllipsisV size={15} />
          </button>
          {showOptionsMenu && (
            <div className="options-menu">
              <button onClick={() => navigate(`/userprofile/${receiver._id}`)}>
                View Contact
              </button>
              <button onClick={handleClearChat}>
                Clear Chat
              </button>
              <button onClick={handleSearch}>
                Search
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.senderId === uid ? 'sent' : ''}`}
          >
            <div className="avatar">
              <img
                className="img11"
                src={msg.senderId === uid ? sender.profile : receiver.profile}
                alt="Avatar"
              />
            </div>
            <div className={`message-container ${msg.senderId === uid ? 'sent' : 'received'}`}>
              <p>{msg.message}</p>
              <p className="time">{msg.time}</p>

            
      <div className="status">
        {msg.status === "sent" && <FaCheck size={12} className="tick sent" />}
        {msg.status === "delivered" && (
          <FaCheckDouble size={12} className="tick delivered" style={{ color: "blue" }} />
        )}
      </div>
      {msg.senderId === uid && (
                <div className="delete-btn">
                  <button onClick={() => toggleDeleteMenu(msg._id)}>
                    <FaEllipsisV size={15} />
                  </button>
                  {deleteMenuMessageId === msg._id && (
                    <div className="delete-menu">
                      <button onClick={() => handleDeleteMessage(msg._id)}>
                        <FaTrashAlt size={15} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Message;
