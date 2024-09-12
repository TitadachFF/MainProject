import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [semester, setSemester] = useState("ทั้งหมด");
  const [courses, setCourses] = useState([]); // State for courses
  const [allCourses, setAllCourses] = useState([]); // State for all available courses
  const [courseSemesterMap, setCourseSemesterMap] = useState({}); // State for mapping course_id to semester
  const [years, setYears] = useState([]); // State for years
  const [teachers, setTeachers] = useState([]); // State for teachers
  const [filteredTeachers, setFilteredTeachers] = useState({}); // State for filtered teachers by course_id
  const [teacherSearchTerm, setTeacherSearchTerm] = useState({}); // State for teacher search terms by course_id
  const [selectedTeacher, setSelectedTeacher] = useState({}); // State for selected teacher by course_id
  const grades = ["A", "B+", "B", "C+", "C", "D+", "D", "E", "PASS", "FAIL"]; // Grade options

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

          // Fetch subjects
          const subjectsResponse = await axios.get(
            `http://localhost:3000/api/getRegisters/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const coursesList = [];
          const courseSemesterMapping = new Map();
          const yearSet = new Set();

          subjectsResponse.data.forEach((register) => {
            yearSet.add(register.year);
            register.listcourseregister.forEach((course) => {
              coursesList.push(course);
              courseSemesterMapping.set(course.course_id, register.semester);
            });
          });

          setCourses(coursesList);
          setCourseSemesterMap(courseSemesterMapping);
          setYears(Array.from(yearSet));

          // Fetch all available courses
          const allCoursesResponse = await axios.get(
            `http://localhost:3000/api/getAllCourses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setAllCourses(allCoursesResponse.data);

          // Fetch teachers
          const teachersResponse = await axios.get(
            `http://localhost:3000/api/getTeachers`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setTeachers(teachersResponse.data);
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleSearchChange = (courseId, e) => {
    setTeacherSearchTerm((prev) => ({
      ...prev,
      [courseId]: e.target.value,
    }));
  };

  const handleTeacherSelect = (courseId, teacher) => {
    setSelectedTeacher((prev) => ({
      ...prev,
      [courseId]: teacher,
    }));
    setTeacherSearchTerm((prev) => ({
      ...prev,
      [courseId]: teacher.fullName,
    }));
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
                  checked={semester === "ทั้งหมด"}
                  onChange={() => setSemester("ทั้งหมด")}
                />
                <p className="mr-2">ทั้งหมด</p>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio mr-2"
                  checked={semester === "1"}
                  onChange={() => setSemester("1")}
                />
                <p className="mr-2">1</p>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio mr-2"
                  checked={semester === "2"}
                  onChange={() => setSemester("2")}
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
                {allCourses.filter((course) => {
                  if (!courseSemesterMap.has(course.course_id)) {
                    return false;
                  }
                  if (
                    selectedYear &&
                    !courses.find(
                      (c) =>
                        c.course_id === course.course_id &&
                        c.year === parseInt(selectedYear, 10)
                    )
                  ) {
                    return false;
                  }
                  if (
                    semester !== "ทั้งหมด" &&
                    parseInt(courseSemesterMap.get(course.course_id), 10) !==
                      parseInt(semester, 10)
                  ) {
                    return false;
                  }
                  return true;
                }).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      ไม่มีแผนการเรียน <a className="text-blue-500 hover:underline" href="/registerplan"> โปรดลงทะเบียนแผนการเรียน</a>
                    </td>
                  </tr>
                ) : (
                  allCourses
                    .filter((course) => {
                      if (!courseSemesterMap.has(course.course_id)) {
                        return false;
                      }
                      if (
                        selectedYear &&
                        !courses.find(
                          (c) =>
                            c.course_id === course.course_id &&
                            c.year === parseInt(selectedYear, 10)
                        )
                      ) {
                        return false;
                      }
                      if (
                        semester !== "ทั้งหมด" &&
                        parseInt(
                          courseSemesterMap.get(course.course_id),
                          10
                        ) !== parseInt(semester, 10)
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((course) => (
                      <tr key={course.course_id}>
                        <td>{course.course_id}</td>
                        <td>{course.courseNameTH}</td>
                        <td>{course.courseUnit}</td>
                        <td>{courseSemesterMap.get(course.course_id)}</td>
                        <td>
                          <div className="relative">
                            <input
                              type="text"
                              value={teacherSearchTerm[course.course_id] || ""}
                              onChange={(e) =>
                                handleSearchChange(course.course_id, e)
                              }
                              className="input input-bordered w-full"
                              placeholder="ค้นหาชื่อผู้สอน"
                            />
                            {teacherSearchTerm[course.course_id] && (
                              <div
                                className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1 w-full"
                                style={{ zIndex: 10 }}
                              >
                                {filteredTeachers[course.course_id]?.map(
                                  (teacher) => (
                                    <div
                                      key={teacher.id}
                                      className="p-2 cursor-pointer hover:bg-gray-100"
                                      onClick={() =>
                                        handleTeacherSelect(
                                          course.course_id,
                                          teacher
                                        )
                                      }
                                    >
                                      {teacher.fullName}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            defaultValue=""
                          >
                            <option disabled value="">
                              กรอกผลการเรียน
                            </option>
                            {grades.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                          />
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <br />
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/student")}
            >
              ย้อนกลับ
            </button>

            {/* Buttons for saving and previewing */}
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
                onClick={() => (window.location.href = "/qweqe.pdf")}
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
