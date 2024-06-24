import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseCategory = () => {
    const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: "วิศวกรรมซอฟต์แวร์", code: "644259009" },
    { id: 2, name: "วิศวกรรมคอมพิวเตอร์", code: "644259010" },
    { id: 3, name: "วิศวกรรมไฟฟ้า", code: "644259011" },
  ]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [instructorName, setInstructorName] = useState("");

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleInstructorNameChange = (e) => {
    setInstructorName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      `Selected Course: ${selectedCourse}, Instructor Name: ${instructorName}`
    );
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มหลักสูตร</p>
      </div>
      <div className=" min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full ">
          <h1 className="text-2xl text-red font-bold mb-6 ">เพิ่มหลักสูตร</h1>
          <div className="border-m mb-6 pb-3 ">
            <ul className="flex">
              <li className="mr-4" onClick={() => navigate("/addcourse")}>
                <a href="#" className=" border-b-2 border-red-600">
                  ชื่อหลักสูตร
                </a>
              </li>
              <li className="mr-4" onClick={() => navigate("/advicecourse")}>
                <a href="#" className="text-gray-600">
                  เพิ่มอาจารย์
                </a>
              </li>
              <li className="mr-4" onClick={() => navigate("/coursecategory")}>
                <a href="#" className="text-gray-600">
                  เพิ่มหมวดวิชา
                </a>
              </li>
              <li className="mr-4" onClick={() => navigate("/coursegroup")}>
                <a href="#" className="text-gray-600">
                  เพิ่มกลุ่มวิชา
                </a>
              </li>
              <li onClick={() => navigate("/coursesincourses")}>
                <a href="#" className="text-gray-600">
                  เพิ่มรายวิชา
                </a>
              </li>
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <select
                id="class"
                className="dropdown appearance-none w-30 mt-1 bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                value={selectedCourse}
                onChange={handleCourseChange}
              >
                <option value="">เลือกหลักสูตร</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col col-span-2">
                <label className="mb-2">ชื่อหมวดวิชา</label>
                <input
                  type="text"
                  className="border rounded-full px-2 py-2"
                  value={instructorName}
                  onChange={handleInstructorNameChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">จำนวนหน่วยกิต</label>
                <input
                  type="number"
                  className="border rounded-full px-2 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                onClick={() => navigate("/coursegroup")}
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseCategory;
