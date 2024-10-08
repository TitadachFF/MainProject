import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistePlan = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [studentplanId, setStudentplanId] = useState(""); // State for selected student plan ID
  const [year, setYear] = useState(""); // State for year

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [semester, setSemester] = useState(""); // State for semester
  const [studentPlans, setStudentPlans] = useState([]); // State to store the fetched student plans

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");

        if (token && storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const studentId = parsedUserData.decoded.id;

          // Extract academic name from token
          const academicNameFromToken =
            parsedUserData.decoded.academic.academic_name || "";
          console.log("Academic Name from Token:", academicNameFromToken);

          const response = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setStudentData(response.data);
          setAcademicName(academicNameFromToken);

          // Fetch student plans based on academic name
          const studentPlansResponse = await axios.get(
            `http://localhost:3000/api/getStudentplanByAcademic?academicName=${academicNameFromToken}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setStudentPlans(studentPlansResponse.data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/createRegister",

        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Update response:", response.data);

      document.getElementById("my_modal_1").showModal();
      setMessage("ลงทะเบียนสำเร็จ !");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error registering plan:", error);
      document.getElementById("my_modal_1").showModal();
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      setIsSuccess(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/student")}>
          เมนูนักศึกษา
        </p>
        <span className="mx-1">&gt;</span>
        <p>ลงทะเบียนแผนการเรียน</p>
      </div>
      <div className="min-h-screen flex justify-center bg-gray-100">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full">
          <h2 className="text-2xl text-red font-bold mb-6">
            ลงทะเบียนแผนการเรียน
          </h2>

          {studentData && (
            <div className="grid grid-cols-1 gap-6">
              <div className="flex space-x-4">


                <label className="flex text-gray-700 font-">
                  <p className="font-bold"> ชื่อ: </p>
                  <p className=" ml-2">
                    {studentData.firstname} {studentData.lastname}
                  </p>
                </label>


                <label className="flex text-gray-700">
                  <p className="font-bold mr-2">รหัสนักศึกษา:</p>{" "}
                  {studentData.student_id}
                </label>
              </div>
              <div className="flex space-x-4">
                <label className="flex text-gray-700">
                  <p className="font-bold mr-2">สาขาวิชา: </p> {academicName}
                </label>
              </div>
            </div>
          )}


          <button
            type="button"
            className="px-12 py-4 bg-red text-white rounded-lg text-xl font-bold mx-auto block mt-8 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-600"
            onClick={handleSubmit}
          >
            ลงทะเบียนแผนการเรียน
          </button>

          {/* Registration Form */}
          {/* <div className="mt-6">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-sm ">
                *เลือกแผนการเรียน
              </label>
              <select
                className="border p-2 rounded-md"
                value={studentplanId}
                onChange={(e) => setStudentplanId(e.target.value)}
              >
                <option value="">กรุณาเลือกแผนการเรียน</option>
                {studentPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    ปีการศึกษา {plan.year} เทอม {plan.semester}
                  </option>
                ))}
              </select>

              <label className="text-gray-400 text-sm ">*เลือกปีการศึกษา</label>
              <input
                type="text"
                placeholder="ปีการศึกษา"
                className="border p-2 rounded-md"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <label className="text-gray-400 text-sm ">*เลือกปีภาคเรียน</label>
              <input
                type="text"
                placeholder="ภาคการศึกษา"
                className="border p-2 rounded-md"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>

          </div> */}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/student")}
            >
              ย้อนกลับ
            </button>

            <div className="flex space-x-4">

              {/* <button
                type="button"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                onClick={handleSubmit}
              >
                บันทึก

              </button> */}
            </div>
          </div>
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

export default RegistePlan;
