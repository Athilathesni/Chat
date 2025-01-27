import React, {useState } from "react";
import { Link } from "react-router-dom";
import "../css/nav.css"; // Import the CSS file
import { FaSearch } from "react-icons/fa";
const Nav = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <nav className="nav">
      <div className="container">
        {/* Title */}
        <Link className="titler" to="/">
          <h1 className="title">ChatApp</h1>
        </Link>
        <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search contacts"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      
                 </div>
        <h2 className="user-name">{user}</h2>
      </div>
    </nav>
  );
};

export default Nav;
