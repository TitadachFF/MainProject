import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    studentIdcard: "",
    year: "",
    room: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

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

    // Convert 'year,room,studentIdcard' to integer
    const year = parseInt(formData.year);
    const room = parseInt(formData.room);
    const studentIdcard = parseInt(formData.studentIdcard);

    try {
      const response = await fetch("http://localhost:3000/api/createStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          studentIdcard,
          year,
          room,
        }),
      });

      if (response.ok) {
        alert("เพิ่มนักศึกษาเรียบร้อยแล้ว");
        navigate("/advice");
      } else {
        const errorData = await response.json();
        console.log("Response data:", errorData);
        alert(
          `มีข้อผิดพลาดในการเพิ่มนักศึกษา: ${
            errorData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("มีข้อผิดพลาดในการเพิ่มนักศึกษา");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มนักศึกษา</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เพิ่มนักศึกษา
          </h2>
          <form>
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
                <label className="block text-gray-700">รหัสนักศึกษา</label>
                <input
                  type="text"
                  name="studentIdcard"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="รหัสนักศึกษา"
                  value={formData.studentIdcard}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <div className="mr-4">
                  <label className="block text-gray-700">ปีการศึกษา</label>
                  <input
                    type="text"
                    name="year"
                    className="w-20 mt-1 border border-gray-300 rounded p-2"
                    placeholder="XX/XX"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">หมู่เรียน</label>
                  <input
                    type="text"
                    name="room"
                    className="w-20 mt-1 border border-gray-300 rounded p-2"
                    placeholder="XX/XX"
                    value={formData.room}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  name="username"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  name="password"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="รหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                onClick={() => navigate("/advice")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red text-white rounded"
                onClick={handleSubmit}
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
