import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth.jsx";

export const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/">TicketHub</NavLink>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink to="/" end className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "active-link" : "")}>About</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? "active-link" : "")}>Contact</NavLink>
              </li>
              <li>
                <NavLink to="/service" className={({ isActive }) => (isActive ? "active-link" : "")}>Service</NavLink>
              </li>

              {isLoggedIn ? (
                <li>
                  <NavLink to="/logout" className={({ isActive }) => (isActive ? "active-link" : "")}>Logout</NavLink>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/register" className={({ isActive }) => (isActive ? "active-link" : "")}>Register</NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>Login</NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};