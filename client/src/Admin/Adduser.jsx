import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Adduser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("เพิ่มผู้ใช้เรียบร้อยแล้ว");
        navigate("/admin");
      } else {
        const errorData = await response.json();
        console.log("Response data:", errorData);
        alert(
          `มีข้อผิดพลาดในการเพิ่มผู้ใช้: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("มีข้อผิดพลาดในการเพิ่มผู้ใช้");
    }
  };

  return (
    <div className=" bg-gray-100">
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
      <div className=" min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full  rounded-lg shadow-lg p-6 ">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เพิ่มผู้ใช้
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700">ชื่อ-นามสกุล</label>
              <input
                type="text"
                name="name"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อ-นามสกุล"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">ตำแหน่ง</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full max-w-xs"
              >
                <option>เลือกตำแหน่ง</option>

                <option value="ADVISOR">อาจารย์ที่ปรึกษา</option>
                <option value="COURSE_INSTRUCTOR">ตัวแทนหลักสูตร</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อผู้ใช้"
              />
            </div>
            <div>
              <label className="block text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                value={formData.password}
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
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/admin")}
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              className="px-8 py-2 bg-red  border border-red-600 text-white rounded"
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adduser;
