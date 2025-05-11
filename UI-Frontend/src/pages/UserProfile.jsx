import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserProfile.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const UserProfile = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          role: data.role?.toUpperCase() || "USER",
        });

        if (data.profilePicture) {
          const fullUrl = `${BASE_URL}${data.profilePicture}`;
          setPreviewUrl(fullUrl);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setErrorMessage("Failed to load user data");
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      if (selectedFile) {
        form.append("profilePicture", selectedFile);

        const res = await fetch(
          `${BASE_URL}/api/users/${userId}/profile-picture`,
          {
            method: "PUT",
            credentials: "include",
            body: form,
          }
        );

        if (!res.ok) throw new Error("Failed to upload profile picture");

        const result = await res.json();
        const updatedUser = result.data;

        setUser((prev) => ({
          ...prev,
          profilePicture: updatedUser.profilePicture,
        }));

        setPreviewUrl(`${BASE_URL}/uploads/${updatedUser.profilePicture}`);
      }

      setEditMode(false);
      setSelectedFile(null);
      setSuccessMessage("Profile picture updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage("Failed to update profile");
    }
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="user-profile-container">
      <h2 className="profile-title">{user.name || "Unnamed User"}'s Profile</h2>

      {!editMode && (
        <div className="edit-button-container">
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      )}

      <div className="profile-photo">
        {previewUrl && <img src={previewUrl} alt="Profile" />}
        {editMode && (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
      </div>

      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Role:</label>
        <select name="role" value={formData.role} disabled={true}>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>

        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!editMode}
        />

        {editMode && (
          <div className="save-button-container">
            <button type="button" className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default UserProfile;
