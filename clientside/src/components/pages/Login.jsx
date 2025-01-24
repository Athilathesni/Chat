import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Api from "../Api";
import '../css/login.css';  // Import the CSS file

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
    <section className="section">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn">
            Log In
          </button>
        </form>
        <div className="footer">
          <Link to="/email">Forgot your password?</Link>
        </div>
        <div className="footer">
          <p>
            Don't have an account?{" "}
            <Link to="/email" className="sign-up">
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
