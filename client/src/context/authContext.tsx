import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../services/apiServices";

// Define the shape of the context state
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create the Provider component
// React component that wraps all children components and provides them with auth state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // This effect runs whenever the token changes
  useEffect(() => {
    if (token) {
      // Store the token in local storage for login
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // If token is null, remove it from storage and headers
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };
  // This is the value that will be provided to consuming components
  const authContextValue = {
    token,
    isAuthenticated: !!token, // Convert token string to boolean
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
