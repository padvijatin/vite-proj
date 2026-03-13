import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiUrl } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState("");
  const [services, setServices] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    if (!serverToken) return;
    localStorage.setItem("token", serverToken);
    setIsAuthLoading(true);
    setToken(serverToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser("");
    setIsAuthLoading(false);
  };

  const isLoggedIn = Boolean(token);

  const userAuthentication = useCallback(async () => {
    if (!token) {
      setUser("");
      setIsAuthLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/auth/user"), {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        setUser("");
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAuthLoading(false);
    }
  }, [token]);

  const getServiceData = useCallback(async () => {
    try {
      const response = await fetch(apiUrl("/api/data/service"), {
        method: "GET",
      });

      if (response.ok) {
        const servicesData = await response.json();
        setServices(servicesData.data);
      }

      console.log("service", response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getServiceData();
    userAuthentication();
  }, [getServiceData, userAuthentication]);

  const value = useMemo(
    () => ({
      token,
      authorizationToken,
      user,
      services,
      isLoggedIn,
      isAuthLoading,
      storeTokenInLS,
      // Backward compatibility for existing calls
      storetokenInLS: storeTokenInLS,
      logoutUser,
      LogoutUser: logoutUser,
    }),
    [token, authorizationToken, user, services, isLoggedIn, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
