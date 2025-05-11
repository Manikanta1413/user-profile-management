import { useState } from "react";
import api from "../api/axios";
import "../styles/RegisterForm.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverMessageType, setServerMessageType] = useState("success"); // "success" or "error"

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = "Please enter a valid phone number";
    if (!formData.address) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/api/auth/register", formData, {
        withCredentials: true,
      });
      setServerMessage(response.data.message);
      setServerMessageType("success");
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Registration failed");
      setServerMessageType("error");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {serverMessage && (
        <p
          className={`server-message ${
            serverMessageType === "error" ? "error-text" : "success-text"
          }`}
        >
          {serverMessage}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error-input" : ""}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error-input" : ""}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "error-input" : ""}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? "error-input" : ""}
        />
        {errors.phoneNumber && (
          <p className="error-text">{errors.phoneNumber}</p>
        )}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? "error-input" : ""}
        />
        {errors.address && <p className="error-text">{errors.address}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
