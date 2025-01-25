import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Api from '../Api';
import "../css/email.css"

const Email = () => {
  const api = Api();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [type, setType] = useState("signup");
  const [errors, setErrors] = useState({ email: "" });

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${api}/checkemail`, { email, type });
      localStorage.setItem('Email', email);

      if (res.status === 200) {
        toast.success(`🦄 ${res.data.msg}!`, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "dark",
        });

        setTimeout(() => navigate('/signin'), 6000);
      }
    } catch (error) {
      toast.error(`🦄 ${error.response?.data || "An error occurred"}!`, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <section className="email-verification-section">
      <div className="email-verification-header">
        <h2 className="email-verification-title">Email Verification</h2>
        <p className="email-verification-subtitle">Please enter your email to receive a verification link</p>
      </div>

      <div className="form-wrapper">
        <div className="form-content">
          <form>
            <div className="form-field">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-container">
                <span className="input-icon">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChangeEmail}
                  required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="type" className="form-label">Type</label>
              <div className="select-container">
                <select id="type" value={type} onChange={handleChangeType} required>
                  <option value="signup">Sign Up</option>
                  <option value="forgot-password">Forgot Password</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Verify Email
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default Email;
