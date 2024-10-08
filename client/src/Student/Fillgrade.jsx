import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
  const [academicName, setAcademicName] = useState("");
const [selectedTeachers, setSelectedTeachers] = useState({});
  const [grades, setGrades] = useState({});
  const [freeSubject, setFreeSubject] = useState({});
  const [studentData, setStudentData] = useState({});
  const [sections, setSections] = useState({});
  const [advisor, setAdvisor] = useState({});
  const [registers, setRegisters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [inputTeachers, setInputTeachers] = useState({});
  const [activeInputId, setActiveInputId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(""); // เพิ่ม state สำหรับเก็บปีการศึกษาที่เลือก
  const [availableYears, setAvailableYears] = useState([]); // เก็บปีการศึกษาที่มีใน register
  const [semester, setSemester] = useState(null);
  
  const handleGradeChange = (listcourseregister_id, value) => {
    setGrades({
      ...grades,
      [listcourseregister_id]: value,
    });
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

          const studentResponse = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStudentData(studentResponse.data);
          setAcademicName(academicNameFromToken);


          const sectionResponse = await axios.get(
            `http://localhost:3000/api/getSectionById/${studentResponse.data.sec_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }

          );
          setSections(sectionResponse.data);

          const advisorResponse = await axios.get(
            `http://localhost:3000/api/getAdvisorById/${studentResponse.data.advisor_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdvisor(advisorResponse.data);

          const registerResponse = await axios.get(
            `http://localhost:3000/api/getRegisters/${studentResponse.data.student_id}`,

            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setRegisters(registerResponse.data);

          // สร้างแผนที่ปีการศึกษา
          const yearsSet = new Set();
          registerResponse.data.forEach((register) => {
            yearsSet.add(register.year);
          });
          setAvailableYears([...yearsSet]); // เก็บปีการศึกษาที่ได้จาก registers

          const teachersMap = {};
          const gradesMap = {};
          const freeSubjectMap = {};
          const inputTeachersMap = {};

          registerResponse.data.forEach((register) => {
            register.listcourseregister.forEach((course) => {
              teachersMap[course.listcourseregister_id] =
                course.teacher_id || "";
              gradesMap[course.listcourseregister_id] = course.grade || "";
              inputTeachersMap[course.listcourseregister_id] =
  course.teacher ? `${course.teacher.firstname} ${course.teacher.lastname}` : "";
              freeSubjectMap[course.listcourseregister_id] =
                course.freesubject || false; // เก็บค่า freeSubject
            });
          });



          setSelectedTeachers(teachersMap);
          setGrades(gradesMap);
          setFreeSubject(freeSubjectMap);
          setInputTeachers(inputTeachersMap);

          const teacherResponse = await axios.get(

            `http://localhost:3000/api/getTeachers`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setTeachers(teacherResponse.data);
          console.log("Teacher data:",teacherResponse.data);
          

        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchStudentData();
  }, []);

  const handleTeacherInputChange = (listcourseregister_id, value) => {
    setInputTeachers({ ...inputTeachers, [listcourseregister_id]: value });
    setActiveInputId(listcourseregister_id);
    const filtered = teachers.filter((teacher) =>
      `${teacher.firstname} ${teacher.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const handleTeacherSelect = (listcourseregister_id, teacher) => {
    setInputTeachers({
      ...inputTeachers,
      [listcourseregister_id]: `${teacher.firstname} ${teacher.lastname}`,
    });
    setSelectedTeachers({
      ...selectedTeachers,
      [listcourseregister_id]: teacher.teacher_id,
    });
    setFilteredTeachers([]);
    setActiveInputId(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        Object.keys(selectedTeachers).map(async (listcourseregister_id) => {
          const teacher_id = selectedTeachers[listcourseregister_id];
          const grade = grades[listcourseregister_id];
          const freesubject = freeSubject[listcourseregister_id] || false;

          if (!teacher_id) {
            console.error(
              `Missing teacher_id for course ID ${listcourseregister_id}`
            );
            return;
          }

          const body = {
            freesubject: freesubject,
            teacher_id: teacher_id,
            grade: grade || null,
          };

          const response = await axios.put(
            `http://localhost:3000/api/updateRegister/${listcourseregister_id}`,
            body,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Response from API:", response.data);
        })
      );


      alert("บันทึกผลการเรียนเรียบร้อยแล้ว");
      window.location.reload();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error.message);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    }

  };

  // ฟังก์ชันกรองรายวิชาตามปีการศึกษาที่เลือก
  const filteredRegisters = selectedYear
    ? registers.filter((register) => register.year === selectedYear)
    : registers;

  // ฟังก์ชันกรองรายวิชา ตามเทอมที่เลือก
  const filteredCourses =
    semester !== null
      ? filteredRegisters
          .map((register) => ({
            ...register,
            listcourseregister: register.listcourseregister.filter(
              (course) => register.semester === semester // ใช้ register.semester ในการกรองภาคเรียน
            ),
          }))
          .filter((register) => register.listcourseregister.length > 0)
      : filteredRegisters;

  const handleSemesterChange = (e) => {

    const value = e.target.value;
    setSemester(value ? parseInt(value, 10) : null); // แปลงค่าเป็น integer

  };

  const handleFreeSubjectChange = (listcourseregister_id, value) => {
    setFreeSubject({
      ...freeSubject,
      [listcourseregister_id]: value === "true", // แปลงสตริงเป็นบูลีน
    });
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

          <div className="grid grid-cols-1 gap-6">
            <div className="flex space-x-2">
              <label className="flex text-gray-700">
                <p className="font-bold">{studentData.student_id}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="ml-2 font-bold">
                  {studentData.titlenameTh} {""}
                  {studentData.firstname} {""} {studentData.lastname}
                </p>
              </label>
              <label className="flex text-gray-700">
                <p className="ml-2 font-bold">
                  {studentData.titlenameEng} {""}
                  {studentData.firstnameEng} {""} {studentData.lastnameEng}
                </p>
              </label>
            </div>
            <div className="flex space-x-4">
              <label className="flex text-gray-700">
                <p className="font-bold">สาขาวิชา:</p>
                <p className="ml-2">{academicName}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="font-bold">ชั้น:</p>
                <p className="ml-2">{sections.sec_name}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="font-bold">อาจารย์ที่ปรึกษา:</p>
                <p className="ml-2">
                  {advisor.titlename} {advisor.firstname} {advisor.lastname}
                </p>
              </label>
            </div>
            {/* เพิ่ม div ใหม่สำหรับ dropdown ปีการศึกษา */}
            <div className="flex text-gray-700">
              <label className="flex">
                ปีการศึกษา:
                <select
                  className="select select-bordered select-xs max-w-xs ml-2"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">เลือกปีการศึกษา</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      ปีการศึกษา {year}
                    </option>
                  ))}
                </select>
              </label>

            </div>
          </div>
          <div className="flex mt-5">
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

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-300 ">
              <thead>
                <tr className="border bg-red text-white">
                  <th className="py-2 border">รหัสวิชา</th>
                  <th className="py-2 border">ชื่อวิชา</th>
                  <th className="py-2 border">หน่วยกิต</th>
                  <th className="py-2 border">ภาคเรียน</th>
                  <th className="py-2 border">ชื่อผู้สอน</th>
                  <th className="py-2 border">ผลการเรียน</th>
                  <th className="py-2 border">วิชาเลือกเสรี</th>
                </tr>
              </thead>
              <tbody>

                {filteredCourses.map((register) =>
                  register.listcourseregister.map((course) => (
                    <tr key={course.listcourseregister_id}>
                      <td className="py-2 border text-center">
                        {course.course.course_id}
                      </td>
                      <td className="py-2 border text-center">
                        {course.course.courseNameTH}
                      </td>
                      <td className="py-2 border text-center">
                        {course.course.courseUnit}
                      </td>
                      <td className="py-2 border text-center">
                        {register.semester}
                      </td>

                      <td className="py-2 border text-center relative">
                        <input
                          type="text"
                          className="border rounded-md p-1 text-center"
                          value={
                            inputTeachers[course.listcourseregister_id] || ""
                          }
                          onChange={(e) =>
                            handleTeacherInputChange(
                              course.listcourseregister_id,
                              e.target.value
                            )
                          }
                          placeholder="พิมพ์ชื่ออาจารย์"
                          onFocus={() =>
                            setActiveInputId(course.listcourseregister_id)
                          }
                        />
                        {activeInputId === course.listcourseregister_id &&
                          filteredTeachers.length > 0 && (
                            <ul className="absolute left-0 z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto">
                              {filteredTeachers.map((teacher) => (
                                <li
                                  key={teacher.teacher_id}
                                  className="cursor-pointer p-1 hover:bg-gray-200"
                                  onClick={() =>
                                    handleTeacherSelect(
                                      course.listcourseregister_id,
                                      teacher
                                    )
                                  }
                                >

                                  {`${teacher.firstname} ${teacher.lastname}`}
                                </li>
                              ))}
                            </ul>
                          )}
                      </td>

                      <td className="py-2 border text-center">
                        <select
                          className="border rounded-md p-1 text-center"
                          value={grades[course.listcourseregister_id] || ""}
                          onChange={(e) =>
                            handleGradeChange(
                              course.listcourseregister_id,
                              e.target.value
                            )
                          }
                        >
                          <option disabled value="">เลือกผลการเรียน</option>
                          <option value="A">A</option>
                          <option value="B_plus">B+</option>
                          <option value="B">B</option>
                          <option value="C_plus">C+</option>
                          <option value="C">C</option>
                          <option value="D_plus">D+</option>
                          <option value="D">D</option>
                        </select>
                      </td>

                      <td className="py-2 border text-center">
                        <select
                          className="border rounded-md p-1 text-center"
                          value={
                            freeSubject[course.listcourseregister_id] !==
                            undefined
                              ? String(
                                  freeSubject[course.listcourseregister_id]
                                )
                              : ""
                          }
                          onChange={(e) =>
                            handleFreeSubjectChange(
                              course.listcourseregister_id,
                              e.target.value
                            )
                          }
                        >
                          <option disabled value="">เลือก</option>
                          <option value="true">ใช่</option>
                          <option value="false">ไม่ใช่</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
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

                onClick={handleSubmit}
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
