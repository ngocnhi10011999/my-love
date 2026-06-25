import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'secure-gallery:role';
const ADMIN = 'admin';
const GUEST = 'guest';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === ADMIN || saved === GUEST ? saved : null;
  });

  useEffect(() => {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  }, [role]);

  const login = (password) => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setRole(ADMIN);
      return ADMIN;
    }
    if (password === import.meta.env.VITE_GUEST_PASSWORD) {
      setRole(GUEST);
      return GUEST;
    }
    return null;
  };

  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
