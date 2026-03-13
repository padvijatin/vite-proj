import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { apiUrl } from "../utils/api";
import { FaEdit, FaShieldAlt, FaTrashAlt, FaUser } from "react-icons/fa";
import {
  showErrorToast,
  showLoadingToast,
  updateToastError,
  updateToastSuccess,
} from "../utils/toast";

const AdminUsers = () => {
  const { authorizationToken, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    isAdmin: false,
  });

  const getUsersData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const response = await fetch(apiUrl("/api/admin/users"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        const message = data.message || "Error fetching users data";
        setUsers([]);
        setFetchError(message);
        showErrorToast(message, "admin-users-fetch");
      }
    } catch (error) {
      console.log(error);
      setUsers([]);
      setFetchError("Unable to fetch users data");
      showErrorToast("Unable to fetch users data", "admin-users-request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authorizationToken || authorizationToken === "Bearer ") return;
    getUsersData();
  }, [authorizationToken]);

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      isAdmin: Boolean(user.isAdmin),
    });
  };

  const handleCancel = () => {
    setEditingUserId("");
    setFormData({
      username: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUserId) return;

    const toastId = "admin-user-update";

    try {
      showLoadingToast("Updating user...", toastId);
      const response = await fetch(
        apiUrl(`/api/admin/users/${editingUserId}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            isAdmin: formData.isAdmin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "User updated successfully");
        setUsers((prev) =>
          prev.map((user) => (user._id === editingUserId ? data.user : user))
        );
        handleCancel();
      } else {
        updateToastError(toastId, data.message || "Unable to update user");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to update user");
    }
  };

  const handleDelete = async (id) => {
    const toastId = `admin-user-delete-${id}`;

    try {
      showLoadingToast("Deleting user...", toastId);
      const response = await fetch(apiUrl(`/api/admin/users/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "User deleted successfully");
        setUsers((prev) => prev.filter((user) => user._id !== id));
        if (editingUserId === id) {
          handleCancel();
        }
      } else {
        updateToastError(toastId, data.message || "Unable to delete user");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to delete user");
    }
  };

  return (
    <section className="adminUsersPage">
      <div className="adminSectionIntro">
        <div>
          <p className="adminEyebrow">Admin control</p>
          <h1 className="main-heading">Manage users</h1>
          <p className="adminSectionText">
            Review registered accounts, update their details, and manage admin access.
          </p>
        </div>

        <div className="adminUsersStats">
          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaUser />
            </span>
            <div>
              <strong>{users.length}</strong>
              <p>Total users</p>
            </div>
          </article>

          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaShieldAlt />
            </span>
            <div>
              <strong>{users.filter((item) => item.isAdmin).length}</strong>
              <p>Admin accounts</p>
            </div>
          </article>
        </div>
      </div>

      {editingUserId ? (
        <div className="registration-form adminEditForm">
          <div className="adminEditHeader">
            <div>
              <p className="adminEyebrow">Edit user</p>
              <h2>Update account details</h2>
            </div>
            <p className="adminEditMeta">
              Editing:{" "}
              <strong>
                {formData.username || user?.username || "Selected user"}
              </strong>
            </p>
          </div>

          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="username">username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="email">email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="phone">phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInput}
              />
            </div>

            <label className="adminToggle">
              <input
                name="isAdmin"
                type="checkbox"
                checked={formData.isAdmin}
                onChange={handleInput}
              />
              <span>Admin access</span>
            </label>

            <div className="adminActions">
              <button type="submit" className="btn">
                Update
              </button>
              <button type="button" className="btn secondary-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="adminTableWrap">
        {isLoading ? (
          <div className="adminStateCard">
            <h2>Loading users...</h2>
            <p>Fetching the latest user records from the admin API.</p>
          </div>
        ) : fetchError ? (
          <div className="adminStateCard adminStateCardError">
            <h2>Unable to load users</h2>
            <p>{fetchError}</p>
            <button type="button" className="btn" onClick={getUsersData}>
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="adminStateCard">
            <h2>No users found</h2>
            <p>The database did not return any user records yet.</p>
          </div>
        ) : (
          <>
            <div className="adminTableHeader">
              <div>
                <p className="adminEyebrow">User records</p>
                <h2>Registered members</h2>
              </div>
              <button type="button" className="btn secondary-btn" onClick={getUsersData}>
                Refresh
              </button>
            </div>

            <table className="adminTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="adminUserCell">
                        <span className="adminUserAvatar">
                          {(item.username || "U").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <strong>{item.username}</strong>
                          <p>{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="adminContactCell">
                        <strong>{item.phone || "Not provided"}</strong>
                        <p>{item._id}</p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`adminRoleBadge ${
                          item.isAdmin ? "adminRoleBadgeAdmin" : ""
                        }`}
                      >
                        {item.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <div className="adminActions">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaEdit />
                          <span>Update</span>
                        </button>
                        <button
                          type="button"
                          classNaalsome="btn secondary-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrashAlt />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
