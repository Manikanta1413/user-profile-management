import { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/LogOut";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";

const Admin = lazy(() => import("./pages/Admin"));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${BASE_URL}/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<p>Loading users...</p>}>
              {user?.role === "admin" ? (
                <Admin />
              ) : user ? (
                <Navigate to={`/profile/${user._id}`} />
              ) : (
                <Navigate to="/login" />
              )}
            </Suspense>
          }
        />

        {/* Profile Page Route */}
        <Route
          path="/profile/:id"
          element={
            user ? <UserProfile currentUser={user} /> : <Navigate to="/login" />
          }
        />

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
