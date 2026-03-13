import { useEffect, useRef, useState } from "react";
import { FaClipboardCheck, FaEdit, FaLayerGroup, FaTrashAlt, FaWrench } from "react-icons/fa";
import { useAuth } from "../store/auth";
import { apiUrl } from "../utils/api";
import {
  showErrorToast,
  showLoadingToast,
  updateToastError,
  updateToastSuccess,
} from "../utils/toast";

const AdminServices = () => {
  const { authorizationToken } = useAuth();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [editingServiceId, setEditingServiceId] = useState("");
  const [formData, setFormData] = useState({
    service: "",
    provider: "",
    price: "",
    description: "",
  });
  const editFormRef = useRef(null);

  const getAllServicesData = async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const response = await fetch(apiUrl("/api/admin/services"), {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setServices(data.services || []);
      } else {
        const message = data.message || "Unable to fetch services";
        setServices([]);
        setFetchError(message);
        showErrorToast(message, "admin-services-fetch");
      }
    } catch (error) {
      console.log(error);
      setServices([]);
      setFetchError("Unable to fetch services");
      showErrorToast("Unable to fetch services", "admin-services-request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authorizationToken || authorizationToken === "Bearer ") return;
    getAllServicesData();
  }, [authorizationToken]);

  useEffect(() => {
    if (editingServiceId && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingServiceId]);

  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setFormData({
      service: service.service || "",
      provider: service.provider || "",
      price: service.price || "",
      description: service.description || "",
    });
  };

  const handleCancel = () => {
    setEditingServiceId("");
    setFormData({
      service: "",
      provider: "",
      price: "",
      description: "",
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
    if (!editingServiceId) return;

    const toastId = "admin-service-update";

    try {
      showLoadingToast("Updating service...", toastId);
      const response = await fetch(
        apiUrl(`/api/admin/services/${editingServiceId}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            service: formData.service.trim(),
            provider: formData.provider.trim(),
            price: formData.price.trim(),
            description: formData.description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "Service updated successfully");
        setServices((prev) =>
          prev.map((item) => (item._id === editingServiceId ? data.service : item))
        );
        handleCancel();
      } else {
        updateToastError(toastId, data.message || "Unable to update service");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to update service");
    }
  };

  const handleDelete = async (id) => {
    const toastId = `admin-service-delete-${id}`;

    try {
      showLoadingToast("Deleting service...", toastId);
      const response = await fetch(apiUrl(`/api/admin/services/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, data.message || "Service deleted successfully");
        setServices((prev) => prev.filter((item) => item._id !== id));
        if (editingServiceId === id) {
          handleCancel();
        }
      } else {
        updateToastError(toastId, data.message || "Unable to delete service");
      }
    } catch (error) {
      console.log(error);
      updateToastError(toastId, "Unable to delete service");
    }
  };

  return (
    <section className="adminPageStack">
      <div className="adminSectionIntro">
        <div>
          <p className="adminEyebrow">Services</p>
          <h1 className="main-heading">Manage services</h1>
          <p className="adminSectionText">
            Review service catalog data, pricing, and provider information from the
            protected admin area.
          </p>
        </div>

        <div className="adminUsersStats">
          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaLayerGroup />
            </span>
            <div>
              <strong>{services.length}</strong>
              <p>Total services</p>
            </div>
          </article>

          <article className="adminStatCard">
            <span className="adminStatIcon">
              <FaClipboardCheck />
            </span>
            <div>
              <strong>{services.filter((item) => item.provider?.trim()).length}</strong>
              <p>With provider info</p>
            </div>
          </article>
        </div>
      </div>

      {editingServiceId ? (
        <div className="registration-form adminEditForm" ref={editFormRef}>
          <div className="adminEditHeader">
            <div>
              <p className="adminEyebrow">Edit service</p>
              <h2>Update service details</h2>
            </div>
            <p className="adminEditMeta">
              Editing: <strong>{formData.service || "Selected service"}</strong>
            </p>
          </div>

          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="service-name">service</label>
              <input
                id="service-name"
                name="service"
                type="text"
                value={formData.service}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="service-provider">provider</label>
              <input
                id="service-provider"
                name="provider"
                type="text"
                value={formData.provider}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="service-price">price</label>
              <input
                id="service-price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="service-description">description</label>
              <textarea
                id="service-description"
                name="description"
                rows="5"
                value={formData.description}
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
            <h2>Loading services...</h2>
            <p>Fetching the latest service records from the admin API.</p>
          </div>
        ) : fetchError ? (
          <div className="adminStateCard adminStateCardError">
            <h2>Unable to load services</h2>
            <p>{fetchError}</p>
            <button type="button" className="btn" onClick={getAllServicesData}>
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="adminStateCard">
            <h2>No services found</h2>
            <p>The service collection is empty right now.</p>
          </div>
        ) : (
          <>
            <div className="adminTableHeader">
              <div>
                <p className="adminEyebrow">Service records</p>
                <h2>Active catalog</h2>
              </div>
              <button type="button" className="btn secondary-btn" onClick={getAllServicesData}>
                Refresh
              </button>
            </div>

            <table className="adminTable">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr
                    key={item._id}
                    className={editingServiceId === item._id ? "adminTableRowActive" : ""}
                  >
                    <td>
                      <div className="adminServiceCell">
                        <span className="adminStatIcon adminMiniIcon">
                          <FaWrench />
                        </span>
                        <strong>{item.service}</strong>
                      </div>
                    </td>
                    <td>{item.provider}</td>
                    <td>{item.price}</td>
                    <td>
                      <p className="adminMessagePreview">
                        {item.description || "No description provided"}
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

export default AdminServices;
