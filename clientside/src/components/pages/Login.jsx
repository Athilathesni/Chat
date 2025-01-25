import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Api from "../Api";
import "../css/login.css"; // Import the external CSS file

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Api()}/signin`, userData);
      if (res.status === 200) {
        localStorage.setItem("Token", res.data.token);
        toast.success(`🎉 ${res.data.msg}!`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      toast.error(`❌ ${error.response.data.msg}!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <section className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back!</h2>
        <p className="signin-subtitle">Please login to continue.</p>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>
          <button type="submit" className="signin-button">
            Log In
          </button>
        </form>
        <div className="signin-footer">
          <Link to="/email" className="signin-link">
            Forgot your password?
          </Link>
        </div>
        <div className="signin-footer">
          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/email" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
