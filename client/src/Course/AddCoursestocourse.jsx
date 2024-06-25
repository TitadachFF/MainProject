import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCoursestocourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: "หมวดวิชาศึกษาทั่วไป" },
    { id: 2, name: "หมวดเลือกเสรี" },
  ]);

  const [groups, setGroups] = useState([
    { id: 1, name: "กลุ่มวิชาแกน" },
    { id: 2, name: "กลุ่มวิชาเลือก" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [instructorName, setInstructorName] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleInstructorNameChange = (e) => {
    setInstructorName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `Selected Category: ${selectedCategory}, Selected Group: ${selectedGroup}, Instructor Name: ${instructorName}`
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
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  ชื่อหลักสูตร
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  เพิ่มอาจารย์
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  เพิ่มหมวดวิชา
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  เพิ่มกลุ่มวิชา
                </a>
              </li>
              <li>
                <a href="#" className="text-red-600 border-b-2 border-red-600">
                  เพิ่มรายวิชา
                </a>
              </li>
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col">
                <select
                  id="category"
                  className="dropdown appearance-none w-full bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">เลือกหมวดวิชา</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <select
                  id="group"
                  className="dropdown appearance-none w-full bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                  value={selectedGroup}
                  onChange={handleGroupChange}
                >
                  <option value="">เลือกกลุ่มวิชา</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="mb-2">ชื่อกลุ่มวิชา</label>
                <input
                  type="text"
                  className="border rounded-full px-2 py-2 w-full"
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
                onClick={() => navigate("/addcourse")}
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
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

export default AddCoursestocourse;
