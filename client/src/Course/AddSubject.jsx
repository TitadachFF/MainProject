import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseNameTH, setCourseNameTH] = useState("");
  const [courseNameENG, setCourseNameENG] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [courseUnit, setCourseUnit] = useState("");
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGroupsByCategoryId = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/group/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setSelectedCourse(value);
    setSelectedCategory("");
    setSelectedGroup("");
    fetchCategoriesByMajorId(value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedGroup("");
    fetchGroupsByCategoryId(value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleCourseCodeChange = (e) => {
    setCourseCode(e.target.value);
  };

  const handleCourseNameTHChange = (e) => {
    setCourseNameTH(e.target.value);
  };

  const handleCourseNameENGChange = (e) => {
    setCourseNameENG(e.target.value);
  };

  const handleCourseYearChange = (e) => {
    setCourseYear(e.target.value);
  };

  const handleCourseUnitChange = (e) => {
    setCourseUnit(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const courseData = {
      courseCode,
      courseNameTH,
      courseNameENG,
      courseYear,
      courseUnit: parseInt(courseUnit),
      majorId: parseInt(selectedCourse),
      categoryId: parseInt(selectedCategory),
      groupId: parseInt(selectedGroup),
    };

    try {
      const response = await fetch("http://localhost:3000/api/createCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: courseData }),
      });

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
      } else {
        console.error("Failed to submit course data");
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
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
              id="course"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">เลือกหลักสูตร</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.majorNameTH}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">เลือกหมวดวิชา</label>
            <select
              id="category"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={!selectedCourse}
            >
              <option value="">เลือกหมวดวิชา</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-2">
            <label className="mb-2">เลือกกลุ่มวิชา</label>
            <select
              id="group"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedGroup}
              onChange={handleGroupChange}
              disabled={!selectedCategory}
            >
              <option value="">เลือกกลุ่มวิชา</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">รหัสวิชา</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2"
              value={courseCode}
              onChange={handleCourseCodeChange}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อรายวิชา(ภาษาไทย)</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={courseNameTH}
              onChange={handleCourseNameTHChange}
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2">ชื่อรายวิชา(ภาษาอังกฤษ)</label>
          <input
            type="text"
            className="border rounded-lg px-2 py-2"
            value={courseNameENG}
            onChange={handleCourseNameENGChange}
          />
        </div>
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={courseUnit}
              onChange={handleCourseUnitChange}
            >
              <option disabled selected>
                หน่วยกิต
              </option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">(ท ป ค)</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2 h-12"
              value={courseYear}
              onChange={handleCourseYearChange}
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
             onClick={() => navigate("/course")}
           >
             หน้าแรก
           </button>
         </form>
       </div>
     </div>
   </dialog>
 </form>
</div>
);
};

export default AddSubject;
