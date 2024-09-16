import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditCourse = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]); // เพิ่ม state สำหรับ groups
  const [editingCourse, setEditingCourse] = useState(null);

  const navigate = useNavigate();

  const handleDeleteCourse = async (course_id) => {
    const confirmDelete = window.confirm("คุณต้องการลบวิชานี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/deleteCourse/${course_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete course ${course_id}`);
      }
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.course_id !== course_id)
      );
      alert("ลบวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("เกิดข้อผิดพลาดในการลบวิชา.");
    }
  };

  useEffect(() => {
    const fetchCoursesByCategoryId = async (category_id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getCoursesByCategoryId/${category_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Courses");
        }
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error("Error fetching Courses:", error);
        return [];
      }
    };

    const fetchGroupsByCategoryId = async (category_id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getGroupsByCategoryId/${category_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Groups");
        }
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error("Error fetching Groups:", error);
        return [];
      }
    };

    const fetchMajorAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const majorResponse = await fetch(
          `http://localhost:3000/api/getMajorByCode/${major_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!majorResponse.ok) {
          throw new Error("Failed to fetch Major data");
        }
        const majorData = await majorResponse.json();
        setMajor(majorData);

        const categoriesResponse = await fetch(
          `http://localhost:3000/api/getCategoriesByMajorCode/${major_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch Categories data");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch courses and groups for each category
        const allCourses = await Promise.all(
          categoriesData.map((category) =>
            fetchCoursesByCategoryId(category.category_id)
          )
        );
        const allGroups = await Promise.all(
          categoriesData.map((category) =>
            fetchGroupsByCategoryId(category.category_id)
          )
        );

        setCourses(allCourses.flat());
        setGroups(allGroups.flat()); // Combine all groups into one array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (major_code) {
      fetchMajorAndCategories();
    }
  }, [major_code]);

  const handleEditCourseClick = (course) => {
    setEditingCourse(course);
  };

  const handleSaveCourseChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/updateCourse/${editingCourse.course_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingCourse),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update Course ${editingCourse.course_id}`);
      }
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_id === editingCourse.course_id ? editingCourse : course
        )
      );
      setEditingCourse(null); // Close modal
      alert("อัพเดตข้อมูลวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error updating course data:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูลวิชา.");
    }
  };

  const handleBack = () => {
    navigate(`/editMajor?editMajor=${major_code}`);
  };

  if (!major) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        {/* Breadcumbs */}
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/allcourse")}>
          ดูหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>แก้ไขหมวดวิชา</p>
      </div>
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold">แก้ไขวิชา</h2>
          <p className="text-red px-2 font-semibold py-2">
            หลักสูตร {major.major_code} {major.majorNameTH}
          </p>
          <div className="grid grid-cols-1 py-2 gap-2">
            {courses.map((course) => {
              // หาหมวดหมู่และกลุ่มที่เกี่ยวข้องกับรายวิชา
              const courseCategory = categories.find(
                (category) => category.category_id === course.category_id
              );
              const courseGroup = groups.find(
                (group) => group.group_id === course.group_id
              ); // ค้นหากลุ่มตาม group_id

              return (
                <div
                  key={course.course_id}
                  className="border border-gray-300 rounded-md p-1"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="text-gray-700 font-semibold">
                        {course.course_id}
                      </span>
                      <span className="text-gray-700 ">
                        {course.courseNameTH}
                        <p>{course.courseNameENG}</p>
                      </span>
                      <span className="text-gray-500">
                        น(ท-ป-ค): {course.courseUnit}({course.courseTheory}-
                        {course.coursePractice}-{course.categoryResearch})
                      </span>
                    </div>
                    {/* เพิ่ม badge สำหรับหมวดหมู่และกลุ่ม */}
                    <div className="flex space-x-2">
                      {courseCategory && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                          {courseCategory.category_name}
                        </span>
                      )}
                      {courseGroup && (
              <span className="bg-green-700 text-white px-2 py-1 rounded-full text-xs">
                          กลุ่ม {courseGroup.group_name}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={() => handleEditCourseClick(course)}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        className="bg-red text-white px-4 py-2 rounded hover:bg-orange-700"
                        onClick={() => handleDeleteCourse(course.course_id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between py-2">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border rounded"
              onClick={handleBack}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
      {/* Modal for editing course */}
      {editingCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">แก้ไขวิชา</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อวิชา
              </label>
              <input
                type="text"
                name="courseNameTH"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.courseNameTH}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseNameTH: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อวิชาภาษาอังกฤษ
              </label>
              <input
                type="text"
                name="courseNameENG"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.courseNameENG}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseNameENG: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                หน่วยกิต
              </label>
              <input
                type="number"
                name="courseUnit"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.courseUnit}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseUnit: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ทฤษฏี
              </label>
              <input
                type="number"
                name="courseTheory"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.courseTheory}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseTheory: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ปฏิบัติ
              </label>
              <input
                type="number"
                name="coursePractice"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.coursePractice}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    coursePractice: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ค้นคว้า
              </label>
              <input
                type="number"
                name="categoryResearch"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCourse.categoryResearch}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    categoryResearch: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-white px-4 py-2 rounded"
                onClick={() => setEditingCourse(null)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveCourseChanges}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
