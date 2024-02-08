// This file defines a custom React hook that encapsulates all the authentication logic.
import { useState, useEffect } from "react";

const useAuth = () => {
  // State for tracking whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for storing any login error messages
  const [loginError, setLoginError] = useState("");

  // Effect to check if a token exists in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle the login process
  const handleLogin = async (email, password) => {
    console.log("Logging before stringify:", email, password);

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Log relevant information from the response
      console.log("Logging after fetch:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  // Function to handle the logout process
  const handleLogout = () => {
    console.log("Hey you are being heard from handleLogout");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, loginError, handleLogin, handleLogout };
};

export default useAuth;
