import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Adduser = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    T_firstname: "",
    T_lastname: "",
    T_username: "",
    T_password: "",
    confirmPassword: "",
    T_phone: "",
    T_email: "",
  });

  console.log("Form Data:", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.T_firstname ||
      !formData.T_lastname ||
      !formData.T_username ||
      !formData.T_password ||
      !formData.confirmPassword
    ) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน !");
      setMessage2("*โปรดตรวจสอบข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    if (formData.T_password !== formData.confirmPassword) {
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน !");
      setMessage2("*โปรดตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/createTeacher", {
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
          navigate("/admin");
        }, 1000);
      } else {
        const errorData = await response.json();
        console.log("Response data:", errorData);
        setMessage("มีข้อผิดพลาดในการเพิ่มผู้ใช้ !");
        setMessage2(`*${errorData.message || "Unknown error"}`);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("มีข้อผิดพลาดในการเพิ่มผู้ใช้ !");
      setMessage2("*มีคนใช้ชื่อผู้ใช้นี้แล้ว");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/admin")}>
          เมนูแอดมิน
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มผู้ใช้</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6">เพิ่มผู้ใช้</h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex gap-6">
              <div className="w-1/2">
                <label className="block text-gray-700">ชื่อ</label>
                <input
                  type="text"
                  name="T_firstname"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อ"
                  value={formData.T_firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">นามสกุล</label>
                <input
                  type="text"
                  name="T_lastname"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="นามสกุล"
                  value={formData.T_lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">เบอร์โทรศัพท์</label>
              <input
                type="text"
                name="T_phone"
                value={formData.T_phone}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="เบอร์โทรศัพท์ (ไม่จำเป็นต้องกรอก)"
              />
            </div>
            <div>
              <label className="block text-gray-700">อีเมล</label>
              <input
                type="email"
                name="T_email"
                value={formData.T_email}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="อีเมล (ไม่จำเป็นต้องกรอก)"
              />
            </div>
            <div>
              <label className="block text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="T_username"
                value={formData.T_username}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อผู้ใช้"
              />
            </div>

            <div>
              <label className="block text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                name="T_password"
                value={formData.T_password}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="รหัสผ่าน"
              />
            </div>
            <div>
              <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ยืนยันรหัสผ่าน"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red0 text-red rounded"
              onClick={() => navigate("/admin")}
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              className="px-8 py-2 bg-red border border-red text-white rounded"
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg modal-box">
            <h3 className="font-bold text-red text-xl pb-4">{message}</h3>
            <p className="text-lg py-4 text-gray-500">{message2}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
