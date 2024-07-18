import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdviceInfo = () => {
  const navigate = useNavigate();
  const [advisorname, setAdvisorname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
      setAdvisorname(JSON.parse(storedUserData)?.decoded?.name || "");
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUserData = { name: advisorname, username, password };

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
          name: advisorname,
        },
      });

      setTimeout(() => {
        setShowModal(false);
        navigate("/advice");
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error.message);
      setMessage("Error updating user");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>ข้อมูลส่วนตัว</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ข้อมูลส่วนตัว
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={advisorname}
                  onChange={(e) => setAdvisorname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">ตำแหน่ง</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-gray-500 cursor-not-allowed"
                  value="อาจารย์ที่ปรึกษา"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  placeholder="ชื่อผู้ใช้"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-black"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={handleUpdate}
              >
                บันทึก
              </button>
            </div>
          </form>

          {/* Modal Component */}
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
              <div className="bg-white rounded-lg p-8 z-50">
                <p className="text-lg text-red">อัปเดทข้อมูลส่วนตัวสำเร็จ</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviceInfo;
