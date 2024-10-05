import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
  const [academicName, setAcademicName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState({}); // State to hold selected teachers for each course
  const [grades, setGrades] = useState({}); // State to hold grades for each course
  const [freeSubject, setFreeSubject] = useState({});
  const [studentData, setStudentData] = useState({
    student_id: "",
    titlenameTh: "",
    firstname: "",
    lastname: "",
    titlenameEng: "",
    firstnameEng: "",
    lastnameEng: "",
    birthdate: "",
    monthdate: "",
    yeardate: "",
    phone: "",
    sector_status: "",
    corps: "",
    sec_id: "",
    academic_id: "",
    pre_educational: "",
    graduated_from: "",
    pregraduatedyear: "",
    afterendcontact: "",
    homenumber: "",
    road: "",
    alley: "",
    subdistrict: "",
    district: "",
    province: "",
    advisor_id: "",
    wanttoend: "",
    yeartoend: "",
  });
  const [sections, setSections] = useState({
    sec_name: "",
  });
  const [advisor, setAdvisor] = useState({
    titlename: "",
    firstname: "",
    lastname: "",
  });
  const [registers, setRegisters] = useState([]);
  const [teachers, setTeachers] = useState([]);

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
          // Get StudentData
          const studentResponse = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStudentData(studentResponse.data);
          setAcademicName(academicNameFromToken);
          console.log(studentResponse.data);
          // Get Sec
          const sectionResponse = await axios.get(
            `http://localhost:3000/api/getSectionById/${studentResponse.data.sec_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSections(sectionResponse.data);
          console.log(sectionResponse.data);

          const advisorResponse = await axios.get(
            `http://localhost:3000/api/getAdvisorById/${studentResponse.data.advisor_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdvisor(advisorResponse.data);
          console.log(advisorResponse.data);

          const registerResponse = await axios.get(
            `http://localhost:3000/api/getRegisters/${studentResponse.data.student_id}`,
            {
              headers: { Authorization: `Bearer${token}` },
            }
          );
          setRegisters(registerResponse.data);
          console.log(registerResponse.data);
          const teachersMap = {};
          const gradesMap = {};
          const freeSubjectMap = {};
          registerResponse.data.forEach((register) => {
            register.listcourseregister.forEach((course) => {
              teachersMap[course.listcourseregister_id] =
                course.teacher_id || ""; // ตรวจสอบการตั้งค่า teacher_id
              gradesMap[course.listcourseregister_id] = course.grade || ""; // ตรวจสอบการตั้งค่า grade
              freeSubjectMap[course.freesubject] = course.freesubject || "";
            });
          });

          setSelectedTeachers(teachersMap);
          setGrades(gradesMap);
          setFreeSubject(freeSubjectMap);
          const teacherResponse = await axios.get(
            `http://localhost:3000/api/getTeachers`,
            {
              headers: { Authorization: `Bearer${token}` },
            }
          );
          setTeachers(teacherResponse.data);
          console.log(teacherResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchStudentData();
  }, []);

  const handleTeacherChange = (listcourseregister_id, teacher_id) => {
    setSelectedTeachers({
      ...selectedTeachers,
      [listcourseregister_id]: parseInt(teacher_id, 10), // ใช้ teacher_id ในการเก็บค่า
    });
    console.log("Updated selectedTeachers:", selectedTeachers);
  };

  const handleGradeChange = (listcourseregister_id, grade) => {
    setGrades({ ...grades, [listcourseregister_id]: grade });
  };

  const handleFreeSubjectChange = (listcourseregister_id, freesubject) => {
    setFreeSubject({ ...freeSubject, [listcourseregister_id]: freesubject });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Selected teachers:", selectedTeachers); // ตรวจสอบ selectedTeachers ก่อนส่ง
      await Promise.all(
        Object.keys(selectedTeachers).map(async (listcourseregister_id) => {
          const teacher_id = selectedTeachers[listcourseregister_id];
          const grade = grades[listcourseregister_id];
          const freesubject = !!freeSubject[listcourseregister_id]; // ใช้ !! เพื่อบังคับเป็น boolean

          if (!teacher_id) {
            console.error(
              `Missing teacher_id for course ID ${listcourseregister_id}`
            );
            return; // ข้ามถ้าไม่มี teacher_id
          }

          const body = {
            freesubject: freesubject,
            teacher_id: teacher_id,
            grade: grade || null, // ถ้าไม่มี grade จะส่ง null
          };

          console.log(
            `Updating register for course ID ${listcourseregister_id}:`,
            body
          );

          // เรียก API เพื่ออัปเดตข้อมูล
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
    } catch (error) {
      console.error("Error updating registers:", error.message);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
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

          <div className="grid grid-cols-1 gap-6">
            <div className="flex space-x-2">
              <label className="flex text-gray-700">
                <p className="font-bold">{studentData.student_id}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="ml-2 font-bold">
                  {studentData.titlenameTh} {""}
                  {studentData.firstname}
                  {""} {studentData.lastname}
                </p>
              </label>
              <label className="flex text-gray-700">
                <p className="ml-2 font-bold">
                  {studentData.titlenameEng} {""}
                  {studentData.firstnameEng}
                  {""} {studentData.lastnameEng}
                </p>
              </label>
            </div>
            <div className="flex space-x-4">
              <label className="flex text-gray-700">
                <p className="font-bold">สาขาวิชา:</p>
                <p className="ml-2">{academicName}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="font-bold">หมู่เรียน:</p>
                <p className="ml-2">{sections.sec_name}</p>
              </label>
              <label className="flex text-gray-700">
                <p className="font-bold">อาจารย์ที่ปรึกษา:</p>
                <p className="ml-2">{`${advisor.titlename}${advisor.firstname} ${advisor.lastname}`}</p>
              </label>
            </div>
          </div>
          {/* Create table here */}

          <div className="mt-6">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="border bg-red text-white">
                  <th className="py-2">รหัสวิชา</th>
                  <th className="py-2">ชื่อวิชา</th>
                  <th className="py-2">นก/ชม.</th>
                  <th className="py-2">ภาคเรียน</th>
                  <th className="py-2">ชื่อผู้สอน</th>
                  <th className="py-2">ผลการเรียน</th>
                  <th className="py-2">วิชาเลือกเสรี</th>
                </tr>
              </thead>
              <tbody>
                {registers.map((register) =>
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

                      <td className="py-2 border text-center">
                        <select
                          className="border rounded-md p-1 text-center"
                          value={
                            selectedTeachers[course.listcourseregister_id] ||
                            course.teacher_id ||
                            ""
                          }
                          onChange={(e) =>
                            handleTeacherChange(
                              course.listcourseregister_id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">เลือกผู้สอน</option>
                          {teachers.map((teacher) => (
                            <option
                              key={teacher.teacher_id}
                              value={teacher.teacher_id}
                            >
                              {teacher.firstname} {teacher.lastname}
                            </option>
                          ))}
                        </select>
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
                          <option value="">เลือกผลการเรียน</option>
                          <option value="A">A</option>
                          <option value="B_plus">B+</option>
                          <option value="B">B</option>
                          <option value="C_plus">C+</option>
                          <option value="C">C</option>
                          <option value="D_plus">D</option>
                          <option value="D">D</option>
                        </select>
                      </td>
                      {/* ช่องเลือกวิชาเลือกเสรี */}
                      <td className="py-2 border text-center">
                        <select
                          className="border rounded-md p-1 text-center"
                          value={
                            freeSubject[course.listcourseregister_id] || "false"
                          } // แสดงค่าที่เคยกรอกไว้หรือ "false" ถ้าไม่มีค่า
                          onChange={(e) =>
                            handleFreeSubjectChange(
                              course.listcourseregister_id,
                              e.target.value === "false" // แปลงค่าจาก string เป็น boolean
                            )
                          }
                        >
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
          <br />

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
                onClick={handleSubmit} // Call the submit function here
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
