import { FaClipboardList, FaRegAddressBook, FaUsers } from "react-icons/fa";
import { useAuth } from "../store/auth";

const quickStats = [
  {
    title: "Users",
    description: "Review accounts, permissions, and update records.",
    icon: FaUsers,
  },
  {
    title: "Services",
    description: "Track service listings and keep offerings current.",
    icon: FaClipboardList,
  },
  {
    title: "Contacts",
    description: "Follow incoming messages and support activity.",
    icon: FaRegAddressBook,
  },
];

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <section className="adminPageStack">
      <div className="adminSectionIntro">
        <div>
          <p className="adminEyebrow">Overview</p>
          <h1 className="main-heading">Welcome back{user?.username ? `, ${user.username}` : ""}</h1>
          <p className="adminSectionText">
            Use the admin workspace to monitor core website data and keep account
            information accurate.
          </p>
        </div>
      </div>

      <div className="adminGridCards">
        {quickStats.map(({ title, description, icon: Icon }) => (
          <article className="adminInfoCard" key={title}>
            <span className="adminStatIcon">
              <Icon />
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="adminInfoCard adminInfoCardWide">
        <p className="adminEyebrow">Focus</p>
        <h2>Use this panel as your working admin area</h2>
        <p>
          The navigation on the left keeps the structure simple. Users, services,
          and contacts stay inside the same layout so management feels consistent.
        </p>
      </div>
    </section>
  );
};

export default AdminHome;
