
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

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
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
    <section className="signup-container">
      <div className="signup-form-card">
        <h2>Create Your Account</h2>
        <p>It's quick and easy.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter your name"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="input-label">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleFile}
              className="file-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="input-label">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="cpassword" className="input-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="cpassword"
              onChange={handleChange}
              placeholder="Confirm your password"
              className="input-field"
            />
            {errors.cpassword && <p className="error-message">{errors.cpassword}</p>}
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Create Account
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default Register;
