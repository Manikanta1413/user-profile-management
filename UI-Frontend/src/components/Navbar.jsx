import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout(); // Clears token & user state
    navigate("/login");
  };
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="navbar">
      <h3 style={{ textAlign: "center" }}>User App Management</h3>
      <div className="nav-links">
        {user ? (
          <>
            <button
              className="nav-button active"
              style={{ marginLeft: "30px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={
                isActive("/register") ? "nav-button active" : "nav-button"
              }
            >
              Register
            </Link>
            <Link
              to="/login"
              className={
                isActive("/login") ? "nav-button active-dark" : "nav-button"
              }
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
