
import React, { createContext, useState, useEffect, useContext } from 'react';
// IMPORTANT: User will need to run: npm install expo-secure-store
// import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'my-jwt';
const NEXTJS_SERVER_URL = 'http://10.0.2.2:3000'; // Replace with your server URL

interface AuthContextType {
  authState: {
    token: string | null;
    authenticated: boolean | null;
  };
  onLogin: (token: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authState: { token: null, authenticated: false },
  onLogin: async () => {},
  onLogout: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      // In a real app, you'd use SecureStore.
      // const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const token = null; // Mocking: assuming no token at start

      if (token) {
        setAuthState({
          token: token,
          authenticated: true,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
        });
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    // In a real app, you'd use SecureStore.
    // await SecureStore.setItemAsync(TOKEN_KEY, token);
    setAuthState({
      token: token,
      authenticated: true,
    });
  };

  const logout = async () => {
    // In a real app, you'd use SecureStore.
    // await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
