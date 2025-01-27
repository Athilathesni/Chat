import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Api from '../Api';
import '../css/email.css'; // Import the CSS file

const Email = () => {
  const api = Api();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [type, setType] = useState("signup"); // Default to signup
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
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        setTimeout(() => {
          navigate('/signin');
        }, 6000);
      }
    } catch (error) {
      toast.error(`🦄 ${error.response?.data || "An error occurred"}!`, {
        position: "bottom-center",
        autoClose: 5000,
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
    <section className="email-section">
      <div className="email-container">
        <div className="email-header">
          <h2>Email Verification</h2>
          <p>Please enter your email to receive a verification link</p>
        </div>

        <div className="email-form-container">
          <div className="email-form-card">
            <form>
              <div className="email-form-fields">
                <div className="email-input-container">
                  <label htmlFor="email">Email address</label>
                  <div className="email-input-wrapper">
                    <div className="email-input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChangeEmail}
                      className="email-input"
                      required
                    />
                  </div>
                  {errors.email && <p className="email-error">{errors.email}</p>}
                </div>

                <div className="email-select-container">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={handleChangeType}
                    className="email-select"
                    required
                  >
                    <option value="signup">Sign Up</option>
                    <option value="forgot-password">Forgot Password</option>
                  </select>
                </div>

                <div className="email-submit-container">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="email-submit-button"
                  >
                    Verify Email
                  </button>
                  <ToastContainer />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Email;
