import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { apiUrl } from "../utils/api";
import {
  showLoadingToast,
  updateToastError,
  updateToastSuccess,
} from "../utils/toast";

const URL = apiUrl("/api/form/contact");

export const Contact = () => {
  const { user } = useAuth();
  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    setContact((prev) => ({
      ...prev,
      username: user.username || "",
      email: user.email || "",
    }));
  }, [user]);

  // lets tackle our handleInput
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContact({
      ...contact,
      [name]: value,
    });
  };

  // handle fomr getFormSubmissionInfo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = {
      username: contact.username.trim(),
      email: contact.email.trim(),
      message: contact.message.trim(),
    };
    const toastId = "contact-submit";

    try {
      setIsSubmitting(true);
      showLoadingToast("Sending message...", toastId);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok) {
        updateToastSuccess(toastId, resData.message || "Message sent successfully");
        setContact((prev) => ({
          ...prev,
          message: "",
        }));
      } else {
        const errorMessage =
          resData.message ||
          (Array.isArray(resData.details) && resData.details.join(", ")) ||
          "Unable to send message";
        updateToastError(toastId, errorMessage);
      }
    } catch (error) {
      console.error("Contact form submit failed:", error);
      updateToastError(
        toastId,
        "Unable to connect to server. Please check backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <section className="section-contact">
        <div className="contact-content container">
          <h1 className="main-heading">contact us</h1>
        </div>
        {/* contact page main  */}
        <div className="container grid grid-two-cols">
          <div className="contact-img">
            <img src="/images/support.png" alt="we are always ready to help" />
          </div>

          {/* contact form content actual  */}
          <section className="section-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  value={contact.username}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  value={contact.email}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label htmlFor="message">message</label>
                <textarea
                  name="message"
                  id="message"
                  autoComplete="off"
                  value={contact.message}
                  onChange={handleInput}
                  required
                  cols="30"
                  rows="6"
                ></textarea>
              </div>

              <div>
                <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="btn-loader-wrap">
                      <span className="btn-loader" aria-hidden="true"></span>
                      Sending...
                    </span>
                  ) : (
                    "submit"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="mb-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2613173278896!2d73.91411937501422!3d18.562253982539413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1697604225432!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </section>
    </>
  );
};
