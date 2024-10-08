import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseInfo = () => {
  const navigate = useNavigate();
  const [coursename, setCoursename] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");

        if (token && storedUserData) {
          setIsLoggedIn(true);
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          const courseinstructorId = parsedUserData?.decoded?.id;

          if (courseinstructorId) {
            const response = await axios.get(
              `${apiUrl}api/getCourseInById/${courseinstructorId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const courseData = response.data;
            setCoursename(courseData.name || "");
            setUsername(courseData.username || "");
            setPhone(courseData.phone || "");
            setEmail(courseData.email || "");
            setFirstname(courseData.firstname || "");
            setLastname(courseData.lastname || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedCourseData = {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      };

      const courseinstructor_id = userData?.decoded?.id; // Extracting the ID

      const response = await axios.put(
        `${apiUrl}api/updateCourseIn/${courseinstructor_id}`,
        updatedCourseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setShowModal(true);

      // Update the userData in local state if needed
      setUserData({
        ...userData,
        decoded: {
          ...userData.decoded,
          firstname,
          lastname,
          phone,
          email,
        },
      });

      setTimeout(() => {
        setShowModal(false);
        navigate("/course");
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error.message);
      setMessage(error.response?.data?.message || "Error updating user");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
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
                <label className="block text-gray-700">ชื่อ</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">นามสกุล</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  ชื่อ-นามสกุล (เต็ม)
                </label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={`${firstname} ${lastname}`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">ตำแหน่ง</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-gray-500 cursor-not-allowed"
                  value="ตัวแทนหลักสูตร"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  placeholder="ชื่อผู้ใช้"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-gray-500 cursor-not-allowed"
                  value={username}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-black"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">อีเมล</label>
                <input
                  type="email"
                  placeholder="อีเมล"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                onClick={() => navigate("/course")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
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

export default CourseInfo;
