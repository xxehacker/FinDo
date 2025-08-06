import React, { createContext, useState, useEffect } from "react";
import { API_ENDPOINTS } from "../utils/apiPath.js";
import AXIOS_INSTANCE from "../utils/axiosInstance.js";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        AXIOS_INSTANCE.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.AUTH.GET_PROFILE
        );
        if (response.status === 200) {
          if (!response.data?.data?.user) {
            throw new Error("User data not found in profile response");
          }
          setUser(response.data?.data?.user);
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          setUser(null);
        }
        console.error("User fetch error:", error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete AXIOS_INSTANCE.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;