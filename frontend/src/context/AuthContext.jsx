import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user.api";
import { loginUser, logoutUser, registerUser } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        setUser(res.user || res.data); // depending on backend structure
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data) => {
    const res = await loginUser(data); // axios response
    const { token, user } = res.data; // ✅ correct extraction

    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (data) => {
    const res = await registerUser(data); // axios response
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    setUser(user);
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
