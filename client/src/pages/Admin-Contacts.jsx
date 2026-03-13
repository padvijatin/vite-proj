import { useEffect, useRef, useState } from "react";
import { FaEdit, FaInbox, FaReply, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../store/auth";
import { apiUrl } from "../utils/api";
import {
  showErrorToast,
  showLoadingToast,
  updateToastError,
  updateToastSuccess,
} from "../utils/toast";

const AdminContacts = () => {
  const { authorizationToken } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [editingContactId, setEditingContactId] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const editFormRef = useRef(null);

  const getAllContactsData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const response = await fetch(apiUrl("/api/admin/contacts"), {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setContacts(data.contacts || []);
      } else {
        const message = data.message || "Unable to fetch contacts";
        setContacts([]);
        setFetchError(message);
        showErrorToast(message, "admin-contacts-fetch");
      }
    } catch (error) {
      console.log(error);
      setContacts([]);
      setFetchError("Unable to fetch contacts");
      showErrorToast("Unable to fetch contacts", "admin-contacts-request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authorizationToken || authorizationToken === "Bearer ") return;
    getAllContactsData();
  }, [authorizationToken]);

  useEffect(() => {
    if (editingContactId && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingContactId]);

  const handleEditClick = (contact) => {
    setEditingContactId(contact._id);
    setFormData({
      username: contact.username || "",
      email: contact.email || "",
      message: contact.message || "",
    });
  };

  const handleCancel = () => {
    setEditingContactId("");
    setFormData({
      username: "",
      email: "",
      message: "",
    });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingContactId) return;

    const toastId = "admin-contact-update";

    try {
      showLoadingToast("Updating contact...", toastId);
      const response = await fetch(
        apiUrl(`/api/admin/contacts/${editingContactId}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "Contact updated successfully");
        setContacts((prev) =>
          prev.map((item) => (item._id === editingContactId ? data.contact : item))
        );
        handleCancel();
      } else {
        updateToastError(toastId, data.message || "Unable to update contact");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to update contact");
    }
  };

  const handleDelete = async (id) => {
    const toastId = `admin-contact-delete-${id}`;

    try {
      showLoadingToast("Deleting contact...", toastId);
      const response = await fetch(apiUrl(`/api/admin/contacts/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "Contact deleted successfully");
        setContacts((prev) => prev.filter((item) => item._id !== id));
        if (editingContactId === id) {
          handleCancel();
        }
      } else {
        updateToastError(toastId, data.message || "Unable to delete contact");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to delete contact");
    }
  };

  return (
    <section className="adminPageStack">
      <div className="adminSectionIntro">
        <div>
          <p className="adminEyebrow">Contacts</p>
          <h1 className="main-heading">Manage contacts</h1>
          <p className="adminSectionText">
            Review incoming messages, monitor sender details, and keep the support
            queue visible in one place.
          </p>
        </div>

        <div className="adminUsersStats">
          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaInbox />
            </span>
            <div>
              <strong>{contacts.length}</strong>
              <p>Total messages</p>
            </div>
          </article>

          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaReply />
            </span>
            <div>
              <strong>{contacts.filter((item) => item.message?.trim()).length}</strong>
              <p>Ready to review</p>
            </div>
          </article>
        </div>
      </div>

      {editingContactId ? (
        <div className="registration-form adminEditForm" ref={editFormRef}>
          <div className="adminEditHeader">
            <div>
              <p className="adminEyebrow">Edit contact</p>
              <h2>Update message details</h2>
            </div>
            <p className="adminEditMeta">
              Editing: <strong>{formData.username || "Selected contact"}</strong>
            </p>
          </div>

          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="contact-username">username</label>
              <input
                id="contact-username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="contact-email">email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="contact-message">message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleInput}
              ></textarea>
            </div>

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
            <h2>Loading contacts...</h2>
            <p>Fetching the latest contact submissions from the admin API.</p>
          </div>
        ) : fetchError ? (
          <div className="adminStateCard adminStateCardError">
            <h2>Unable to load contacts</h2>
            <p>{fetchError}</p>
            <button type="button" className="btn" onClick={getAllContactsData}>
              Retry
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="adminStateCard">
            <h2>No contacts found</h2>
            <p>No contact submissions are available in the database yet.</p>
          </div>
        ) : (
          <>
            <div className="adminTableHeader">
              <div>
                <p className="adminEyebrow">Contact records</p>
                <h2>Inbox messages</h2>
              </div>
              <button type="button" className="btn secondary-btn" onClick={getAllContactsData}>
                Refresh
              </button>
            </div>

            <table className="adminTable">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((item) => (
                  <tr
                    key={item._id}
                    className={editingContactId === item._id ? "adminTableRowActive" : ""}
                  >
                    <td>
                      <div className="adminUserCell">
                        <span className="adminUserAvatar">
                          {(item.username || "U").charAt(0).toUpperCase()}
                        </span>
                        <strong>{item.username}</strong>
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>
                      <p className="adminMessagePreview">
                        {item.message || "No message provided"}
                      </p>
                    </td>
                    <td>
                      <div className="adminActions">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn secondary-btn"
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
export default AdminContacts;
