import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditStudentPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [secId, setSecId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    year: "",
    semester: "",
  });

  useEffect(() => {
    if (location.state) {
      const { secId, plans } = location.state;
      setSecId(secId);
      setPlans(plans);
      fetchCourses(); // Fetch courses when component mounts
    }
  }, [location.state]);

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

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormData({
      course_id: plan.course_id,
      year: plan.year,
      semester: plan.semester,
    });
  };

  const handleDeleteClick = (planId) => {
    const updatedPlans = plans.filter((plan) => plan.id !== planId);
    setPlans(updatedPlans);
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
      console.log("Updating plan with secId:", secId);
      console.log("Plans data:", plans);

      const studentPlanId = editingPlan ? editingPlan.studentplan_id : secId;

      if (!studentPlanId) {
        throw new Error("Student Plan ID is not defined.");
      }

      const payload = { plans };
      console.log("Payload being sent:", payload);

      const response = await axios.put(
        `http://localhost:3000/api/updateStudentPlan/${studentPlanId}`,
        payload
      );

      console.log("Update response:", response.data);

      await refreshPlans();

      setEditingPlan(null);
      setFormData({
        course_id: "",
        year: "",
        semester: "",
      });
    } catch (error) {
      console.error("Error updating student plans:", error);
    }
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
            <tr>
              <th className="py-2 px-4 border-b">รหัสวิชา</th>
              <th className="py-2 px-4 border-b">ชื่อวิชา</th>
              <th className="py-2 px-4 border-b">ปีการศึกษา</th>
              <th className="py-2 px-4 border-b">เทอม</th>
              <th className="py-2 px-4 border-b">หน่วยกิต</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="py-2 px-4 border-b">{plan.course_id}</td>
                <td className="py-2 px-4 border-b">
                  {courses.find((course) => course.course_id === plan.course_id)
                    ?.courseNameTH || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">{plan.year}</td>
                <td className="py-2 px-4 border-b">{plan.semester}</td>
                <td className="py-2 px-4 border-b">
                  {courses.find((course) => course.course_id === plan.course_id)
                    ?.courseUnit || "N/A"}
                </td>
                <td className="py-2 px-4 border-b flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="px-4 py-2 bg-red text-white rounded hover:bg-gray-200 hover:text-black"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteClick(plan.id)}
                    className="px-4 py-2 bg-red text-white rounded hover:bg-gray-200 hover:text-black"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingPlan && (
          <form onSubmit={handleSubmit} className="mt-6">
            <h2 className="text-lg font-bold mb-4 text-red">แก้ไขรายวิชา</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700">
                  รายวิชา
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                  >
                    <option value="">ค้นหารายวิชา</option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.courseNameTH}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="block text-gray-700">
                  ปีการศึกษา
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="2020"
                    max="2100"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700">
                  เทอม
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red text-white rounded"
                onClick={handleSubmit}
              >
                บันทึก
              </button>
            </div>
          </form>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
            onClick={() => navigate("/studentplan")}
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentPlan;
