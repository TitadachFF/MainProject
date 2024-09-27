import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditStudentPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    year: "",
    semester: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    const studentPlanId = location.state.studentplan_id;
    fetchStudentPlanById(studentPlanId);
    fetchCourses();
    fetchCategories();
    fetchGroups();
  }, [location.state.studentplan_id]);

  const fetchStudentPlanById = async (studentPlanId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getStudentplanById/${studentPlanId}`
      );
      setPlan(response.data);
      if (response.data.Listcoursestudentplan.length > 0) {
        setFormData({
          course_id: response.data.Listcoursestudentplan[0]?.course_id || "",
          year: response.data.year || "",
          semester: response.data.semester || "",
        });
      }
    } catch (error) {
      console.error("Error fetching student plan:", error);
    }
  };

  const getCourseDetails = (courseId) => {
    return courses.find((course) => course.course_id === courseId) || {};
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getAllCourses"
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/getAllCategories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getAllGroupMajors"
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleEditClick = (courseDetail) => {
    setFormData({
      course_id: courseDetail.course_id,
      year: plan.year,
      semester: plan.semester,
    });
  };

  const handleDeleteClick = (courseDetail) => {
    setPlanToDelete(courseDetail);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add logic for deletion
    setConfirmDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModal(false);
  };

  // คำนวณหน่วยกิตรวม
  const totalCredits = plan
    ? plan.Listcoursestudentplan.reduce((total, courseDetail) => {
        const course = getCourseDetails(courseDetail.course_id);
        return total + (course.courseUnit || 0);
      }, 0)
    : 0;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mb-6 text-gray-500 flex items-center mt-20">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/studentplan")}>
          ดูแผนการเรียน
        </p>
        <span className="mx-1">&gt;</span>
        <p>แก้ไขแผนการเรียน</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-red mb-6">แก้ไขแผนการเรียน</h1>

        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">รหัสวิชา</th>
              <th className="py-2 px-4 border-b text-left">ชื่อวิชา</th>
              <th className="py-2 px-4 border-b text-left">ปีการศึกษา</th>
              <th className="py-2 px-4 border-b text-left">เทอม</th>
              <th className="py-2 px-4 border-b text-left">หน่วยกิต</th>
              <th className="py-2 px-4 border-b text-left">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {plan && plan.Listcoursestudentplan.length > 0 ? (
              plan.Listcoursestudentplan.map((courseDetail) => {
                const course = getCourseDetails(courseDetail.course_id);
                const category = categories.find(
                  (cat) => cat.category_id === course.category_id
                );
                const group = groups.find(
                  (grp) => grp.group_id === course.group_id
                );
                return (
                  <tr
                    key={courseDetail.course_id}
                    className="hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border-b text-left">
                      {course.course_id || "N/A"}
                    </td>

                    <td className="py-2 px-4 border-b text-left">
                      <div className="flex items-center">
                        <span>{course.courseNameTH || "N/A"}</span>
                        <span className="bg-red text-white text-xs px-2 py-1 ml-2 rounded-xl">
                          {category ? category.category_name : "ทั่วไป"} (
                          {group ? group.group_name : "ทั่วไป"})
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-4 border-b text-left">
                      {plan.year || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {plan.semester || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {course.courseUnit || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      <button
                        className="bg-orange-300 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        onClick={() => handleEditClick(courseDetail)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                        onClick={() => handleDeleteClick(courseDetail)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 text-center border-b">
                  ไม่มีรายวิชาสำหรับแผนการเรียนนี้
                </td>
              </tr>
            )}
          </tbody>
          {/* แถวแสดงหน่วยกิตรวม */}
          <tfoot>
            <tr>
              <td colSpan="4" className="py-2 px-4 text-right font-bold">
                หน่วยกิตรวม:
              </td>
              <td className="py-2 px-4 border-b text-left font-bold">
                {totalCredits} หน่วยกิต
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 flex justify-between py-12">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
            onClick={() => navigate("/studentplan")}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-red border border-red text-white rounded"
            onClick={() => navigate("/addstudentplan?form=addlistplan")}
          >
            เพิ่มรายวิชา
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold">{modalMessage}</h2>
              <p>{modalDescription}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        {confirmDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold">ยืนยันการลบ</h2>
              <p>คุณต้องการลบแผนการเรียนนี้หรือไม่?</p>
              <div className="mt-4">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  ยืนยัน
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="ml-2 bg-gray-300 text-black px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditStudentPlan;
