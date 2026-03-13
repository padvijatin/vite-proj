import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

const AdminRoute = () => {
  const { isLoggedIn, isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return (
      <section className="container routeLoaderSection">
        <div className="routeLoaderCard">
          <p className="adminEyebrow">Checking access</p>
          <h1>Loading admin workspace...</h1>
          <p>Please wait while your account permissions are verified.</p>
        </div>
      </section>
    );
  }

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
