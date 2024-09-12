import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [semester, setSemester] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [courseSemesterMap, setCourseSemesterMap] = useState({});
  const [years, setYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState({});
  const [teacherSearchTerm, setTeacherSearchTerm] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [courseGrades, setCourseGrades] = useState({});
  const [courseTeachers, setCourseTeachers] = useState({});

  const grades = [
    "A",
    "B_plus",
    "B",
    "C_plus",
    "C",
    "D_plus",
    "D",
    "E",
    "PASS",
    "FAIL",
  ];

  const gradeDisplayMap = {
    B_plus: "B+",
    C_plus: "C+",
    D_plus: "D+",
  };

  const handleGradeChange = (courseId, grade) => {
    setCourseGrades((prev) => ({
      ...prev,
      [courseId]: grade,
    }));
  };

  const handleTeacherSelect = (courseId, teacher) => {
    setSelectedTeacher((prev) => ({
      ...prev,
      [courseId]: teacher,
    }));
    setCourseTeachers((prev) => ({
      ...prev,
      [courseId]: teacher.fullName,
    }));
    setTeacherSearchTerm((prev) => ({
      ...prev,
      [courseId]: teacher.fullName,
    }));
  };

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

          setStudentData(response.data);
          setAcademicName(academicNameFromToken);

          const subjectsResponse = await axios.get(
            `http://localhost:3000/api/getRegisters/${studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const allCoursesResponse = await axios.get(
            `http://localhost:3000/api/getAllCourses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setAllCourses(allCoursesResponse.data);

          const teachersResponse = await axios.get(
            `http://localhost:3000/api/getTeachers`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setTeachers(teachersResponse.data);

          const coursesList = [];
          const courseSemesterMapping = new Map();
          const yearSet = new Set();
          const initialGrades = {};
          const initialTeachers = {};

          // กรองเฉพาะรายวิชาที่อยู่ใน register.listcourseregister
          subjectsResponse.data.forEach((register) => {
            yearSet.add(register.year);
            register.listcourseregister.forEach((course) => {
              // หาข้อมูลรายวิชาเต็มจาก allCourses
              const fullCourseData = allCoursesResponse.data.find(
                (c) => c.course_id === course.course_id
              );

              // ถ้าพบข้อมูลรายวิชาที่ตรงกัน
              if (fullCourseData) {
                const enhancedCourse = {
                  ...course,
                  courseNameTH: fullCourseData.courseNameTH || "",
                  courseUnit: fullCourseData.courseUnit || "",
                };

                coursesList.push(enhancedCourse);
                courseSemesterMapping.set(course.course_id, register.semester);

                // ถ้ามีข้อมูลเกรดและชื่ออาจารย์อยู่แล้ว ให้เก็บไว้ใน initial state
                if (course.grade) {
                  initialGrades[course.course_id] = course.grade;
                }
                if (course.teacher_name) {
                  initialTeachers[course.course_id] = course.teacher_name;
                }
              }
            });
          });

          setCourses(coursesList);
          setCourseSemesterMap(courseSemesterMapping);
          setYears(Array.from(yearSet));
          setCourseGrades(initialGrades); // ตั้งค่าเกรดที่มีอยู่แล้ว
          setCourseTeachers(initialTeachers); // ตั้งค่าชื่ออาจารย์ที่มีอยู่แล้ว
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    const filterTeachers = () => {
      Object.keys(teacherSearchTerm).forEach((courseId) => {
        const searchTerm = teacherSearchTerm[courseId] || "";
        const filtered = teachers.filter((teacher) =>
          (teacher.firstname || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        setFilteredTeachers((prev) => ({
          ...prev,
          [courseId]: filtered.map((teacher) => ({
            ...teacher,
            fullName: `${teacher.titlename || ""} ${teacher.firstname || ""} ${
              teacher.lastname || ""
            }`,
          })),
        }));
      });
    };

    filterTeachers();
  }, [teacherSearchTerm, teachers]);

  const filteredCourses = courses.filter(
    (course) =>
      semester === null || courseSemesterMap.get(course.course_id) === semester
  );

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value ? parseInt(e.target.value, 10) : null); 
  };

  const handleSearchChange = (courseId, e) => {
    setTeacherSearchTerm((prev) => ({
      ...prev,
      [courseId]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    let hasError = false;

    for (const course of courses) {
      const grade = courseGrades[course.course_id]; // เกรดที่เลือก
      const teacherName = courseTeachers[course.course_id] || ""; // ใช้ชื่ออาจารย์เดิมถ้าไม่มีการเลือกใหม่

      if (grade) {
        // ตรวจสอบว่าเกรดถูกเลือกหรือไม่
        try {
          // Log ข้อมูลที่กำลังจะส่ง
          console.log({
            grade, // เกรดที่ส่งไป
            teacher_name: teacherName, // ชื่ออาจารย์ที่ส่งไป
            course_id: course.course_id, // รหัสวิชา
            listcourseregister_id: course.listcourseregister_id, // รหัสการลงทะเบียนวิชา
          });

          // ส่งข้อมูลไปยัง API
          await axios.put(
            `http://localhost:3000/api/updateRegister/${course.listcourseregister_id}`,
            {
              grade, // ส่งเกรด
              teacher_name: teacherName, // ส่งชื่ออาจารย์
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          hasError = true;
          console.error(`Error updating course ${course.course_id}:`, error);
        }
      }
    }

    if (!hasError) {
      alert("บันทึกสำเร็จ");
      window.location.reload(); // รีเฟรชหน้า
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก");
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
        <p>แบบบันทึกผลการเรียน</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-7xl bg-white h-full rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            กรอกแบบบันทึกผลการเรียน
          </h2>

          {studentData && (
            <div className="grid grid-cols-1 gap-6">
              <div className="flex space-x-4">
                <label className="flex text-gray-700">
                  ชื่อ:{" "}
                  <p className="font-bold ml-2">
                    {studentData.firstname} {studentData.lastname}
                  </p>
                </label>
                <label className="block text-gray-700">
                  รหัสนักศึกษา: {studentData.student_id}
                </label>
              </div>
              <div className="flex space-x-4">
                <label className="block text-gray-700">
                  สาขาวิชา: {academicName}
                </label>
              </div>
              <label className="block text-gray-700 flex">
                ปีการศึกษา :
                <select
                  className="select select-bordered select-xs max-w-xs ml-2"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option disabled value="">
                    เลือกปีการศึกษา
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      ปีการศึกษา {year}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex">
                <label className="block text-gray-700 mr-2">เทอม :</label>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio mr-2"
                  checked={semester === null}
                  onChange={() => setSemester(null)}
                />
                <p className="mr-2">ทั้งหมด</p>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio mr-2"
                  checked={semester === 1}
                  onChange={() => setSemester(1)}
                />
                <p className="mr-2">1</p>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio mr-2"
                  checked={semester === 2}
                  onChange={() => setSemester(2)}
                />
                <p className="mr-2">2</p>
              </div>
            </div>
          )}

          <br />
          {/* Table */}
          <div className="overflow-x-auto border">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-base-300">
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>นก./ชม.</th>
                  <th>ภาคเรียน</th>
                  <th>ชื่อผู้สอน</th>
                  <th>ผลการเรียน</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={index}>
                    <th>{course.course_id}</th>
                    <td>{course.courseNameTH}</td>
                    <td>{course.courseUnit}</td>
                    <td>{courseSemesterMap.get(course.course_id)}</td>
                    <td>
                      <input
                        type="text"
                        value={
                          teacherSearchTerm[course.course_id] ||
                          courseTeachers[course.course_id] ||
                          ""
                        }
                        onChange={(e) =>
                          handleSearchChange(course.course_id, e)
                        }
                        placeholder="ค้นหาผู้สอน"
                        className="input input-bordered input-sm"
                      />
                      <ul className="mt-2">
                        {filteredTeachers[course.course_id] &&
                          filteredTeachers[course.course_id].map((teacher) => (
                            <li
                              key={teacher.fullName}
                              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                              onClick={() =>
                                handleTeacherSelect(course.course_id, teacher)
                              }
                            >
                              {teacher.fullName}
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td>
                      <select
                        className="select select-sm select-bordered"
                        value={courseGrades[course.course_id] || ""}
                        onChange={(e) =>
                          handleGradeChange(course.course_id, e.target.value)
                        }
                      >
                        <option disabled value="">
                          เลือกเกรด
                        </option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>
                            {gradeDisplayMap[grade] || grade}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/student")}
            >
              ย้อนกลับ
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                onClick={() => navigate("/documents?form=documentinfo")}
              >
                ดูตัวอย่างเอกสาร
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                onClick={handleSave}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fillgrade;
