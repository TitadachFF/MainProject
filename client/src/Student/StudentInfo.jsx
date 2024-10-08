import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DocumentInfo from "./DocumentInfo";
import axios from "axios";

const StudentInfo = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [sections, setSections] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [studentData, setStudentData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");

        if (token && storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const studentId = parsedUserData.decoded.id;
          const academicNameFromToken =
            parsedUserData.decoded.academic.academic_name || "";
          setAcademicName(academicNameFromToken);
          setStudentId(studentId); // เพิ่มการตั้งค่า studentId
          const studentResponse = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStudentData(studentResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Log ข้อมูลที่ผู้ใช้กรอก
    console.log("Updated student data:", studentData);
    console.log("Confirm password:", confirmPassword);

    // ตรวจสอบว่ามีการกรอกยืนยันรหัสผ่านหรือไม่
    if (!confirmPassword) {
      setPasswordError("โปรดยืนยันรหัสผ่าน");
      return;
    }

    // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
    if (studentData.password !== confirmPassword) {
      setPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (studentId) {
        const response = await axios.put(
          `http://localhost:3000/api/updateStudent/${studentId}`,
          {
            username: studentData.username,
            password: studentData.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          document.getElementById("my_modal_1").showModal();
          setMessage("อัพเดตข้อมูลสำเร็จ!");
          setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error updating student data:", error.message);
      document.getElementById("my_modal_1").showModal();
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      setIsSuccess(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Log การเปลี่ยนแปลงข้อมูลในฟอร์ม
    console.log(`Field changed: ${name}, Value: ${value}`);

    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "studentinfo";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div className=" bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/student")}>
          เมนูนักศึกษา
        </p>
        <span className="mx-1">&gt;</span>
        <p>ข้อมูลส่วนตัว</p>
      </div>
      <div className="h-100% flex justify-center bg-gray-100 pb-10 ">
        <div className="container mx-auto w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 h-full mb-20">
          <h2 className="text-2xl font-bold mb-6 text-red">ข้อมูลส่วนตัว</h2>
          <div className="border-b mb-6 pb-3">
            <ul className="flex">
              <li
                className="mr-4"
                onClick={() => updateQueryString("studentinfo")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "studentinfo"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  ข้อมูลเข้าใช้งานในระบบ
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("infotodocument")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "infotodocument"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  ข้อมูลสำหรับเอกสาร
                </a>
              </li>
            </ul>
          </div>
          {currentForm === "studentinfo" && (
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-6 ">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink">
                    <label className="block text-gray-700">รหัสนักศึกษา</label>
                    <input
                      type="text"
                      name="student_id"
                      value={studentData.student_id}
                      disabled
                      className="w-28 mt-1 border border-gray-300 rounded p-2"
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-gray-700">ชื่อ</label>
                    <input
                      type="text"
                      name="firstname"
                      value={studentData.firstname}
                      disabled
                      className="w-full mt-1 border border-gray-300 rounded p-2"
                      placeholder="ชื่อ"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-gray-700">นามสกุล</label>
                    <input
                      type="text"
                      name="lastname"
                      value={studentData.lastname}
                      disabled
                      className="w-full mt-1 border border-gray-300 rounded p-2"
                      placeholder="นามสกุล"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">ชื่อเข้าใช้งาน</label>
                  <input
                    type="text"
                    name="username"
                    value={studentData.username}
                    onChange={handleChange}
                    className="w-2/3 mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสนักศึกษา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">รหัสผ่าน</label>
                  <input
                    type="password"
                    name="password"
                    value={studentData.password}
                    onChange={handleChange}
                    className="w-2/3 mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสผ่าน"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-2/3 mt-1 border border-gray-300 rounded p-2"
                    placeholder="ยืนยันรหัสผ่าน"
                  />
                  {passwordError && (
                    <p className="text-red text-sm">*{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="p-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 hover:shadow-md"
                  onClick={() => navigate("/student")}
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="p-6 py-2 bg-red border text-white rounded  hover:shadow-md"
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}
          {currentForm === "infotodocument" && <DocumentInfo />}
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 id="alertmodal" className="font-bold text-lg">
            {message}
          </h3>
          <p className="py-4 text-gray-500">
            กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
          </p>
          <div className="modal-action flex justify-between">
            <form method="dialog" className="w-full flex justify-between">
              <button
                id="close-alertmodal"
                className="px-10 py-2 bg-white text-red border font-semibold border-red rounded"
              >
                ปิด
              </button>
              {isSuccess && (
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() => navigate("/student")}
                >
                  หน้าแรก
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StudentInfo;
