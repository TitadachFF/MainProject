import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GraduateCheck = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [majorUnit, setMajorUnit] = useState(null);
  const [totalGPA, setTotalGPA] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [courseGroupedData, setCourseGroupedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [registerData, setRegisterData] = useState([]);

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
          setRegisterData(registerData); // ตั้งค่า registerData ใน state
          console.log(registerData);

          const gradeToValue = (grade) => {
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
                return 0;
            }
          };
          if (registerData.length > 0) {
            const categories_id = registerData[0].listcourseregister.map(
              (course) => course.course.category_id
            );

            const group_id = registerData[0].listcourseregister.map(
              (course) => course.course.group_id
            );

            const course_id = registerData[0].listcourseregister.map(
              (course) => course.course.course_id
            );

            const grades = registerData[0].listcourseregister.map(
              (course) => course.grade
            );

            const categoryPromises = categories_id.map((id) =>
              axios.get(`http://localhost:3000/api/getCategoryById/${id}`)
            );
            const categoryResponses = await Promise.all(categoryPromises);
            const categoryData = categoryResponses.map((res) => res.data);
            setCategoryData(categoryData);

            const groupPromises = group_id.map((id) =>
              axios.get(`http://localhost:3000/api/getGroupMajorById/${id}`)
            );
            const groupResponses = await Promise.all(groupPromises);
            const groupData = groupResponses.map((res) => res.data);
            setGroupData(groupData);

            const coursePromises = course_id.map((id) =>
              axios.get(`http://localhost:3000/api/getCourseById/${id}`)
            );
            const courseResponses = await Promise.all(coursePromises);
            const courseData = courseResponses.map((res) => res.data);
            setCourseData(courseData);

            // Group courses by category and then by group
            const groupedCourses = {};
            courseResponses.forEach((courseResponse, index) => {
              const course = courseResponse.data;
              const categoryId = categories_id[index];
              const groupId = group_id[index];

              if (!groupedCourses[categoryId]) {
                groupedCourses[categoryId] = {
                  categoryName:
                    categoryData.find((cat) => cat.category_id === categoryId)
                      ?.category_name || "ไม่ทราบ",
                  groups: {},
                };
              }

              if (!groupedCourses[categoryId].groups[groupId]) {
                groupedCourses[categoryId].groups[groupId] = {
                  groupName:
                    groupData.find((g) => g.group_id === groupId)?.group_name ||
                    "กลุ่มที่ไม่มีชื่อ",
                  courses: [],
                };
              }

              groupedCourses[categoryId].groups[groupId].courses.push(course);
            });

            setCourseGroupedData(groupedCourses);
          }
          // รวมเกรดจากทุก register_id
          let totalSum = 0;
          registerData.forEach((register) => {
            register.listcourseregister.forEach((course) => {
              const gradeValue = gradeToValue(course.grade);
              totalSum += gradeValue;
            });
          });
          setTotalGPA(totalSum);
          setIsLoading(false); // ข้อมูลโหลดเสร็จแล้ว
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
                    <span className="font-bold">{majorUnit} </span>
                    หน่วยกิต
                  </label>
                  <label className="block text-gray-700">
                    หน่วยกิตปัจจุบัน:{" "}
                    {isLoading ? (
                      <span className="font-bold text-gray-300">
                        กำลังโหลด...
                      </span>
                    ) : (
                      <span className="font-bold">
                        {totalGPA ? totalGPA.toFixed(1) : "N/A"}{" "}
                      </span>
                    )}
                    หน่วยกิต
                  </label>
                  <label className="flex text-gray-700 items-center">
                    <p className="mr-1">ต้องการอีก: </p>

                    {isLoading ? (
                      <span className="font-bold text-gray-300">
                        กำลังโหลด...
                      </span>
                    ) : totalGPA >= majorUnit ? (
                      <span className="text-green-600 font-bold">
                        หน่วยกิตครบแล้ว
                      </span>
                    ) : (
                      <span className="flex font-bold text-red">
                        {remainingCredits.toFixed(1)}{" "}
                        <p className="ml-1 font-normal text-black">หน่วยกิต</p>
                      </span>
                    )}
                  </label>
                </div>
                <div className="flex space-x-4">
                  <label className=" text-gray-700 flex items-center">
                    <p className="mr-2"> ผลการตรวจสอบ: </p>
                    <span className="text-lg font-bold ">
                      {isLoading ? (
                        <span className="font-bold text-gray-300">
                          กำลังโหลด...
                        </span>
                      ) : remainingCredits <= 0 ? (
                        <p className="text-green-600">ผ่านการตรวจสอบหน่วยกิต</p>
                      ) : (
                        <p className="text-red">ไม่ผ่านการตรวจสอบหน่วยกิต</p>
                      )}
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <p className="text-gray-300 font-bold">กำลังโหลด...</p>
            )}
          </div>

          <br />
          {/* Table */}
          {/* Table */}
          <div className="p-4">
            {/* ตรวจสอบว่ามีข้อมูลการลงทะเบียนหรือไม่ */}
            {registerData && registerData.length > 0 ? (
              registerData.map((register) => (
                <div key={register.register_id} className="mb-6">
                  {/* แสดงปีและภาคการศึกษาของ register นั้นๆ */}
                  <div className="font-semibold text-lg mb-4">
                    ปีการศึกษา {register.year}, ภาคการศึกษา {register.semester}
                  </div>

                  {/* ตรวจสอบว่ามีข้อมูลคอร์สที่ลงทะเบียนใน register นี้หรือไม่ */}
                  {register.listcourseregister.length > 0 ? (
                    <div className="grid grid-cols-7 text-center border border-black p-2">
                      <div className="border border-black p-2">รหัสวิชา</div>
                      <div className="border border-black p-2 col-span-2">
                        รายวิชา
                      </div>
                      <div className="border border-black p-2">
                        หน่วยกิต น (ท-ป-ค)
                      </div>
                      <div className="border border-black p-2">ภาคการศึกษา</div>
                      <div className="border border-black p-2">เกรด</div>
                      <div className="border border-black p-2">
                        อาจารย์ผู้สอน
                      </div>
                    </div>
                  ) : (
                    <p>ไม่มีข้อมูลการลงทะเบียน</p>
                  )}

                  {/* วนลูปแสดงข้อมูล listcourseregister ของแต่ละ register */}
                  {register.listcourseregister.map((courseRegister, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 text-center border border-black p-2"
                    >
                      {/* เข้าถึง course_id ผ่าน course */}
                      <div className="border border-black p-2">
                        {courseRegister.course.course_id}
                      </div>
                      <div className="border border-black p-2 col-span-2">
                        {courseRegister.course.courseNameTH}
                        <br />
                        {courseRegister.course.courseNameENG}
                      </div>
                      <div className="border border-black p-2">
                        {courseRegister.course.courseUnit} (
                        {courseRegister.course.courseTheory}-
                        {courseRegister.course.coursePractice}-
                        {courseRegister.course.categoryResearch})
                      </div>
                      <div className="border border-black p-2">
                        {register.semester}
                      </div>
                      <div className="border border-black p-2">
                        {courseRegister.grade
                          ? `${courseRegister.grade.replace("_plus", "+")}`
                          : ""}
                      </div>

                      <div className="border border-black p-2">
                        {courseRegister.teacher
                          ? `${courseRegister.teacher.titlename} ${courseRegister.teacher.firstname} ${courseRegister.teacher.lastname}`
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-300 font-bold">ไม่มีข้อมูลการลงทะเบียน</p>
            )}
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
