// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import Api from "../Api";
// import '../css/contact.css'; // Import the CSS file

// const Contacts = ({ setUser }) => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("Token");
//   const [contacts, setContacts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     if (token) {
//       try {
//         const res = await axios.get(`${Api()}/getcontacts`, {
//           headers: { authorization: `Bearer ${token}` },
//         });
//         setContacts(res.data.contacts);
//         setUser(res.data.username);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       navigate("/signin");
//     }
//   };

//   const filteredContacts = contacts.filter((contact) =>
//     contact.username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="contacts-container">
//       <div className="contact-list-wrapper">
//         <div className="search-container">
//           <div className="search-input-wrapper">
//             <span className="search-icon">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
//                 <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="2" fill="none"/>
//                 <line x1="15" y1="15" x2="20" y2="20" stroke="black" strokeWidth="2"/>
//               </svg>
//             </span>
//             <input
//               type="text"
//               placeholder="Search contacts"
//               onChange={(e) => { setSearchQuery(e.target.value); }}
//               className="search-input"
//             />
//           </div>
//         </div>

//         <ul className="contact-list">
//           {filteredContacts.map((contact) => (
//             <Link to={`/chat/${contact._id}`} key={contact._id}>
//               <li className="contact-item">
//                 <img
//                   src={contact.profile}
//                   alt={contact.username}
//                 />
//                 <p>{contact.username}</p>
//               </li>
//             </Link>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Contacts;


import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Api from "../Api";
import '../css/contact.css';

const Contacts = ({ setUser }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getcontacts`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setContacts((res.data.contacts || []).filter((contact) => contact.username)); // Exclude invalid contacts
        setUser(res.data.username);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("Token");
          navigate("/signin");
        }
      }
    } else {
      navigate("/signin");
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact?.username?.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="contacts-container">
      <div className="contact-list-wrapper">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="2" fill="none" />
                <line x1="15" y1="15" x2="20" y2="20" stroke="black" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search contacts"
              aria-label="Search contacts"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <ul className="contact-list">
          {filteredContacts.map((contact) => (
            <Link className="lcn" to={`/chat/${contact._id}`} key={contact._id}>
              <li className="contact-item">
                <img
                  src={contact.profile || "default-profile.png"}
                  alt={`${contact.username}'s profile`}
                />
                <p className="cna">{contact.username}</p>
              </li>
            </Link>
          ))}
          {filteredContacts.length === 0 && <p className="no-results">No contacts found.</p>}
        </ul>
      </div>
    </div>
  );
};

export default Contacts;
