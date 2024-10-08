import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const [formData, setFormData] = useState({
    selectedCourse: "",
    selectedCategory: "",
    selectedGroup: "",
    courseCode: "",
    courseNameTH: "",
    courseNameENG: "",
    courseUnit: 0,
    courseTheory: 0,
    coursePractice: 0,
    categoryResearch: 0,
  });
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}api/getAllMajors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.selectedCourse) {
      const fetchCategoriesByMajorCode = async (major_code) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${apiUrl}api/getCategoriesByMajorCode/${major_code}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch Categories");
          }

          const data = await response.json();
          setFilteredCategories(data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategoriesByMajorCode(formData.selectedCourse);
    } else {
      setFilteredCategories([]);
    }
  }, [formData.selectedCourse]);

  useEffect(() => {
    if (formData.selectedCategory) {
      const fetchGroupsByCategoryId = async (category_id) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${apiUrl}api/getGroupsByCategoryId/${category_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setGroups(data || []);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };

      fetchGroupsByCategoryId(formData.selectedCategory);
    } else {
      setGroups([]);
    }
  }, [formData.selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "courseUnit" ||
      name === "courseTheory" ||
      name === "coursePractice" ||
      name === "categoryResearch"
    ) {
      if (value >= 0) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.selectedCategory ||
      !formData.selectedGroup ||
      !formData.courseCode ||
      !formData.courseNameTH ||
      !formData.courseNameENG
    ) {
      document.getElementById("my_modal_1").showModal();
      setMessage("* กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      setIsSuccess(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}api/createCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: formData.courseCode,
          courseNameTH: formData.courseNameTH,
          courseNameENG: formData.courseNameENG,
          courseTheory: parseInt(formData.courseTheory),
          coursePractice: parseInt(formData.coursePractice),
          categoryResearch: parseInt(formData.categoryResearch),
          courseUnit: parseInt(formData.courseUnit),
          major_id: parseInt(formData.selectedCourse),
          category_id: parseInt(formData.selectedCategory),
          group_id: parseInt(formData.selectedGroup),
        }),
      });

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
        setIsSuccess(true);
        setMessage("เพิ่มวิชาสำเร็จ!");
      } else {
        console.error("Failed to submit course data");
        setIsSuccess(false);
        setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
        document.getElementById("my_modal_1").showModal();
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
      setIsSuccess(false);
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      document.getElementById("my_modal_1").showModal();
    }
  };

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">เลือกหลักสูตร</label>
            <select
              name="selectedCourse"
              id="course"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={formData.selectedCourse}
              onChange={handleChange}
            >
              <option value="">เลือกหลักสูตร</option>
              {courses.map((course) => (
                <option key={course.id} value={course.major_code}>
                  {course.majorNameTH}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">เลือกหมวดวิชา</label>
            <select
              name="selectedCategory"
              id="category"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={formData.selectedCategory}
              onChange={handleChange}
              disabled={!formData.selectedCourse}
            >
              <option value="">เลือกหมวดวิชา</option>
              {filteredCategories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-2">
            <label className="mb-2">เลือกกลุ่มวิชา</label>
            <select
              name="selectedGroup"
              id="group"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={formData.selectedGroup}
              onChange={handleChange}
              disabled={!formData.selectedCategory}
            >
              <option value="">เลือกกลุ่มวิชา</option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">รหัสวิชา</label>
            <input
              name="courseCode"
              type="text"
              className="border rounded-lg px-2 py-2"
              value={formData.courseCode}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อรายวิชา(ภาษาไทย)</label>
            <input
              name="courseNameTH"
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={formData.courseNameTH}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อรายวิชา(English)</label>
            <input
              name="courseNameENG"
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={formData.courseNameENG}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">น (หน่วยกิต)</label>
            <input
              name="courseUnit"
              type="number"
              className="border rounded-lg px-2 py-2"
              value={formData.courseUnit}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2">ท (ทฤษฎี)</label>
            <input
              name="courseTheory"
              type="number"
              className="border rounded-lg px-2 py-2"
              value={formData.courseTheory}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ป (ปฏิบัติ)</label>
            <input
              name="coursePractice"
              type="number"
              className="border rounded-lg px-2 py-2"
              value={formData.coursePractice}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ค (ค้นคว้าอิสระ)</label>
            <input
              name="categoryResearch"
              type="number"
              className="border rounded-lg px-2 py-2"
              value={formData.categoryResearch}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => updateQueryString("addCourseGroup")}
          >
            ย้อนกลับ
          </button>
          <button
            className="px-8 py-2 bg-red border border-red text-white rounded"
            type="submit"
          >
            บันทึก
          </button>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{message}</h3>
            <p className="py-4 text-gray-500">
              กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
            </p>
            <div className="modal-action flex justify-between">
              <form method="dialog" className="w-full flex justify-between">
                <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                  ปิด
                </button>
                {isSuccess && ( // แสดงปุ่ม "ถัดไป" เฉพาะเมื่อข้อมูลครบถ้วน
                  <button
                    className="px-8 py-2 bg-red border border-red text-white rounded"
                    onClick={() => navigate("/course")}
                  >
                    หน้าแรก
                  </button>
                )}
              </form>
            </div>
          </div>
        </dialog>
      </form>
    </div>
  );
};

export default AddSubject;