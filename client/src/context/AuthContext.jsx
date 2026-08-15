import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('receiptscanner_user');
    if (getToken() && stored) {
      setUser(JSON.parse(stored));
    }
    setReady(true);
  }, []);

  function persist(token, user) {
    setToken(token);
    localStorage.setItem('receiptscanner_user', JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
  }

  async function signup(name, email, password) {
    const data = await api.post('/auth/signup', { name, email, password });
    persist(data.token, data.user);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('receiptscanner_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
