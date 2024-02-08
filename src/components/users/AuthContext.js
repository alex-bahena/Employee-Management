// This file creates and exports a React context for authentication, along with a provider component.
import React, { createContext, useContext } from "react";
import useAuth from "./useAuth";

// Use the same name for context and hook
const AuthContext = createContext();

// Component that provides the authentication context to its children
export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Using the custom hook

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);
