import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GraduateCheck = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [majorUnit, setMajorUnit] = useState(null);
  const [totalGPA, setTotalGPA] = useState(0);
  const [registerData, setRegisterData] = useState([]);
  const [courseGroupedData, setCourseGroupedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [freeSubjectData, setFreeSubjectData] = useState([]); // สร้าง state สำหรับวิชาเสรี
  const apiUrl = import.meta.env.VITE_BASE_URL;

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

          const studentResponse = await axios.get(
            `${apiUrl}api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const studentData = studentResponse.data;
          setStudentData(studentData);
          setAcademicName(academicNameFromToken);
          const majorId = studentData.major_id;

          const majorResponse = await axios.get(
            `${apiUrl}api/getMajorById/${majorId}`
          );
          setMajorUnit(majorResponse.data.majorUnit);

          const [
            registerResponse,
            categoriesResponse,
            groupsResponse,
            coursesResponse,
          ] = await Promise.all([
            axios.get(`${apiUrl}api/getRegisters/${studentId}`),
            axios.get(`${apiUrl}api/getAllCategories`),
            axios.get(`${apiUrl}api/getAllGroupMajors`),
            axios.get(`${apiUrl}api/getAllCourses`),
          ]);

          const registerData = registerResponse.data;
          setRegisterData(registerData);

          // Calculate total GPA (หน่วยกิตปัจจุบัน)
          let totalSum = 0;
          registerData.forEach((register) => {
            register.listcourseregister.forEach((course) => {
              const gradeValue = gradeToValue(course.grade);
              totalSum += gradeValue;
            });
          });
          setTotalGPA(totalSum);
          // Process and group courses
          const courseMap = {};
          coursesResponse.data.forEach((course) => {
            courseMap[course.course_id] = {
              ...course,
              category_name:
                categoriesResponse.data.find(
                  (cat) => cat.category_id === course.category_id
                )?.category_name || "Unknown",

              category_unit:
                categoriesResponse.data.find(
                  (cat) => cat.category_id === course.category_id
                )?.category_unit || "Unknown",

              group_name:
                groupsResponse.data.find(
                  (grp) => grp.group_id === course.group_id
                )?.group_name || "Unknown",
              group_unit:
                groupsResponse.data.find(
                  (grp) => grp.group_id === course.group_id
                )?.group_unit || "Unknown",
            };
          });

          // Group by category and then by group
          const groupedCourses = {};
          const freeSubjectCourses = []; // เตรียม array สำหรับวิชาเสรี

          registerData.forEach((register) => {
            register.listcourseregister.forEach((courseRegister) => {
              const course = courseMap[courseRegister.course.course_id];
              if (course) {
                const categoryId = course.category_id;
                const groupId = course.group_id;

                if (courseRegister.freesubject === "true") {
                  // ถ้าเป็นวิชาเสรีให้ย้ายไปเก็บใน array ของวิชาเสรี
                  freeSubjectCourses.push({
                    ...course,
                    grade: courseRegister.grade,
                    teacher: courseRegister.teacher,
                  });
                } else {
                  // วิชาทั่วไปที่ไม่ใช่วิชาเสรี
                  if (!groupedCourses[categoryId]) {
                    groupedCourses[categoryId] = {
                      categoryName: course.category_name,
                      categoryUnit: course.category_unit,
                      groups: {},
                    };
                  }

                  if (!groupedCourses[categoryId].groups[groupId]) {
                    groupedCourses[categoryId].groups[groupId] = {
                      groupName: course.group_name,
                      groupUnit: course.group_unit,
                      courses: [],
                    };
                  }

                  groupedCourses[categoryId].groups[groupId].courses.push({
                    ...course,
                    grade: courseRegister.grade,
                    teacher: courseRegister.teacher,
                  });
                }
              }
            });
          });

          setCourseGroupedData(groupedCourses);
          setFreeSubjectData(freeSubjectCourses); // เก็บข้อมูลวิชาเสรี

          setIsLoading(false);
        } else {
          console.error("No token or user data found");
        }
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    };
    fetchData();
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
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ตรวจสอบจบ
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {studentData ? (
              <>
                {/* ข้อมูลนักศึกษา */}
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
                        <span className="font-bold">
                          {studentData.student_id}
                        </span>
                      </label>
                    </div>
                    <div className="flex space-x-4">
                      <label className="block text-gray-700">
                        สาขาวิชา:{" "}
                        <span className="font-bold">{academicName}</span>
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
                            <p className="ml-1 font-normal text-black">
                              หน่วยกิต
                            </p>
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
                            <p className="text-green-600">
                              ผ่านการตรวจสอบหน่วยกิต
                            </p>
                          ) : (
                            <p className="text-red">
                              ไม่ผ่านการตรวจสอบหน่วยกิต
                            </p>
                          )}
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 font-bold">กำลังโหลด...</p>
                )}

                {/* ตารางหมวดหมู่วิชาต่าง ๆ */}
                <div className="p-4">
                  {Object.keys(courseGroupedData).length > 0 ? (
                    Object.entries(courseGroupedData).map(
                      ([categoryId, category]) => (
                        <div key={categoryId} className="mb-6">
                          <h3 className="font-bold  flex  text-lg uppercase">
                            {category.categoryName}{" "}
                            <p className="text-red ml-4">
                              ไม่ต่ำกว่า{category.categoryUnit}หน่วยกิต
                            </p>
                          </h3>
                          {Object.entries(category.groups).map(
                            ([groupId, group]) => (
                              <div key={groupId} className="mb-4">
                                <h4 className="font-bold flex pl-2 text-md mb-2 uppercase">
                                  {group.groupName}{" "}
                                  <p className="text-red ml-4">
                                    ไม่ต่ำกว่า{group.groupUnit}หน่วยกิต
                                  </p>
                                </h4>
                                <table className="min-w-full border border-gray-300 ">
                                  <thead>
                                    <tr className="border bg-red text-white">
                                      <th className="py-2 border">รหัสวิชา</th>
                                      <th className="py-2 border">รายวิชา</th>
                                      <th className="py-2 border">หน่วยกิต</th>
                                      <th className="py-2 border">เกรด</th>
                                      <th className="py-2 border">
                                        อาจารย์ผู้สอน
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.courses.map((course, index) => (
                                      <tr key={index}>
                                        <td className="text-center border">
                                          {" "}
                                          {course.course_id}
                                        </td>
                                        <td className="border ">
                                          {" "}
                                          {course.courseNameTH}
                                          <br />
                                          {course.courseNameENG}
                                        </td>
                                        <td className="text-center border">
                                          {" "}
                                          {course.courseUnit} (
                                          {course.courseTheory}-
                                          {course.coursePractice}-
                                          {course.categoryResearch})
                                        </td>
                                        <td className="text-center border">
                                          {" "}
                                          {course.grade ? (
                                            course.grade.replace("_plus", "+")
                                          ) : (
                                            <p className="text-red">
                                              ไม่พบเกรด
                                            </p>
                                          )}
                                        </td>
                                        <td className="text-center border">
                                          {" "}
                                          {course.teacher ? (
                                            `${course.teacher.titlename} ${course.teacher.firstname} ${course.teacher.lastname}`
                                          ) : (
                                            <p className="text-red">
                                              ไม่พบอาจารย์
                                            </p>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p>ไม่มีข้อมูลการลงทะเบียน</p>
                  )}
                </div>

                {/* ตารางวิชาเสรี */}
                <div className="px-4">
                  <h3 className="font-bold text-lg mb-4 uppercase">
                    วิชาเสรีที่นักศึกษาเลือก
                  </h3>
                  {freeSubjectData.length > 0 ? (
                    <div className="mb-4">
                      <table className="min-w-full border border-gray-300 ">
                        <thead>
                          <tr className="border bg-red text-white">
                            <th>รหัสวิชา</th>
                            <th className="py-2 border">รายวิชา</th>
                            <th className="py-2 border">หน่วยกิต</th>
                            <th className="py-2 border">เกรด</th>
                            <th className="py-2 border">อาจารย์ผู้สอน</th>
                          </tr>
                        </thead>
                        <tbody>
                          {freeSubjectData.map((course, index) => (
                            <tr key={index}>
                              <td className="text-center border">
                                {" "}
                                {course.course_id}
                              </td>
                              <td>
                                {" "}
                                {course.courseNameTH}
                                <br />
                                {course.courseNameENG}
                              </td>
                              <td className="text-center border">
                                {" "}
                                {course.courseUnit} ({course.courseTheory}-
                                {course.coursePractice}-
                                {course.categoryResearch})
                              </td>
                              <td className="text-center border">
                                {" "}
                                {course.grade
                                  ? course.grade.replace("_plus", "+")
                                  : ""}
                              </td>
                              <td className="text-center border">
                                {" "}
                                {course.teacher
                                  ? `${course.teacher.titlename} ${course.teacher.firstname} ${course.teacher.lastname}`
                                  : ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>ไม่มีข้อมูลวิชาเสรี</p>
                  )}
                </div>
              </>
            ) : (
              <p>กำลังโหลดข้อมูล...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateCheck;
