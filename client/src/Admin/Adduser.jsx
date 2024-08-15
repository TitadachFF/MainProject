import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Adduser = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(""); // เก็บ endpoint ที่จะใช้ยิง API

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
  });

  console.log("Form Data:", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    if (selectedRole === "TEACHER") {
      setApiEndpoint("http://localhost:3000/api/createTeacher");
    } else if (selectedRole === "INSTRUCTOR") {
      setApiEndpoint("http://localhost:3000/api/createCourseIn");
    }
  };

  const handleSubmit = async () => {
    const {
      firstname,
      lastname,
      username,
      password,
      confirmPassword,
      phone,
      email,
    } = formData;

    if (!firstname || !lastname || !username || !password || !confirmPassword) {
      setMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน !");
      setMessage2("*โปรดตรวจสอบข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน !");
      setMessage2("*โปรดตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    const submissionData = {
      firstname,
      lastname,
      username,
      password,
      phone: phone || null, // ถ้าไม่กรอกจะเป็น null
      email: email || null, // ถ้าไม่กรอกจะเป็น null
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
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
            <div>
              <label className="block text-gray-700">ชื่อ</label>
              <input
                type="text"
                name="firstname"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อ"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">นามสกุล</label>
              <input
                type="text"
                name="lastname"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="นามสกุล"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">ตำแหน่ง</label>
              <select
                onChange={handleRoleChange}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">เลือกตำแหน่ง</option>
                <option value="TEACHER">อาจารย์</option>
                <option value="INSTRUCTOR">ตัวแทนหลักสูตร</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">ชื่อผู้ใช้</label>
              <input
                id="input_username"
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
            <div>
              <label className="block text-gray-700">เบอร์โทร</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="เบอร์โทร"
              />
            </div>
            <div>
              <label className="block text-gray-700">อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="อีเมล"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red text-red rounded-full"
              onClick={() => navigate("/admin")}
            >
              ย้อนกลับ
            </button>
            <button
              id="btn_submit"
              type="button"
              className="px-8 py-2 bg-red border border-red text-white rounded-full"
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
