import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCourseCategory = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [instructorName, setInstructorName] = useState("");

  const handleInstructorNameChange = (e) => {
    setInstructorName(e.target.value);
  };
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };
  const [courses, setCourses] = useState([
    { id: 1, name: "วิศวกรรมซอฟต์แวร์", code: "644259009" },
    { id: 2, name: "วิศวกรรมคอมพิวเตอร์", code: "644259010" },
    { id: 3, name: "วิศวกรรมไฟฟ้า", code: "644259011" },
  ]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `Selected Category: ${selectedCategory}, Selected Group: ${selectedGroup}, Instructor Name: ${instructorName}`
    );
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
          <label className="mb-2">เลือกหลักสูตร </label>
        </div>
        <div className="relative mb-6">
          <select
            id="class"
            className="dropdown appearance-none w-30 mt-1 text-gray-400 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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
              className="border rounded-lg px-2 py-2"
              value={instructorName}
              onChange={handleInstructorNameChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <input type="number" className="border rounded-lg px-2 py-2" />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => updateQueryString("addTeacher")}
          >
            ย้อนกลับ
          </button>
          {/* Modal */}
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
                  {/* if there is a button in form, it will close the modal */}
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
          {/* End Modal */}
        </div>
      </form>
    </div>
  );
};

export default AddCourseCategory;
