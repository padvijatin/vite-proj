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

const URL = apiUrl("/api/auth/login");

const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

const getValidationMessage = (errors) => Object.values(errors).join(" | ");

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const errors = useMemo(() => validateLoginForm(user), [user]);
  const isValid = Object.keys(errors).length === 0;

  // let handle the input field value
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

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      email: true,
      password: true,
    });

    if (!isValid) {
      showErrorToast(
        getValidationMessage(errors) || "Please fix the highlighted fields.",
        "login-validation"
      );
      return;
    }

    const payload = {
      email: user.email.trim(),
      password: user.password,
    };
    const toastId = "login-submit";

    try {
      setIsSubmitting(true);
      showLoadingToast("Logging in...", toastId);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res_data = await response.json();
      console.log("Login form response:", res_data);
      if (response.ok) {
        updateToastSuccess(toastId, res_data.message || "Login successful");
        storeTokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        setTouched({ email: false, password: false });
        navigate("/");
      } else {
        const errorMessage =
          res_data.message ||
          (Array.isArray(res_data.details) && res_data.details.join(", ")) ||
          "Login failed. Please check your credentials and try again.";
        updateToastError(toastId, errorMessage);
      }
    } catch (error) {
      console.error("Login failed:", error);
      updateToastError(toastId, "Login failed. Please try again.");
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
                <h1 className="main-heading mb-3">Login form</h1>
                <form onSubmit={handleSubmit} noValidate>
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
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      placeholder="password"
                      autoComplete="current-password"
                      aria-invalid={Boolean(touched.password && errors.password)}
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
                        Logging in...
                      </span>
                    ) : (
                      "Login Now"
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
