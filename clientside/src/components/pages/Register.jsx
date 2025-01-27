import React, { useState } from "react";
import axios from "axios";
import Api from "../Api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

const Register = () => {
  const email = localStorage.getItem("Email");
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    email: email,
    phone: "",
    password: "",
    cpassword: "",
    profile: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    cpassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "" }));
      } else if (!passwordRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password must be 8-16 characters, include uppercase, lowercase, number, and special character.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "cpassword") {
      if (!value) {
        setErrors((prev) => ({ ...prev, cpassword: "" }));
      } else if (value !== userData.password) {
        setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match." }));
      } else {
        setErrors((prev) => ({ ...prev, cpassword: "" }));
      }
    }

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, phone: "" }));
      } else if (!phoneRegex.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number must be a 10-digit number." }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.password || errors.cpassword || errors.phone) {
      toast.error("Please fix the errors before submitting.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    try {
      const res = await axios.post(`${Api()}/signup`, userData);
      if (res.status === 201) {
        toast.success(`🦄 ${res.data.msg}!`, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      }
    } catch (error) {
      toast.error(`🦄 ${error.response.data.msg}!`, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  const handleFile = async (e) => {
    const profile = await convertToBase64(e.target.files[0]);
    setUserData((prev) => ({ ...prev, profile: profile }));
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return (
    <section className="signup-section">
      <div className="signup-container">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">It's quick and easy.</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter your name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePic" className="form-label">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleFile}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="form-input"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
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
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="cpassword"
              onChange={handleChange}
              placeholder="Confirm your password"
              className="form-input"
            />
            {errors.cpassword && <p className="error-text">{errors.cpassword}</p>}
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default Register;
