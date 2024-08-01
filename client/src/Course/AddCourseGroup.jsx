import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCourseGroup = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formData, setFormData] = useState({
    selectedCourse: "",
    selectedCategory: "",
    groupName: "",
    groupUnit: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/getallMajors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCourses(data.majors || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const fetchCategoriesByMajorId = async (majorId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/categories/major/${majorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setFilteredCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupUnit") {
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

    if (name === "selectedCourse") {
      fetchCategoriesByMajorId(value);
      setFormData({
        ...formData,
        selectedCourse: value,
        selectedCategory: "",
        groupName: "",
        groupUnit: "",
      });
    } else if (name === "selectedCategory") {
      setFormData({
        ...formData,
        selectedCategory: value,
        groupName: "",
        groupUnit: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          group: {
            groupName: formData.groupName,
            groupUnit: formData.groupUnit,
            categoryId: parseInt(formData.selectedCategory, 10),
          },
        }),
      });

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="mb-2">เลือกหลักสูตร</label>
      </div>
      <div className="relative mb-6">
        <select
          name="selectedCourse"
          className="dropdown appearance-none text-gray-500 w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
          value={formData.selectedCourse}
          onChange={handleChange}
        >
          <option value="">เลือกหลักสูตร</option>
          {Array.isArray(courses) &&
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.majorNameTH}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="mb-2">เลือกหมวดวิชา</label>
      </div>
      <div className="relative mb-6">
        <select
          name="selectedCategory"
          className="dropdown appearance-none text-gray-500 w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
          value={formData.selectedCategory}
          onChange={handleChange}
          disabled={!formData.selectedCourse} // ปิดการใช้งานถ้าไม่ได้เลือกหลักสูตร
        >
          <option value="">เลือกหมวดวิชา</option>
          {Array.isArray(filteredCategories) &&
            filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col col-span-2">
          <label className="mb-2">ชื่อกลุ่มวิชา</label>
          <input
            type="text"
            name="groupName"
            className="border rounded-lg px-2 py-2"
            value={formData.groupName}
            onChange={handleChange}
            disabled={!formData.selectedCategory} // ปิดการใช้งานถ้าไม่ได้เลือกหมวดวิชา
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2">จำนวนหน่วยกิต</label>
          <input
            type="number"
            name="groupUnit"
            className="border rounded-lg px-2 py-2"
            value={formData.groupUnit}
            onChange={handleChange}
            min="0"
            disabled={!formData.selectedCategory} // ปิดการใช้งานถ้าไม่ได้เลือกหมวดวิชา
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
          onClick={() => updateQueryString("addCourseCategory")}
        >
          ย้อนกลับ
        </button>
        <button
          type="submit"
          className="px-8 py-2 bg-red border border-red text-white rounded"
        >
          บันทึก
        </button>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
          <p className="py-4 text-gray-500">
            กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
          </p>
          <div className="modal-action flex justify-between">
            <form method="dialog" className="w-full flex justify-between">
              <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                ปิด
              </button>
              <button
                className="px-8 py-2 bg-red border border-red text-white rounded"
                onClick={() => updateQueryString("addSubject")}
              >
                ถัดไป
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </form>
  );
};

export default AddCourseGroup;
