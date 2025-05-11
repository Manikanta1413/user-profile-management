import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import EditUserModal from "../components/EditUserModal";
import CreateUserModal from "../components/CreateUserModal";
import "../styles/Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createUserError, setCreateUserError] = useState(null);
  const [editUserError, setEditUserError] = useState(null);

  const fetchUsers = useCallback(
    async (pageToFetch = page) => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users?page=${pageToFetch}&limit=10`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setUsers(res.data.users);
          setTotalPages(res.data.totalPages);
          if (res.data.page !== page) {
            setPage(res.data.page);
          }
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      const res = await api.delete(`/api/users/${userId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const remainingUsers = users.filter((user) => user._id !== userId);
        const isLastUserOnPage = remainingUsers.length === 0 && page > 1;

        if (isLastUserOnPage) {
          setPage((prev) => prev - 1);
        } else {
          fetchUsers(page);
        }
      }
    } catch (err) {
      console.error("Error deleting the user:", err);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setEditUserError(null);
  };

  const handleUpdate = async (userId, updatedData) => {
    try {
      const res = await api.put(`/api/users/${userId}`, updatedData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? res.data.user : user))
        );
        setShowModal(false);
        setSelectedUser(null);
        setEditUserError(null);
      } else {
        setEditUserError(res.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Unknown error";
      setEditUserError(errorMessage);
    }
  };

  const handleCreateUser = async (newUserData) => {
    try {
      const res = await api.post("/api/users", newUserData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setShowCreateModal(false);
        setCreateUserError(null);
        setPage(1);
        fetchUsers(1);
      } else {
        setCreateUserError(res.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Unknown error";
      setCreateUserError(errorMessage);
    }
  };

  return (
    <div className="user-list-container">
      <h2 style={{ textAlign: "center" }}>Admin Page - Manage Users</h2>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          className="create-user-btn"
          onClick={() => {
            setCreateUserError(null);
            setShowCreateModal(true);
          }}
        >
          Create New User
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading users...</p>
      ) : (
        <>
          <div className="user-header user-row">
            <div className="user-name">Name</div>
            <div className="user-email">Email</div>
            <div className="user-role">Role</div>
            <div className="user-actions">Actions</div>
          </div>
          {users.map((user) => (
            <div key={user._id} className="user-row">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-role">{user.role}</div>
              <div className="user-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div
        className="pagination"
        style={{ textAlign: "center", marginTop: 20 }}
      >
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <EditUserModal
        show={showModal}
        user={selectedUser}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
          setEditUserError(null);
        }}
        onSave={handleUpdate}
        error={editUserError}
      />

      {/* Create Modal */}
      <CreateUserModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateUserError(null);
        }}
        onUserCreated={handleCreateUser}
        error={createUserError}
      />
    </div>
  );
};

export default Admin;
