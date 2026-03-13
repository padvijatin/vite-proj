import { NavLink } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>TicketHub</h3>
          <p>Smart IT solutions for modern businesses.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/service">Service</NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Email: support@tickethub.com</p>
          <p>Phone: +91 90000 00000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright {year} TicketHub. All rights reserved.</p>
      </div>
    </footer>
  );
};
