import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GraduateCheck = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [majorUnit, setMajorUnit] = useState(null);
  const [totalGPA, setTotalGPA] = useState(0);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");
        if (token && storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const studentId = parsedUserData.decoded.id;
          const academicNameFromToken =
            parsedUserData.decoded.academic.academic_name || "";
          const response = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const studentData = response.data;
          setStudentData(response.data);
          setAcademicName(academicNameFromToken);
          const majorId = studentData.major_id;
          // Fetch major of student.
          const majorResponse = await axios.get(
            `http://localhost:3000/api/getMajorById/${majorId}`
          );
          setMajorUnit(majorResponse.data.majorUnit);
          const registerResponse = await axios.get(
            `http://localhost:3000/api/getRegisters/${studentId}`
          );

          const registerData = registerResponse.data;

          const gradeToGPA = (grade) => {
            switch (grade) {
              case "A":
                return 4.0;
              case "B_plus":
                return 3.5;
              case "B":
                return 3.0;
              case "C_plus":
                return 2.5;
              case "C":
                return 2.0;
              case "D_plus":
                return 1.5;
              case "D":
                return 1.0;
              default:
                return null;
            }
          };
          console.log(registerData);
          // Logเกรดออกมาดู
          if (registerData.length > 0) {
            const grades = registerData[0].listcourseregister.map(
              (course) => course.grade
            );
            const gpaValues = grades.map(gradeToGPA).filter((value) => value);
            const total = gpaValues.reduce((acc, gpa) => acc + gpa, 0);
            setTotalGPA(total);
            console.log("Total GPA:", totalGPA);
          } else {
            console.log("ไม่มีข้อมูลการลงทะเบียน");
          }
        } else {
          console.error("No token or user data found");
        }
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    };
    fetchStudentData();
  }, []);
  const remainingCredits = majorUnit - totalGPA;

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
        <p>ตรวจสอบจบ</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-7xl bg-white h-full rounded-lg shadow-lg p-6">
          {/* Card Title */}
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ตรวจสอบจบ
          </h2>
          {/* Student info */}
          <div className="grid grid-cols-1 gap-6">
            {studentData ? (
              <>
                <div className="flex space-x-4">
                  <label className="flex text-gray-700">
                    ชื่อ:{" "}
                    <p className="font-bold ml-2">
                      {studentData.firstname} {studentData.lastname}
                    </p>
                  </label>
                  <label className="block text-gray-700">
                    รหัสนักศึกษา:{" "}
                    <span className="font-bold">{studentData.student_id}</span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <label className="block text-gray-700">
                    สาขาวิชา: <span className="font-bold">{academicName}</span>
                  </label>
                  <label className="block text-gray-700">
                    หน่วยกิตที่ต้องการ:{" "}
                    <span className="font-bold">{majorUnit || "ไม่ทราบ"}</span>
                  </label>
                  <label className="block text-gray-700">
                    หน่วยกิตปัจจุบัน:{" "}
                    <span className="font-bold">{totalGPA.toFixed(1)}</span>
                  </label>
                  <label className="flex text-gray-700 items-center">
                    <p className="mr-1"> ต้องการอีก: </p>

                    <span className="font-bold text-red ">
                      {remainingCredits < majorUnit ? (
                        remainingCredits.toFixed(1)
                      ) : (
                        <p className="text-green-600">หน่วยกิตครบแล้ว</p>
                      )}
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <label className=" text-gray-700 flex items-center">
                    <p className="mr-2"> ผลการตรวจสอบ: </p>
                    <span className="text-lg font-bold ">
                      {remainingCredits <= 0 ? (
                        <p className="text-green-600">ผ่าน</p>
                      ) : (
                        <p className="text-red">ไม่ผ่าน</p>
                      )}
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <p>กำลังโหลดข้อมูล...</p>
            )}
          </div>

          <br />
          {/* Table */}
          <div className="p-4">
            {/* First Category */}

            <div className="border border-black rounded-lg p-4 mb-6">
              <div className="grid grid-cols-7 text-center font-bold">
                <div className="border border-r-0 border-black p-2">
                  รหัสวิชา
                </div>
                <div className="border border-r-0 border-black p-2 col-span-2">
                  ชื่อวิชา
                </div>
                <div className="border border-r-0 border-black p-2">
                  นก./ชม.
                </div>
                <div className="border border-r-0 border-black p-2">
                  ภาคเรียน
                </div>
                <div className="border border-r-0 border-black p-2">
                  ชื่อผู้สอน
                </div>
                <div className="border border-black p-2">ผลการเรียน</div>
              </div>

              <div className="border border-black border-t-0 flex items-center justify-between p-2">
                <div className="text-black font-bold mb-2">category_name</div>
                <div className="flex text-center">
                  ไม่ต่ำกว่า <p>category_unit</p> หน่วยกิต
                </div>
              </div>
              <div className="border border-t-0 border-black flex items-center justify-between p-2">
                <div className="ml-8 mb-1">group_name</div>
                <div className="flex text-center">
                  จำนวนไม่น้อยกว่า <p>group_unit</p> หน่วยกิต
                </div>
              </div>
              <div className="mb-2">
                <div className="grid grid-cols-7 text-center ">
                  <div className="border border-r-0 border-t-0 border-black p-2">
                    course_id
                  </div>
                  <div className="border border-r-0 border-t-0 border-black p-2 col-span-2">
                    courseNameTH
                  </div>
                  <div className="border border-r-0 border-t-0 border-black p-2">
                    courseUnit
                  </div>
                  <div className="border border-r-0 border-t-0 border-black p-2">
                    semester
                  </div>
                  <div className="border border-r-0 border-t-0 border-black p-2">
                    teacher.firstname
                  </div>
                  <div className="border border-t-0 border-black p-2 text-center">
                    grade
                  </div>
                </div>

                <div className="text-right pr-2 border border-t-0 border-black">
                  รวม.....................หน่วยกิต
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-4">
                <div className="col-span-6 text-end">
                  รวมหน่วยกิตตลอดหลักสูตร.......หน่วยกิต
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/student")}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateCheck;
