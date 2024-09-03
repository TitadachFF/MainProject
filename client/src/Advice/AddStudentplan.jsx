import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddStudentplan = () => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [year, setYear] = useState("");

  // Fetch sections from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getSections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched sections data:", data);
        if (Array.isArray(data)) {
          setSections(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

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
        const data = await response.json();
        console.log("Fetched categories data:", data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
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

  const handleTermChange = (e) => {
    const term = e.target.value;
    setSelectedTerm(term);
    console.log("Selected term:", term);
  };

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

  const handleYearChange = (e) => {
    const year = e.target.value;
    setYear(year);
    console.log("Selected year:", year);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const courses = selectedCourses.map((course) => course.courseId);

      // Log data before submission
      console.log("Submitting student plan with data:", {
        sec_id: selectedSection,
        year: year,
        semester: selectedTerm,
        course_ids: courses,
      });

      if (!selectedSection || !year || !selectedTerm) {
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      // Send each course separately
      for (const courseId of courses) {
        const response = await fetch(
          "http://localhost:3000/api/createStudentPlan",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sec_id: parseInt(selectedSection, 10),
              year: year,
              semester: parseInt(selectedTerm, 10),
              course_id: courseId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server response:", errorData);
          throw new Error("Failed to create student plan");
        }

        const data = await response.json();
        console.log("Student plan created:", data);
      }

      navigate("/studentplan");
    } catch (error) {
      console.error("Error creating student plan:", error);
    }
  };


  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
    console.log("Selected section:", section);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center p-6">
      <div className="container mx-auto flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-red">เพิ่มแผนการเรียน</h1>

          <form className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="mb-2">ปีการศึกษา</label>
              <input
                type="text"
                className="border rounded-full px-2 py-2"
                placeholder="ปีการศึกษา"
                value={year} // ใช้ค่า state
                onChange={handleYearChange} // ใช้ handleYearChange เพื่ออัปเดต state
              />
            </div>

            {/* Add Section Dropdown */}
            <div className="flex flex-col">
              <label className="mb-2">ห้องเรียน</label>
              <select
                className="border rounded-full px-2 py-2"
                value={selectedSection} // ใช้ค่า state
                onChange={handleSectionChange} // ใช้ handleSectionChange เพื่ออัปเดต state
              >
                <option value="" disabled>
                  เลือกห้องเรียน
                </option>
                {sections.map((section) => (
                  <option key={section.sec_id} value={section.sec_id}>
                    {section.sec_name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="border border-gray-300 p-4 rounded-lg">
            <div className="flex flex-col mb-4">
              <select
                className="border rounded-full px-2 py-1 text-sm w-20 mb-4"
                value={selectedTerm} // ใช้ค่า state
                onChange={handleTermChange} // ใช้ handleTermChange เพื่ออัปเดต state
              >
                <option value="">เทอม</option>
                <option value="1">เทอม 1</option>
                <option value="2">เทอม 2</option>
              </select>
            </div>

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
                          <span className="mr-4 text-lg">
                            {course.courseName}
                          </span>
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
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
              onClick={() => navigate("/studentplan")}
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              className="px-8 py-2 bg-red text-white rounded"
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
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

export default AddStudentplan;
