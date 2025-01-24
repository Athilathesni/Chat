import { useEffect, useState } from "react";
import { FaArrowLeft, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
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
        setMessages(res.data.chats);
        setUid(res.data.uid);
        setReceiver(res.data.receiver);
        setSender(res.data.sender);
        setUser(res.data.sender.username);
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
        await axios.post(`${Api()}/addmessage/${_id}`, { message, date, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchContacts();
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [deleteMenuMessageId, setDeleteMenuMessageId] = useState(null);

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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button
          onClick={() => navigate("/")}
          className="back-button"
        >
          <FaArrowLeft size={20} />
        </button>
        <Link to={`/userprofile/${receiver._id}`} className="profile-container">
          <div className="avatar">
            <img
              src={receiver.profile}
              alt="User Avatar"
            />
          </div>
          <h2>{receiver.username}</h2>
        </Link>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.senderId === uid ? 'sent' : ''}`}
          >
            <div className="avatar">
              <img
                src={msg.senderId === uid ? sender.profile : receiver.profile}
                alt="Avatar"
              />
            </div>
            <div className={`message-container ${msg.senderId === uid ? 'sent' : 'received'}`}>
              <p>{msg.message}</p>
              <p className="time">{msg.time}</p>

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


