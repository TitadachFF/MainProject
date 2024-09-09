import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodeResponse = await axios.get(
            "http://localhost:3000/api/decode-token",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = decodeResponse.data;
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const login = async (username, password) => {
    try {
      const loginResponse = await axios.post(
        "http://localhost:3000/api/login",
        {
          username,
          password,
        }
      );

      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      const decodeResponse = await axios.get(
        "http://localhost:3000/api/decode-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = decodeResponse.data;
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);

      return { success: true, userData };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to delete user:", error);
      return { success: false, error: error.message };
    }
  };

  const authInfo = {
    user,
    setUser,
    login,
    logout,
    deleteUser, // เพิ่มฟังก์ชัน deleteUser ที่นี่
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
