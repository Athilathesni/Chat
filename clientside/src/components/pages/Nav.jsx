
import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import Swal from 'sweetalert2';
import "../css/nav.css";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import Settings from "./Settings";

const Nav = ({setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008080',
      cancelButtonColor: '#f4f4f4',
      confirmButtonText: '<span style="color: white;">Yes, log me out!</span>',
      cancelButtonText: '<span style="color: #333;">Cancel</span>',
      background: '#ffffff',
      color: '#333',
      customClass: {
        title: 'text-lg font-bold',
        content: 'text-sm',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setUser('');
        navigate('/signin');
        localStorage.removeItem('Token');

        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          background: '#ffffff',
          color: '#008080',
          iconColor: '#008080',
        });
      }
    });
  };

  return (
    <nav className="nav">
      <div className="container">
      
        <Link className="titler" to="/">
          <h1 className="title">ChatApp</h1>
        </Link>
        <div className="user-section">
          <div className="menu-container">
            <FaEllipsisV
              className="menu-icon"
              onClick={toggleMenu}
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <Link to="Settings">
                <button className="dropdown-item">
                  Settings
                </button></Link>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;


