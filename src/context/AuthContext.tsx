import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  login: () => void;
  logout: () => void;
  setPhone: (phone: string) => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  phone: '',
  login: () => {},
  logout: () => {},
  setPhone: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setPhone('');
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, phone, login, logout, setPhone }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
