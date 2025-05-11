import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverMessageType, setServerMessageType] = useState("success");

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      );

      setServerMessage(response.data.message);
      setServerMessageType("success");

      // Save user data to localStorage
      const loggedInUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate(`/profile/${loggedInUser.id}`);
      }
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Login failed");
      setServerMessageType("error");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {serverMessage && (
        <p
          className={`server-message ${
            serverMessageType === "error" ? "error-text" : "success-text"
          }`}
        >
          {serverMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
