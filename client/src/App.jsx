import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Service } from './pages/Service';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Logout } from './pages/Logout';
import { Error } from './pages/Error';
import { Navbar } from './components/Navbar'; 
import { Footer } from './components/Footer';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from './components/Layouts/Admin-Layout';
import AdminRoute from './components/AdminRoute';
import AdminHome from './pages/Admin-Home';
import AdminUsers from './pages/Admin-users';
import AdminServices from './pages/Admin-Services';
import AdminContacts from './pages/Admin-Contacts';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        limit={3}
        pauseOnFocusLoss={false}
        toastClassName="app-toast"
        bodyClassName="app-toast-body"
        progressClassName="app-toast-progress"
      />
    </Router>
  );
}
export default App;
