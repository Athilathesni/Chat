import React, { useEffect, useState } from "react";
import Api from "../Api";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import '../css/profile.css'; // Import the CSS file

const Profile = ({ setUser }) => {
  const token = localStorage.getItem("token");
  const { _id } = useParams();
  const [receiver, setReceiver] = useState({});
  const navigate = useNavigate(); // Add navigate to handle redirect

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (token) {
      try {
        const res = await axios.get(
          `${Api()}/getreceiver/${_id}`,
          { headers: { "authorization": `Bearer ${token}` } }
        );
        console.log(res);
        setReceiver(res.data.ruser);
        setUser(res.data.username);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Picture */}
      <div className="profile-picture">
        <img
          src={receiver.profile}
          alt=""
        />
      </div>

      {/* User Info */}
      <div className="user-info">
        <h2>{receiver.username}</h2>
        <p><strong>Email:</strong> {receiver.email}</p>
        <p><strong>Phone:</strong> {receiver.phone}</p>
      </div>

      {/* Edit Button */}
      <Link to={`/chat/${receiver._id}`}>
        <button className="button">Back to Chat</button>
      </Link>
    </div>
  );
};

export default Profile;
