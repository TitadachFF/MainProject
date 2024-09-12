import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditStudentPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    year: "",
    semester: "",
  });

  // Modal state
  const [modalMessage, setModalMessage] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Confirmation modal state
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    fetchStudentPlans();
    fetchCourses(); // Fetch courses when component mounts
  }, []);

  const fetchStudentPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getStudentPlans"
      );
      console.log("Student Plans data:", response.data); // Log all student plans data
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching student plans:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getAllCourses"
      );
      console.log("All Courses data:", response.data); // Log all courses data
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormData({
      course_id: plan.Listcoursestudentplan[0]?.course?.course_id || "",
      year: plan.year || "",
      semester: plan.semester || "",
    });
  };

  const handleDeleteClick = (plan, course_id) => {
    setPlanToDelete(plan);
    setFormData((prevData) => ({
      ...prevData,
      course_id: course_id, // Make sure this is correctly set
    }));
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("ไม่พบโทเค็นการยืนยันตัวตน");
      }

      const { course_id } = formData;
      if (!course_id) {
        throw new Error("รหัสวิชาไม่ถูกต้อง");
      }

      // Log the plan and form data
      console.log("Plan to delete:", planToDelete);
      console.log("Form Data:", formData);

      // Find the correct Listcoursestudentplan_id
      const plan = plans.find(
        (p) => p.studentplan_id === planToDelete.studentplan_id
      );
      const courseToDelete = plan?.Listcoursestudentplan.find(
        (course) => course.course_id === course_id
      );

      if (!courseToDelete) {
        throw new Error("ไม่พบรหัส Listcoursestudentplan");
      }

      // Ensure the Listcoursestudentplan_id is valid
      const { Listcoursestudentplan_id } = courseToDelete;
      if (!Listcoursestudentplan_id) {
        throw new Error("รหัส Listcoursestudentplan ไม่ถูกต้อง");
      }

      // Log the ID being sent to the API
      console.log("Listcoursestudentplan_id:", Listcoursestudentplan_id);

      // Perform the deletion
      const response = await axios.delete(
        `http://localhost:3000/api/deleteListStudentplan/${Listcoursestudentplan_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response.data);

      // Update the plans state to reflect deletion
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.studentplan_id === planToDelete.studentplan_id
            ? {
                ...plan,
                Listcoursestudentplan: plan.Listcoursestudentplan.filter(
                  (courseDetail) => courseDetail.course_id !== course_id
                ),
              }
            : plan
        )
      );

      showModalSuccess("ลบสำเร็จ", "แผนการเรียนได้รับการลบเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error deleting student plans:", error);
      showModalError("ข้อผิดพลาดในการลบ", error.message);
    } finally {
      setConfirmDeleteModal(false);
      setPlanToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModal(false);
    setPlanToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("ไม่พบโทเค็นการยืนยันตัวตน");
      }

      const studentPlanId = editingPlan ? editingPlan.studentplan_id : null;

      if (!studentPlanId) {
        throw new Error("รหัสแผนการเรียนไม่ถูกกำหนด");
      }

      const payload = {
        course_id: formData.course_id,
        year: formData.year,
        semester: parseInt(formData.semester),
      };

      const response = await axios.put(
        `http://localhost:3000/api/updateStudentPlan/${studentPlanId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data);

      await fetchStudentPlans();

      setEditingPlan(null);
      setFormData({
        course_id: "",
        year: "",
        semester: "",
      });

      showModalSuccess(
        "อัพเดตสำเร็จ",
        "แผนการเรียนได้รับการอัพเดตเรียบร้อยแล้ว"
      );
    } catch (error) {
      console.error("Error updating student plans:", error);
      showModalError("ข้อผิดพลาดในการอัพเดต", error.message);
    }
  };

  const showModalError = (message, description) => {
    setModalMessage(message);
    setModalDescription(description);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  const showModalSuccess = (message, description) => {
    setModalMessage(message);
    setModalDescription(description);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  const getCourseDetails = (course_id) => {
    return courses.find((course) => course.course_id === course_id) || {};
  };

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

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
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
            {plans.length > 0 ? (
              plans.map((plan) =>
                plan.Listcoursestudentplan.length > 0 ? (
                  plan.Listcoursestudentplan.map((courseDetail) => {
                    const course = getCourseDetails(courseDetail.course_id);
                    return (
                      <tr
                        key={courseDetail.course_id}
                        className="hover:bg-gray-100"
                      >
                        <td className="py-2 px-4 border-b text-left">
                          {course.course_id || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b text-left">
                          {course.courseNameTH || "N/A"}
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
                            onClick={() => handleEditClick(plan)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                            onClick={() =>
                              handleDeleteClick(plan, courseDetail.course_id)
                            }
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr key={plan.studentplan_id}>
                    
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 text-center border-b">
                  ไม่มีรายการแผนการเรียน
                </td>
              </tr>
            )}
          </tbody>
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
        {/* Edit form */}
        {editingPlan && (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700">รหัสวิชา:</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="">เลือกวิชา</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_id} - {course.courseNameTH}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ปีการศึกษา:</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">เทอม:</label>
              <input
                type="number"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-red border border-red text-white rounded"
            >
              บันทึก
            </button>
          </form>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl">
            <h1 className="text-lg font-bold mb-4">ยืนยันการลบ</h1>
            <p className="mb-4">คุณต้องการลบแผนการเรียนนี้ใช่หรือไม่?</p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handleCancelDelete}
              >
                ยกเลิก
              </button>
              <button
                className="bg-red text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error and Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl">
            <h1 className="text-lg font-bold mb-4">{modalMessage}</h1>
            <p>{modalDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStudentPlan;
