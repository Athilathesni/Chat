import React from "react";
import { Link } from "react-router-dom";
import "../css/nav.css"; // Import the CSS file

const Nav = ({ user }) => {
  return (
    <nav className="nav">
      <div className="container">
        {/* Title */}
        <Link to="/">
          <h1 className="title">ChatApp</h1>
        </Link>
        <h2 className="user-name">{user}</h2>
      </div>
    </nav>
  );
};

export default Nav;
