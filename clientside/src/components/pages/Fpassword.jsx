import React, { useState } from 'react';
import axios from 'axios';
import Api from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../css/password.css'; // Import the CSS file

const Fpassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('Email');
  console.log(email);

  const [data, setData] = useState({
    password: "",
    cpassword: ""
  });

  const [errors, setErrors] = useState({
    password: "",
    cpassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "" }));
      } else if (!passwordRegex.test(value)) {
        setErrors((prev) => ({ ...prev, password: "Password must be 8-16 characters, include uppercase, lowercase, number, and special character." }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "cpassword") {
      if (value !== data.password) {
        setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match." }));
      } else {
        setErrors((prev) => ({ ...prev, cpassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${Api()}/changepassword`, { email, password: data.password });
    toast.success(`🦄 ${res.data.msg}!`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    setTimeout(() => {
      navigate('/signin');
    }, 5000);
  };

  return (
    <div className="confirm-password-container">
      <div className="confirm-password-card">
        <h2 className="confirm-password-title">Confirm Password</h2>
        <form onSubmit={handleSubmit} className="confirm-password-form">
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="confirm-password-label">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="confirm-password-input"
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="confirm-password-label">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              onChange={handleChange}
              className="confirm-password-input"
              placeholder="Confirm your password"
              required
            />
            {errors.cpassword && <p className="error-text">{errors.cpassword}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="confirm-password-button">Confirm Password</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Fpassword;
