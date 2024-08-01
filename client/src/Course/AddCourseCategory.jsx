import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCourseCategory = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryUnit: "",
    majorID: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryUnit") {
      // ตรวจสอบว่าจำนวนหน่วยกิตไม่ติดลบ
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

    // ตรวจสอบข้อมูลที่กรอก
    console.log("Selected Course:", selectedCourse);
    console.log("Form Data:", formData);

    // ตรวจสอบให้แน่ใจว่ามีการเลือกหลักสูตรและกรอกข้อมูลครบถ้วน
    if (!selectedCourse || !formData.categoryName || !formData.categoryUnit) {
      console.error("กรุณากรอกข้อมูลให้ครบถ้วนและเลือกหลักสูตร");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/createCategory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: {
            majorId: parseInt(selectedCourse, 10), // แปลง `selectedCourse` เป็นจำนวนเต็ม
            categoryName: formData.categoryName,
            categoryUnit: formData.categoryUnit,
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
        setCourses(data.majors || []); // กำหนดค่า default เป็นอาร์เรย์ว่าง
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleInstructorNameChange = (e) => {
    setInstructorName(e.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "addCourse";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="mb-2">เลือกหลักสูตร</label>
        </div>
        <div className="relative mb-6">
          <select
            id="class"
            name="majorID"
            className="dropdown appearance-none w-full mt-1 text-gray-400 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
            value={selectedCourse}
            onChange={handleCourseChange}
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อหมวดวิชา</label>
            <input
              type="text"
              name="categoryName"
              className="border rounded-lg px-2 py-2"
              value={formData.categoryName}
              onChange={handleChange}
              disabled={!selectedCourse} // ปิดการใช้งานถ้าไม่ได้เลือกหลักสูตร
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <input
              type="number"
              name="categoryUnit"
              className="border rounded-lg px-2 py-2"
              value={formData.categoryUnit}
              onChange={handleChange}
              min="0"
              disabled={!selectedCourse} // ปิดการใช้งานถ้าไม่ได้เลือกหลักสูตร
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => updateQueryString("addCourse")}
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
      </form>

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
                onClick={() => updateQueryString("addCourseGroup")}
              >
                ถัดไป
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddCourseCategory;
