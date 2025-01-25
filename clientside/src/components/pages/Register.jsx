import React, { useState } from "react";
import axios from "axios";
import "../css/register.css"
import Api from "../Api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  
    // Update user data
    setUserData((prev) => ({ ...prev, [name]: value }));
  
    // Validation while typing
    if (name === "password") {
      const passwordRegex = /^(?=.*[0-9]).{4}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "" })); // Handle empty field
      }
      else if (!passwordRegex.test(value)) {
        setErrors((prev) => ({ ...prev, password: "Password must be 4" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  
    if (name === "cpassword") {
      if (!value) {
        setErrors((prev) => ({ ...prev, cpassword: "" })); // Handle empty field
      }
      // Directly compare with the current value of password in the state, not userData
      else if (value !== userData.password) {
        setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match." }));
      } else {
        setErrors((prev) => ({ ...prev, cpassword: "" }));
      }
    }
  
    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, phone: "" })); // Handle empty field
      }
      else if (!phoneRegex.test(value)) {
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
    <section className="h-screen flex items-center justify-center">
    <div className="card-container">
      <h2 className="text-2xl">Create Your Account</h2>
      <p className="text-gray">It's quick and easy.</p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Enter your name"
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePic" className="label">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFile}
            className="input input-file"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="input"
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            className="input"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="cpassword" className="label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            onChange={handleChange}
            placeholder="Confirm your password"
            className="input"
          />
          {errors.cpassword && <p className="error-message">{errors.cpassword}</p>}
        </div>
        <button type="submit" className="btn-submit">
          Create Account
        </button>
      </form>
      <ToastContainer className="toast-container" />
    </div>
  </section>
  );
};

export default Register;