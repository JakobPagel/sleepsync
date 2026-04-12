import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      authService.getMe()
        .then(setUser)
        .catch(() => { authService.logout(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    await authService.login(username, password);
    const me = await authService.getMe();
    setUser(me);
  };

  const register = async (username, email, password, password2) => {
    const me = await authService.register(username, email, password, password2);
    setUser(me);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}