import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Documents.css";
import { useNavigate } from "react-router-dom";

const PDFview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [academicName, setAcademicName] = useState("");
  const [majorUnit, setMajorUnit] = useState(null);
  const [registerData, setRegisterData] = useState([]);
  const [courseGroupedData, setCourseGroupedData] = useState({});
  const [freeSubjectData, setFreeSubjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [advisor, setAdvisor] = useState({});
  const [sections, setSections] = useState({ sec_name: "" });
  const [canPrint, setCanPrint] = useState(false); // New state to manage print eligibility
  const [isDataComplete, setIsDataComplete] = useState(false);
  const totalPages = 1;
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const ROWS_PER_PAGE = 20;
  const [totalCredits, setTotalCredits] = useState(0);

  const formatGrade = (grade) => {
    if (grade) {
      if (grade === "PASS") {
        return "P";
      }
      return grade.replace("_plus", "+");
    }
    return grade;
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
            sectionResponse,
            advisorResponse,
          ] = await Promise.all([
            axios.get(`${apiUrl}api/getRegisters/${studentId}`),
            axios.get(`${apiUrl}api/getAllCategories`),
            axios.get(`${apiUrl}api/getAllGroupMajors`),
            axios.get(`${apiUrl}api/getAllCourses`),
            axios.get(
              `${apiUrl}api/getSectionById/${studentResponse.data.sec_id}`
            ),
            axios.get(
              `${apiUrl}api/getAdvisorById/${studentResponse.data.advisor_id}`
            ),
          ]);

          setSections(sectionResponse.data);
          setAdvisor(advisorResponse.data);
          const registerData = registerResponse.data;
          setRegisterData(registerData);

          // Process and group courses
          const courseMap = {};
          coursesResponse.data.forEach((course) => {
            const category = categoriesResponse.data.find(
              (cat) => cat.category_id === course.category_id
            );

            courseMap[course.course_id] = {
              ...course,
              category_name: category ? category.category_name : "Unknown",
              category_unit: category ? category.category_unit : "Unknown",
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
          const freeSubjectCourses = [];

          registerData.forEach((register) => {
            register.listcourseregister.forEach((courseRegister) => {
              const course = courseMap[courseRegister.course.course_id];
              if (course) {
                const categoryId = course.category_id;
                const groupId = course.group_id;

                if (courseRegister.freesubject === "true") {
                  freeSubjectCourses.push({
                    ...course,
                    grade: courseRegister.grade,
                    teacher: courseRegister.teacher,
                    semester: register.semester, // เพิ่ม semester ที่นี่
                  });
                } else {
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
                    semester: register.semester, // เพิ่ม semester ที่นี่
                  });
                }
              }
            });
          });

          setCourseGroupedData(groupedCourses);
          setFreeSubjectData(freeSubjectCourses);
          setIsLoading(false);

          // Check if all required fields (except "หมายเหตุ") are filled
          const allFieldsFilled = registerData.every((register) =>
            register.listcourseregister.every(
              (courseRegister) =>
                courseRegister.course.course_id &&
                courseRegister.course.courseNameTH &&
                courseRegister.course.courseUnit &&
                courseRegister.grade &&
                courseRegister.teacher
            )
          );
          setCanPrint(allFieldsFilled);
        } else {
          console.error("No token or user data found");
        }
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculateCredits = () => {
    const categoryCredits = {};
    let totalGeneralCredits = 0; // รวมหน่วยกิตของหมวดวิชาศึกษาทั่วไป
    const totalSpecificCredits = {}; // รวมหน่วยกิตของหมวดวิชาเฉพาะ

    Object.keys(courseGroupedData).forEach((category) => {
      const categoryData = courseGroupedData[category];

      if (category === "generalSubjects") {
        // ถ้าหมวดวิชาศึกษาทั่วไป
        let categoryTotal = 0;
        Object.keys(categoryData.groups).forEach((groupId) => {
          const group = categoryData.groups[groupId];
          let groupTotal = 0;

          group.courses.forEach((course) => {
            groupTotal += course.courseUnit; // สรุปหน่วยกิตของกลุ่ม
          });

          categoryTotal += groupTotal; // สรุปหน่วยกิตของหมวด
          totalGeneralCredits += groupTotal; // สรุปหน่วยกิตของหมวดศึกษาทั่วไป
        });

        categoryCredits[categoryData.categoryName] = categoryTotal; // เก็บหน่วยกิตของหมวด
      } else {
        // สำหรับหมวดวิชาเฉพาะ
        Object.keys(categoryData.groups).forEach((groupId) => {
          const group = categoryData.groups[groupId];
          let groupTotal = 0;

          group.courses.forEach((course) => {
            groupTotal += course.courseUnit; // สรุปหน่วยกิตของกลุ่ม
          });

          totalSpecificCredits[group.groupName] = groupTotal; // เก็บหน่วยกิตของกลุ่ม
        });
      }
    });

    return { totalGeneralCredits, totalSpecificCredits };
  };

  const { totalGeneralCredits, totalSpecificCredits } = calculateCredits();

  useEffect(() => {
    let total = 0;

    // คำนวณหน่วยกิตจาก courseGroupedData
    Object.keys(courseGroupedData).forEach((category) => {
      Object.keys(courseGroupedData[category].groups).forEach((groupId) => {
        courseGroupedData[category].groups[groupId].courses.forEach(
          (course) => {
            total += course.courseUnit; // คำนวณรวมหน่วยกิต
          }
        );
      });
    });

    // คำนวณหน่วยกิตจาก freeSubjectData
    freeSubjectData.forEach((course) => {
      total += course.courseUnit; // รวมหน่วยกิตจากวิชาเลือกเสรี
    });

    setTotalCredits(total); // อัพเดท state totalCredits
  }, [courseGroupedData, freeSubjectData]); // คำนวณใหม่เมื่อข้อมูลเปลี่ยนแปลง

  return (
    <div>
      <div className="dreak py-4 px-2 text-gray-400 text-sm flex items-center pt-28 print:hidden">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/student")}>
          เมนูนักศึกษา
        </p>
        <span className="mx-1">&gt;</span>
        <p>เอกสาร</p>
      </div>
      <div className="font-sarabun container mx-auto p-4 max-w-5xl text-sm py-5">
        <div className="mb-4 text-center print:hidden">
          <div
            className={`max-w-sm mx-auto rounded-lg shadow-lg p-4 ${
              canPrint ? "bg-green-200 text-green-900" : "bg-red text-white"
            }`}
          >
            {canPrint ? (
              <p>คุณกรอกข้อมูลครบแล้ว</p>
            ) : (
              <p>คุณยังกรอกข้อมูลไม่ครบ</p>
            )}
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <button
            className="px-8 py-3 bg-red border border-red text-white rounded print:hidden"
            onClick={handlePrint}
          >
            โหลด PDF
          </button>
        </div>
        {currentPage === 1 && (
          <div className="mb-8 border-black p-0 ">
            <div className="mb-8 border-black p-0 ">
              <h2 className="text-xl mb-4 text-center">
                แบบบันทึกผลการเรียนรายวิชา ระดับปริญญาตรี
              </h2>

              <div className="mb-0">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td>
                        ชื่อ - นามสกุล :{" "}
                        <span className=" dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {""}
                            {studentData?.firstname} {studentData?.lastname}
                          </span>
                          ..........................................................................................
                        </span>
                        วัน/เดือน/ปีเกิด :{" "}
                        <span className="dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {studentData?.birthdate}
                            {""} {studentData?.monthdate}{" "}
                            {studentData?.yeardate}
                          </span>
                          ...............................................................................................
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        รหัสประจำตัว :{" "}
                        <span className=" dotted-line relative">
                          <span className="text absolute bottom-0.5 color: #1f16a2;">
                            {""}
                            {studentData?.student_id}
                          </span>
                          ..................................
                        </span>
                        หมู่เรียน :{" "}
                        <span className=" dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {""}
                            {sections?.sec_name}
                          </span>
                          ..............................
                        </span>
                        สาขาวิชา :{" "}
                        <span className=" dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {""}
                            {academicName}
                          </span>
                          ............................................
                        </span>
                        เบอร์โทร :{" "}
                        <span className=" dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {""}
                            {studentData?.phone || ""}
                          </span>
                          ......................................................
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        ชื่ออาจารย์ที่ปรึกษา :{" "}
                        <span className="dotted-line relative">
                          <span className="text absolute bottom-0.5">
                            {""}
                            {advisor.titlename} {advisor.firstname}{" "}
                            {advisor.lastname}
                          </span>
                          ...........................................................................................................................................................................................................
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-0">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border border-black p-2">{""}</th>
                    <th className="border border-black p-2">รหัสวิชา</th>
                    <th className="border border-black p-2">ชื่อวิชา</th>
                    <th className="border border-black p-2">นก./ชม.</th>
                    <th className="border border-black p-2">ภาคเรียน</th>
                    <th className="border border-black p-2">ชื่อผู้สอน</th>
                    <th className="border border-black p-2">ผลการเรียน</th>
                    <th className="border border-black p-2">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let totalCourses = 0;
                    let totalFreeCredits = 0;

                    return (
                      <>
                        {Object.keys(courseGroupedData).map(
                          (category, index) => {
                            let totalCategoryCredits = 0;

                            return (
                              <React.Fragment key={index}>
                                <tr className="category-row">
                                  <td
                                    colSpan={8}
                                    className="border border-black p-2"
                                  >
                                    {index + 1}.{" "}
                                    {courseGroupedData[category].categoryName}{" "}
                                    ไม่ต่ำกว่า{" "}
                                    {courseGroupedData[category].categoryUnit}{" "}
                                    หน่วยกิต
                                  </td>
                                </tr>

                                {Object.keys(
                                  courseGroupedData[category].groups
                                ).map((groupId, groupIndex) => {
                                  const group =
                                    courseGroupedData[category].groups[groupId];
                                  let groupTotalCredits = 0;

                                  return (
                                    <React.Fragment key={groupId}>
                                      <tr>
                                        <td
                                          colSpan={8}
                                          className="border border-black p-2 pl-10"
                                        >
                                          {index + 1}.{groupIndex + 1}{" "}
                                          {group.groupName} ไม่ต่ำกว่า{" "}
                                          {group.groupUnit} หน่วยกิต
                                        </td>
                                      </tr>

                                      {/* Additional remarks for specific groups, placed immediately below the group */}
                                      {group.groupName ===
                                        "กลุ่มวิชาภาษาและการสื่อสาร" && (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border border-black p-2 border-r-0"
                                          ></td>
                                          <td
                                            colSpan={6}
                                            className="border border-black border-l-0 p-2  "
                                          >
                                            <strong>
                                              รายวิชาบังคับ 9 หน่วยกิต
                                            </strong>
                                          </td>
                                        </tr>
                                      )}
                                      {group.groupName ===
                                        "กลุ่มวิชาสังคมศาสตร์" && (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border border-black p-2 border-r-0"
                                          ></td>
                                          <td
                                            colSpan={6}
                                            className="border border-black border-l-0 p-2"
                                          >
                                            <strong>
                                              รายวิชาบังคับ (บังคับ 2 รายวิชา
                                              จาก 3 รายวิชา)
                                            </strong>
                                          </td>
                                        </tr>
                                      )}
                                      {group.groupName ===
                                        "กลุ่มวิชามนุษย์ศาสตร์" && (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border border-black p-2 border-r-0"
                                          ></td>
                                          <td
                                            colSpan={6}
                                            className="border border-black border-l-0 p-2"
                                          >
                                            <strong>
                                              รายวิชาบังคับ 6 หน่วยกิต
                                            </strong>
                                          </td>
                                        </tr>
                                      )}
                                      {group.groupName ===
                                        "กลุ่มวิชาวิทยาศาสตร์ คณิตศาสตร์และเทคโนโลยี" && (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border border-black p-2 border-r-0"
                                          ></td>
                                          <td
                                            colSpan={6}
                                            className="border border-black border-l-0 p-2"
                                          >
                                            <strong>
                                              รายวิชาบังคับ (บังคับ 2 รายวิชา
                                              จาก 3 รายวิชา)
                                            </strong>
                                          </td>
                                        </tr>
                                      )}

                                      {group.courses.map(
                                        (course, courseIndex) => {
                                          groupTotalCredits +=
                                            course.courseUnit;
                                          totalCategoryCredits +=
                                            course.courseUnit;

                                          return (
                                            <tr key={courseIndex}>
                                              <td className="border border-black p-2"></td>
                                              <td className="border border-black p-2">
                                                {course.course_id}
                                              </td>
                                              <td className="border border-black p-2">
                                                {course.courseNameTH}
                                              </td>
                                              <td className="border border-black p-2">
                                                {course.courseUnit} (
                                                {course.courseTheory}-
                                                {course.coursePractice}-
                                                {course.categoryResearch})
                                              </td>
                                              <td className="border border-black p-2 text-center">
                                                {course.semester}
                                              </td>
                                              <td className="border border-black p-2 text-center">
                                                {course.teacher ? (
                                                  ` ${course.teacher.firstname} ${course.teacher.lastname}`
                                                ) : (
                                                  <p className="text-red"></p>
                                                )}
                                              </td>
                                              <td className="border border-black p-2 text-center">
                                                {formatGrade(course.grade)}
                                              </td>
                                              <td className="border border-black p-2">
                                                {course.notes}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}

                                      {/* Check if the group name is one of the four specific groups */}
                                      {[
                                        "กลุ่มวิชาแกน",
                                        "กลุ่มวิชาเฉพาะด้านบังคับ",
                                        "กลุ่มวิชาเฉพาะด้านเลือก",
                                        "กลุ่มวิชาพื้นฐานวิชาชีพและวิชาชีพ",
                                      ].includes(group.groupName) && (
                                        <tr>
                                          <td
                                            colSpan={8}
                                            className="border border-black p-2 text-right"
                                          >
                                            <strong>
                                              รวม {groupTotalCredits} หน่วยกิต
                                            </strong>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  );
                                })}

                                {courseGroupedData[category].categoryName !==
                                  "หมวดวิชาเฉพาะ" && (
                                  <tr>
                                    <td
                                      colSpan={8}
                                      className="border border-black p-2 text-right"
                                    >
                                      <strong>
                                        รวม {totalCategoryCredits} หน่วยกิต
                                      </strong>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          }
                        )}

                        {/* Free Subjects Section */}
                        <tr>
                          <td colSpan={8} className="border border-black p-2">
                            {Object.keys(courseGroupedData).length + 1}.
                            หมวดวิชาเลือกเสรี
                          </td>
                        </tr>
                        {freeSubjectData.map((course, index) => {
                          totalFreeCredits += course.courseUnit;

                          return (
                            <tr key={index}>
                              <td className="border border-black p-2"></td>
                              <td className="border border-black p-2">
                                {course.course_id}
                              </td>
                              <td className="border border-black p-2">
                                {course.courseNameTH}
                              </td>
                              <td className="border border-black p-2">
                                {course.courseUnit} ({course.courseTheory}-
                                {course.coursePractice}-
                                {course.categoryResearch})
                              </td>
                              <td className="border border-black p-2 text-center">
                                {course.semester}
                              </td>
                              <td className="border border-black p-2 text-center">
                                {course.teacher ? (
                                  `${course.teacher.firstname} ${course.teacher.lastname}`
                                ) : (
                                  <p className="text-red"></p>
                                )}
                              </td>
                              <td className="border border-black p-2 text-center">
                                {formatGrade(course.grade)}
                              </td>
                              <td className="border border-black p-2">
                                {course.notes}
                              </td>
                            </tr>
                          );
                        })}

                        <tr>
                          <td
                            colSpan={8}
                            className="border border-black p-2 text-right font-bold"
                          >
                            รวม {totalFreeCredits} หน่วยกิต
                          </td>
                        </tr>

                        <tr>
                          <td
                            colSpan={8}
                            className="border border-black p-2 text-right font-bold"
                          >
                            รวมจำนวนหน่วยกิต ตลอดหลักสูตร {totalCredits}{" "}
                            หน่วยกิต
                          </td>
                        </tr>

                        
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap");

          @media print {
            @page {
              size: A4;
              margin: 5mm 0mm 5mm 0mm; /* เพิ่มระยะข้างล่าง */
            }
            body {
              print-color-adjust: exact;
              margin: 0;
              font-size: 12px;
              font-family: "Sarabun", sans-serif; /* ใช้ฟอนต์ Sarabun */
            }
            h2 {
              font-size: 18px;
              font-family: "Sarabun", sans-serif; /* ใช้ฟอนต์ Sarabun */
            }
            td,
            th {
              font-size: 12px;
              font-family: "Sarabun", sans-serif; /* ใช้ฟอนต์ Sarabun */
            }
            .container {
              padding: 20px;
              border: none;
              padding: 4px 6px; /* ลดความสูงของช่องตาราง */
              line-height: 1.6;
            }
            table {
              border-collapse: collapse;
            }
            .border-2 {
              border-width: 1px;
            }
            .border-black {
              border-color: black;
            }
            .print-only {
              display: block;
            }
            .navbar {
              display: none !important;
            }
            .print:hidden {
              display: none;
            }
            .footer {
              display: none !important;
            }
            th:nth-child(3),
            td:nth-child(3) {
              width: 38%; /* เพิ่มความกว้างที่นี่ */
            }
            /* ปรับขนาดช่อง นก./ชม. */
            th:nth-child(4),
            td:nth-child(4) {
              width: 10%; /* เพิ่มความกว้างที่นี่ */
            }
            th:nth-child(5),
            เพิ่มความกว้างที่นี่ td:nth-child(5) {
              width: 10%; /*  */
            }
            .category-row {
              page-break-before: always;
            }
            th:nth-child(6),
            td:nth-child(6) {
              width: 25%; /* เพิ่มความกว้างที่นี่ */
            }
            th:nth-child(7),
            td:nth-child(7) {
              width: 12%; /* เพิ่มความกว้างที่นี่ */
            }
            th:nth-child(8),
            td:nth-child(8) {
              width: 8%; /* เพิ่มความกว้างที่นี่ */
            }
          }
        `}</style>
        <div className=" flex justify-around print:hidden">
          <button
            type="button"
            className="px-6 py-2 mb-6 bg-gray-200  border text-black rounded"
            onClick={() => navigate("/document2")}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            className="px-6 py-2 mb-6 text-white border bg-red  border-red text-red-600 rounded"
            onClick={() => navigate("/student")}
          >
            หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};
export default PDFview;
