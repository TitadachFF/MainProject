import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminInfo = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");
    if (token && storedUserData) {
      setIsLoggedIn(true);
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setAdminName(parsedUserData.decoded.name); // ตั้งค่าเริ่มต้นสำหรับ adminName
      setUsername(parsedUserData.decoded.username); // ตั้งค่าเริ่มต้นสำหรับ username
    }
  }, []);

  const handleUpdate = async () => {
    // กรณีกรอกข้อมูลไม่ครบ
    if (!adminName || !username || !password || !confirmPassword) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน !");
      setMessage2("*โปรดตรวจสอบข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
      return;
    }

    if (password !== confirmPassword) {
      // กรณีรหัสผ่านไม่ตรงกัน
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน !");
      setMessage2("*โปรดตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const updatedUserData = { name: adminName, username, password };

      const response = await axios.put(
        `http://localhost:3000/api/updateUser/${userData.decoded.id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setShowModal(true);

      setUserData({
        ...userData,
        decoded: {
          ...userData.decoded,
          name: adminName,
        },
      });

      setTimeout(() => {
        setShowModal(false);
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error.message);
            // กรณีผู้ใช้ซ้ำกับผู้ใช้อื่น
      setMessage("ชื่อผู้ใช้อาจจะซ้ำกับผู้ใช้อื่น !");
      setMessage("*โปรดตรวจสอบชื่อผู้ใช้");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <a className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </a>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/admin")}>
          เมนูแอดมิน
        </p>
        <span className="mx-1">&gt;</span>
        <p>ข้อมูลส่วนตัว</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ข้อมูลส่วนตัว
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">ชื่อแอดมิน</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">ตำแหน่ง</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-gray-500 cursor-not-allowed"
                  value="แอดมิน"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border rounded-full"
                onClick={() => navigate("/admin")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red border text-white rounded-full"
                onClick={handleUpdate}
              >
                บันทึก
              </button>
            </div>
          </form>
          {/* Modal Component */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg modal-box">
                <h3 className="font-bold text-red text-xl pb-4">{message}</h3>
                <p className="text-lg py-4 text-gray-500">{message2}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
