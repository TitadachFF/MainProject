import React, { useState } from "react";

const Course = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "วิศวกรรมซอฟต์แวร์",
      nameeng: "software engineer",
      code: "644259009",
      year: "64/46",
      unit: "58",
      advice: "นายวรเชษฐ์ อุทธา",
    },
  ]);

  const [course, setCourse] = useState(courses[0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  const handleSave = () => {
    setCourses([course]);

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
        <p>ดูหลักสูตร</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto flex justify-center items-center h-screen">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
            <h1 className="text-2xl text-red font-bold mb-6 text-red-600">
              แก้ไขหลักสูตร
            </h1>
            <form>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">ชื่อหลักสูตร(ภาษาไทย)</label>
                  <input
                    type="text"
                    name="name"
                    value={course.name}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    name="nameeng"
                    value={course.nameeng}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">รหัสหลักสูตร</label>
                  <input
                    type="text"
                    name="code"
                    value={course.code}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">หลักสูตรปี</label>
                  <input
                    type="text"
                    name="year"
                    value={course.year}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    name="unit"
                    value={course.unit}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">อาจารย์ผู้รับผิดชอบหลักสูตร</label>
                  <input
                    type="text"
                    name="advice"
                    value={course.advice}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-2"
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
                  type="button"
                  onClick={handleSave}
                  className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
