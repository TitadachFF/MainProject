import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddListplan = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [studentplanId, setStudentplanId] = useState(""); // State for selected student plan
  const [studentPlans, setStudentPlans] = useState([]); // State for student plans

  useEffect(() => {
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
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched categories data:", data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStudentPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/getStudentplanByAcademic",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched student plans data:", data);
        if (Array.isArray(data)) {
          setStudentPlans(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching student plans:", error.message);
      }
    };

    fetchStudentPlans();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/getGroupsByCategoryId/${selectedCategory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          console.log("Fetched groups data:", data);
          if (Array.isArray(data)) {
            setGroups(data);
          } else {
            console.error("Unexpected API response:", data);
          }
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      } else {
        setGroups([]);
      }
    };

    fetchGroups();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedGroup) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/getCoursesByGroupId/${selectedGroup}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          console.log("Fetched courses data:", data);
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            console.error("Unexpected API response:", data);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        setCourses([]);
      }
    };

    fetchCourses();
  }, [selectedGroup]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedGroup(""); // Clear selected group when category changes
    setSelectedCourse(""); // Clear selected course when category changes
    console.log("Selected category:", category);
  };

  const handleGroupChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    setSelectedCourse(""); // Clear selected course when group changes
    console.log("Selected group:", group);
  };

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    console.log("Selected course:", course);
  };

  const handleAddCourseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (selectedCourse) {
      const selectedCourseData = courses.find(
        (course) => course.course_id === selectedCourse
      );
      if (selectedCourseData) {
        setSelectedCourses((prevCourses) => [
          ...prevCourses,
          {
            courseId: selectedCourseData.course_id,
            courseName: selectedCourseData.courseNameTH,
            courseUnit: selectedCourseData.courseUnit,
            courseTheory: selectedCourseData.courseTheory || "0",
            coursePractice: selectedCourseData.coursePractice || "0",
            categoryResearch: selectedCourseData.categoryResearch || "0",
          },
        ]);
        console.log("Added course:", selectedCourseData);
      }
    }
    setShowModal(false);
    setSelectedCategory("");
    setSelectedGroup("");
    setSelectedCourse("");
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const courses = selectedCourses.map((course) => course.courseId);

      console.log("กำลังส่งแผนการเรียนพร้อมข้อมูล:", {
        studentplan_id: studentplanId, 
        course_id: courses,
      });

      if (!studentplanId || !courses) {
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      // Send each course separately
      for (const courseId of courses) {
        const response = await fetch(
          `http://localhost:3000/api/createListStudentplan/${studentplanId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course_id: courseId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("การตอบสนองของเซิร์ฟเวอร์:", errorData);
          throw new Error("ไม่สามารถสร้างแผนการเรียนได้");
        }

        const data = await response.json();
        console.log("สร้างแผนการเรียนสำเร็จ:", data);
      }

      navigate("/studentplan");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างแผนการเรียน:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg">
      <h1 className="mb-6 text-black">เพิ่มรายวิชาในแผน</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Student Plan</label>
        <select
          value={studentplanId}
          onChange={(e) => setStudentplanId(e.target.value)}
          className="border rounded-full px-2 py-2 w-full"
        >
          <option value="">เลือกแผนการเรียน</option>
          {studentPlans.map((plan) => (
            <option key={plan.studentplan_id} value={plan.studentplan_id}>
              แผนการเรียนปีการศึกษา {plan.year}{" "}
              {/* Display academic year or other relevant info */}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-gray-300 p-4 rounded-lg">
        {/* Display Selected Courses */}
        {selectedCourses.length > 0 && (
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg">
              <ul className="space-y-4">
                {selectedCourses.map((course) => (
                  <li
                    key={course.courseId}
                    className="flex items-center justify-between p-2 border-b border-gray-200"
                  >
                    <div className="flex items-center">
                      <span className="mr-4 text-lg font-semibold">
                        {course.courseId}
                      </span>
                      <span className="mr-4 text-lg">{course.courseName}</span>
                    </div>
                    <span className="bg-red text-white px-3 py-1 rounded-full text-sm font-medium">
                      {course.courseUnit} ( {course.courseTheory} -{" "}
                      {course.coursePractice} - {course.categoryResearch} )
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-2 bg-red border border-red text-white rounded-full"
            onClick={handleAddCourseClick}
          >
            เพิ่มรายวิชา
          </button>
        </div>
        {/* ปุ่มส่งข้อมูล */}
      </div>
      <div className="col-span-3 mt-6 flex justify-between">
        <button
          type="button"
          className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
          onClick={() => navigate("/addstudentplan")}
        >
          ย้อนกลับ
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-red text-white rounded"
        >
          ส่งแผนการเรียน
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">เลือกรายวิชา</h2>
            <div className="mb-4">
              <select
                className="border rounded-full px-2 py-2 w-full mb-4 text-black bg-white"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">เลือกหมวดวิชา</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <select
                className="border rounded-full px-2 py-2 w-full mb-4"
                value={selectedGroup}
                onChange={handleGroupChange}
                disabled={!selectedCategory}
              >
                <option value="">เลือกกลุ่มวิชา</option>
                {groups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <select
                className="border rounded-full px-2 py-2 w-full mb-4"
                value={selectedCourse}
                onChange={handleCourseChange}
                disabled={!selectedGroup}
              >
                <option value="">เลือกรายวิชา</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.courseNameTH}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red text-white rounded-full mr-2"
                onClick={handleCloseModal}
              >
                บันทึก
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-full"
                onClick={handleCloseModal}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListplan;
