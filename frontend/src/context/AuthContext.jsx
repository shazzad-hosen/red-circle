import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user.api";
import { loginUser, logoutUser, registerUser } from "../api/auth.api";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start (uses refresh token silently)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Attach access token to axios
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Login
  const login = async (data) => {
    const res = await loginUser(data);

    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  // Register
  const register = async (data) => {
    const res = await registerUser(data);

    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
