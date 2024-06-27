import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudentplan = () => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const data = {
    categories: {
      หมวดวิชาเฉพาะ: {
        วิชาแกน: ["คณิตศาสตร์ดีสครีต", "พีชคณิตเชิงเส้น"],
        วิชาเฉพาะด้านบังคับ: ["การบริหารและการจัดการฐานข้อมูล","การจัดการโครงการซอฟต์แวร์"],
        วิชาเฉพาะด้านเลือก: ["การพัฒนาโปรแกรมประยุกต์ฐานข้อมูล","เทคโนโลยีบล็อกเชน"],
      },
      หมวดวิชาศึกษาทั่วไป: {
        ภาษาและการสื่อสาร: ["การสื่อสารอย่างผู้นำ", "ภาษาอังกฤษเพื่อการสื่อสาร"],
        สังคมศาสตร์: ["สีสันแห่งชีวิต", "ปรัชญาเศรษฐกิจพอเพียง"],
      },
    },
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedGroup("");
    setSelectedCourse("");
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setSelectedCourse("");
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleAddCourseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory("");
    setSelectedGroup("");
    setSelectedCourse("");
  };

  const getGroups = () => {
    if (selectedCategory) {
      return Object.keys(data.categories[selectedCategory]);
    }
    return [];
  };

  const getCourses = () => {
    if (selectedCategory && selectedGroup) {
      return data.categories[selectedCategory][selectedGroup];
    }
    return [];
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center p-6">
      <div className="container mx-auto flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-red-600">แผนการเรียน</h1>

          <form className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col col-span-2">
              <label className="mb-2">ชื่อแผนการเรียน</label>
              <input
                type="text"
                className="border rounded-full px-2 py-2"
                placeholder="ชื่อแผนการเรียน"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">ปีการศึกษา</label>
              <input
                type="text"
                className="border rounded-full px-2 py-2"
                placeholder="ปีการศึกษา"
              />
            </div>
          </form>

          <div className="border-b mb-6 pb-3">
            <ul className="flex">
              <li className="mr-4">
                <a href="#" className="text-red-600 border-b-2 border-red-600">
                  ปี 1
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  ปี 2
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  ปี 3
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-gray-600">
                  ปี 4
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <select
              className="border rounded-full px-2 py-1 text-sm w-20"
              value={selectedTerm}
              onChange={handleTermChange}
            >
              <option value=""> เทอม </option>
              <option value="1">เทอม 1</option>
              <option value="2">เทอม 2</option>
            </select>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-8 py-1 bg-red border border-red text-white rounded-full"
              onClick={handleAddCourseClick}
            >
              เพิ่มรายวิชา
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
                className="border rounded-full px-2 py-2 w-full mb-4"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">เลือกหมวดวิชา</option>
                {Object.keys(data.categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
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
                {getGroups().map((group) => (
                  <option key={group} value={group}>
                    {group}
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
                {getCourses().map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-black rounded-full mr-2"
                onClick={handleCloseModal}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red text-white rounded-full"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudentplan;
