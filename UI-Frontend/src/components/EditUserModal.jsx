import { useState, useEffect } from "react";

const EditUserModal = ({ show, user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "user", // default value
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        role: user.role || "user",
      });
      setErrors({});
    }
  }, [user]);

  if (!show) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!["admin", "user"].includes(formData.role)) {
      newErrors.role = "Role must be admin or user";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(user._id, formData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 300,
        }}
      >
        <h3>Edit User</h3>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        {errors.phoneNumber && (
          <p style={{ color: "red" }}>{errors.phoneNumber}</p>
        )}

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />

        {/* Role Dropdown */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "5px 10px",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: "gray",
              color: "white",
              padding: "5px 10px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
