import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await api.post(
          "/api/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
        setMessage(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || "Logout failed");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default LogOut;
