import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTeacher = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: "วิศวกรรมซอฟต์แวร์", code: "644259009" },
    { id: 2, name: "วิศวกรรมคอมพิวเตอร์", code: "644259010" },
    { id: 3, name: "วิศวกรรมไฟฟ้า", code: "644259011" },
  ]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [instructorNames, setInstructorNames] = useState([""]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleInstructorNameChange = (index, e) => {
    const newInstructorNames = [...instructorNames];
    newInstructorNames[index] = e.target.value;
    setInstructorNames(newInstructorNames);
  };

  const addInstructorField = () => {
    setInstructorNames([...instructorNames, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Selected Course: ${selectedCourse}, Instructor Names: ${instructorNames}`);
  };

  const getQueryStringValue = (key) => {
    return new URLSearchParams(window.location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "addCourse";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">เลือกหลักสูตร</label>
            <div className="relative mb-6">
              <select
                id="class"
                className="dropdown cursor-pointer appearance-none mt-1 text-gray-400 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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

            {instructorNames.map((name, index) => (
              <div key={index}>
                <label className="mb-2">อาจารย์ผู้รับผิดชอบหลักสูตร</label>
                <input
                  type="text"
                  className="border rounded-lg px-2 py-2 mb-2 mt-2 block w-full"
                  value={name}
                  placeholder="ชื่อ-สกุล อาจารย์"
                  onChange={(e) => handleInstructorNameChange(index, e)}
                />
              </div>
            ))}
            <button type="button" className="px-4 py-2 bg-base border border-red text-red rounded mt-2 hover:bg-gray-100" onClick={addInstructorField}>
              เพิ่มอาจารย์ผู้รับผิดชอบหลักสูตร +
            </button>
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
            className="px-8 py-2 bg-red border border-red text-white rounded"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            บักทึก
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
              <p className="py-4 text-gray-500">
                กดปุ่ม ESC หรือ กดปุ่มปิดด้านล้างเพื่อปิด
              </p>
              <div className="modal-action flex justify-between">
                <form method="dialog" className="w-full flex justify-between">
                  <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                    ปิด
                  </button>
                  <button
                    className="px-8 py-2 bg-red border border-red text-white rounded"
                    onClick={() => updateQueryString("addCourseCategory")}
                  >
                    ถัดไป
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
