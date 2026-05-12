import { createContext, useContext, useState} from 'react';

import type { ReactNode } from 'react';
import { authApi } from '../api/apiclient';

interface AuthContextValue {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Comprobamos si ya hay un token guardado al cargar la app
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  async function login(username: string, password: string) {
    const { token } = await authApi.login(username, password);
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}