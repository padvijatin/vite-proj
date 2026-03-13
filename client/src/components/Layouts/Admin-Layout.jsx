import { NavLink, Outlet } from "react-router-dom";
import {
  FaClipboardList,
  FaHome,
  FaRegAddressBook,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../store/auth";

const adminLinks = [
  { to: "/admin", label: "Home", icon: FaHome, end: true },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/services", label: "Services", icon: FaClipboardList },
  { to: "/admin/contacts", label: "Contacts", icon: FaRegAddressBook },
];

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <section className="container adminShell">
      <div className="adminContainer">
        <aside className="adminNavPanel">
          <div className="adminBrandCard">
            <p className="adminEyebrow">Admin Panel</p>
            <h2>Control center</h2>
            <p className="adminSectionText">
              Manage users, services, and contact activity from one place.
            </p>
          </div>

          <nav className="adminNav" aria-label="Admin navigation">
            <ul>
              {adminLinks.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end}>
                    <span className="adminNavLinkContent">
                      <Icon className="adminNavIcon" />
                      <span>{label}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="adminProfileCard">
            <p className="adminEyebrow">Signed in</p>
            <h3>{user?.username || "Admin user"}</h3>
            <p>{user?.email || "No email available"}</p>
          </div>
        </aside>

        <main className="adminMainPanel">
          <div className="adminTopBar">
            <div>
              <p className="adminEyebrow">Workspace</p>
              <h1>Administration</h1>
            </div>
            <div className="adminTopBarMeta">
              <span className="adminRoleBadge adminRoleBadgeAdmin">Admin access</span>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
