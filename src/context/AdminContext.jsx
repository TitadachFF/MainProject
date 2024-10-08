import React, { createContext, useState } from "react";
import axios from "axios";

const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUnSuccessModal, setShowUnSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const adduser = async () => {
    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน !");
      setMessage2("*โปรดตรวจสอบข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน !");
      setMessage2("*โปรดตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน");
      setShowUnSuccessModal(true);
      setTimeout(() => {
        setShowUnSuccessModal(false);
      }, 2000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/createUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("เพิ่มผู้ใช้สำเร็จ");
        setMessage2("*เพิ่มผู้ใช้เข้าสู่ระบบสำเร็จ");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      } else {
        const errorData = await response.json();
        console.log("Response data:", errorData);
        setMessage("โปรดเลือกตำแหน่ง");
        setMessage2("*โปรดตรวจสอบว่าเลือกตำแหน่งแล้ว");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("มีข้อผิดพลาดในการเพิ่มผู้ใช้ !");
      setMessage2("*มีคนใช้ชื่อผู้ใช้นี้แล้ว");
      setShowUnSuccessModal(true);
      setTimeout(() => {
        setShowUnSuccessModal(false);
      }, 2000);
    }
  };

  const authInfo = {
    formData,
    handleChange,
    adduser,
    message,
    message2,
    showModal,
    showUnSuccessModal,
  };

  return (
    <AdminContext.Provider value={authInfo}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminContextProvider };
