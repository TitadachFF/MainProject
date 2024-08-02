import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken"); // ใช้คีย์ "authToken"
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
          const userData = decodeResponse.data.decoded; // เข้าถึงข้อมูล decoded
          console.log("Fetched user data:", userData); // ล็อกข้อมูลที่ดึงมา
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // ทำการลบ token ถ้าไม่สามารถดึงข้อมูลได้
          localStorage.removeItem("authToken");
          setUser(null);
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

      const { token, userData } = loginResponse.data;
      localStorage.setItem("authToken", token); // ใช้คีย์ "authToken" ให้สอดคล้อง
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);

      return { success: true, token, userData };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // ใช้คีย์ "authToken" ให้สอดคล้อง
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
