import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContextValue';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from '../services/authApi';

const AUTH_STORAGE_KEY = 'cryptoplace-auth-token';

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(Boolean(token));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await fetchCurrentUser(token);
        setUser(response.user);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken('');
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [token]);

  const persistSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const signup = async (payload) => {
    setIsSubmitting(true);

    try {
      const response = await signupUser(payload);
      persistSession(response);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async (payload) => {
    setIsSubmitting(true);

    try {
      const response = await loginUser(payload);
      persistSession(response);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    const currentToken = token;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken('');
    setUser(null);

    if (currentToken) {
      try {
        await logoutUser(currentToken);
      } catch {
        // Ignore logout network failures because the client token is already removed.
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(user),
        isInitializing,
        isSubmitting,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
