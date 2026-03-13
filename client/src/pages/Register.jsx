import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { apiUrl } from "../utils/api";
import {
  showErrorToast,
  showLoadingToast,
  updateToastError,
  updateToastSuccess,
} from "../utils/toast";

const URL = apiUrl("/api/auth/register");

const validateRegisterForm = ({ username, email, phone, password }) => {
  const errors = {};

  if (!username.trim()) {
    errors.username = "Username is required.";
  } else if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(phone.trim())) {
    errors.phone = "Phone number must be 10 digits.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

const getValidationMessage = (errors) => Object.values(errors).join(" | ");

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    phone: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const errors = useMemo(() => validateRegisterForm(user), [user]);
  const isValid = Object.keys(errors).length === 0;

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      username: true,
      email: true,
      phone: true,
      password: true,
    });

    if (!isValid) {
      showErrorToast(
        getValidationMessage(errors) || "Please fix the highlighted fields.",
        "register-validation"
      );
      return;
    }

    const payload = {
      username: user.username.trim(),
      email: user.email.trim(),
      phone: user.phone.trim(),
      password: user.password,
    };
    const toastId = "register-submit";

    try {
      setIsSubmitting(true);
      showLoadingToast("Creating your account...", toastId);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res_data = await response.json();
      console.log("Register form response:", res_data);

      if (response.ok) {
        updateToastSuccess(toastId, res_data.message || "Registration successful");
        storeTokenInLS(res_data.token);
        setUser({ username: "", email: "", phone: "", password: "" });
        setTouched({
          username: false,
          email: false,
          phone: false,
          password: false,
        });
        navigate("/login");
      } else {
        const errorMessage =
          res_data.message ||
          (Array.isArray(res_data.details) && res_data.details.join(", ")) ||
          "Registration failed";
        updateToastError(toastId, errorMessage);
      }
    } catch (error) {
      console.error("Register request failed:", error);
      updateToastError(
        toastId,
        "Unable to connect to server. Please check backend is running on port 5000."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/images/register.png"
                  alt="a nurse with a cute look"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Registration Form</h1>
                <form onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      placeholder="username"
                      autoComplete="name"
                      aria-invalid={Boolean(
                        touched.username && errors.username
                      )}
                      aria-describedby="username-error"
                      required
                    />
                    {touched.username && errors.username ? (
                      <p className="form-error" id="username-error">
                        {errors.username}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      placeholder="email"
                      autoComplete="email"
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby="email-error"
                      required
                    />
                    {touched.email && errors.email ? (
                      <p className="form-error" id="email-error">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="phone">phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      placeholder="phone number"
                      autoComplete="tel"
                      inputMode="numeric"
                      aria-invalid={Boolean(touched.phone && errors.phone)}
                      aria-describedby="phone-error"
                      required
                    />
                    {touched.phone && errors.phone ? (
                      <p className="form-error" id="phone-error">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      placeholder="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(
                        touched.password && errors.password
                      )}
                      aria-describedby="password-error"
                      required
                    />
                    {touched.password && errors.password ? (
                      <p className="form-error" id="password-error">
                        {errors.password}
                      </p>
                    ) : null}
                  </div>
                  <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="btn-loader-wrap">
                        <span className="btn-loader" aria-hidden="true"></span>
                        Creating Account...
                      </span>
                    ) : (
                      "Register Now"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
