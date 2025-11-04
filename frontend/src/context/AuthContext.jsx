import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =====================================================
// CREATE CONTEXT
// =====================================================
const AuthContext = createContext();

// =====================================================
// HELPER: NORMALIZE USER TO ALWAYS HAVE _id
// =====================================================
const normalizeUser = (data) => {
  if (!data) return null;
  return { ...data, _id: data._id || data.id };
};

// =====================================================
// AUTH PROVIDER
// =====================================================
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // --- Initialize user from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizeUser(parsed);
      }
      return null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);

  // =====================================================
  // HYDRATE USER FROM LOCALSTORAGE ON FIRST LOAD
  // =====================================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(normalizeUser(parsed));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error restoring user:", err);
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // KEEP LOCALSTORAGE IN SYNC
  // =====================================================
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    }
  }, [user]);

  // =====================================================
  // LOGIN FUNCTION — with ROLE-BASED REDIRECT
  // =====================================================
  const login = (userData, token) => {
    try {
      const normalized = normalizeUser(userData);
      setUser(normalized);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(normalized));
      if (token) localStorage.setItem("token", token);

      if (normalized.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (normalized.role === "owner" || normalized.role === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // =====================================================
  // LOGOUT FUNCTION
  // =====================================================
  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =====================================================
  // WAIT FOR LOCALSTORAGE TO LOAD
  // =====================================================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading authentication...
      </div>
    );
  }

  // =====================================================
  // PROVIDER VALUE
  // =====================================================
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================
export const useAuth = () => useContext(AuthContext);
