import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCourseGroup = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    selectedCourse: "",
    selectedCategory: "",
    group_name: "",
    group_unit: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getAllMajors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);

        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const fetchCategoriesByMajorCode = async (major_code) => {
    console.log("Fetching categories for major_code:", major_code); // ตรวจสอบการเรียกฟังก์ชัน
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/getCategoriesByMajorCode/${major_code}`,
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
      console.log("Fetched Categories data:", data);
      setFilteredCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group_unit") {
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
      const selectedCourseCode = courses.find(
        (course) => course.major_code === value
      )?.major_code;

      if (selectedCourseCode) {
        fetchCategoriesByMajorCode(selectedCourseCode);
      }

      setFormData({
        ...formData,
        selectedCourse: value,
        selectedCategory: "",
        group_name: "",
        group_unit: "",
      });
    } else if (name === "selectedCategory") {
      setFormData({
        ...formData,
        selectedCategory: value,
        group_name: "",
        group_unit: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.selectedCategory ||
      !formData.group_name ||
      !formData.group_unit
    ) {
      document.getElementById("my_modal_1").showModal();
      setMessage("* กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      setIsSuccess(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/createGroupMajor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            group_name: formData.group_name,
            group_unit: parseInt(formData.group_unit),
            category_id: parseInt(formData.selectedCategory),
          }),
        }
      );

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
        setMessage("เพิ่มกลุ่มวิชาสำเร็จ !");
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        document.getElementById("my_modal_1").showModal();
        setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("my_modal_1").showModal();
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      setIsSuccess(false);
    }
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
              <option key={course.id} value={course.major_code}>
                {/* แก้ไขตรงนี้ */}
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
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col col-span-2">
          <label className="mb-2">ชื่อกลุ่มวิชา</label>
          <input
            type="text"
            name="group_name"
            className="border rounded-lg px-2 py-2"
            value={formData.group_name}
            onChange={handleChange}
            disabled={!formData.selectedCategory} // ปิดการใช้งานถ้าไม่ได้เลือกหมวดวิชา
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2">จำนวนหน่วยกิต</label>
          <input
            type="number"
            name="group_unit"
            className="border rounded-lg px-2 py-2"
            value={formData.group_unit}
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
                  onClick={() => updateQueryString("addSubject")}
                >
                  ถัดไป
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </form>
  );
};

export default AddCourseGroup;
