import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([
    { id: 1, name: "วิศวกรรมซอฟต์แวร์", code: "644259009" },
    { id: 2, name: "วิศวกรรมคอมพิวเตอร์", code: "644259010" },
    { id: 3, name: "วิศวกรรมไฟฟ้า", code: "644259011" },
  ]);

  const [groups, setgroups] = useState([
    { id: 1, name: "หมวดวิชาศึกษาทั่วไป" },
    { id: 2, name: "หมวดวิชาแกน" },
  ]);
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };
  const [categories, setCategories] = useState([
    { id: 1, name: "หมวดวิชาศึกษาทั่วไป" },
    { id: 2, name: "หมวดเลือกเสรี" },
  ]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
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

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "addCourse";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
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
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full">
          <h1 className="text-2xl text-red font-bold mb-6">เพิ่มหลักสูตร</h1>
          <div className="border-m mb-6 pb-3">
            <ul className="flex">
              <li
                className="mr-4"
                onClick={() => updateQueryString("addCourse")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addCourse" ? "border-red" : "text-gray-600"
                  }`}
                >
                  ชื่อหลักสูตร
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("addTeacher")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addTeacher"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  เพิ่มอาจารย์
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("addCourseCategory")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addCourseCategory"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  เพิ่มหมวดวิชา
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("addCourseGroup")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addCourseGroup"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  เพิ่มกลุ่มวิชา
                </a>
              </li>
              <li onClick={() => updateQueryString("addSubject")}>
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addSubject"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  เพิ่มรายวิชา
                </a>
              </li>
            </ul>
          </div>
          {/* เพิ่มหลักสูตร */}
          {currentForm === "addCourse" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">ชื่อหลักสูตร(ภาษาไทย)</label>
                  <input type="text" className="border rounded-lg px-2 py-2" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
                  <input type="text" className="border rounded-lg px-2 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">รหัสหลักสูตร</label>
                  <input type="text" className="border rounded-lg px-2 py-2" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">หลักสูตรปี</label>
                  <input type="text" className="border rounded-lg px-2 py-2" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                  onClick={() => navigate("/course")}
                >
                  ย้อนกลับ
                </button>
                {/* Modal */}
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                      <form
                        method="dialog"
                        className="w-full flex justify-between"
                      >
                        {/* if there is a button in form, it will close the modal */}
                        <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                          ปิด
                        </button>
                        <button
                          className="px-8 py-2 bg-red border border-red text-white rounded"
                          onClick={() => updateQueryString("addTeacher")}
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
          )}
          {/* เพิ่มอาจารย์ */}
          {currentForm === "addTeacher" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-2">เลือกหลักสูตร</label>
                  <div className="relative mb-6">
                    <select
                      id="class"
                      className="dropdown appearance-none w-30 mt-1 text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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
                  <label className="mb-2">ชื่ออาจารย์</label>
                  <input type="text" className="border rounded-lg px-2 py-2" />
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

                {/* Modal */}
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                      <form
                        method="dialog"
                        className="w-full flex justify-between"
                      >
                        {/* if there is a button in form, it will close the modal */}
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
                {/* End Modal */}
              </div>
            </form>
          )}
          {/* You can add more conditional forms here for other cases */}
          {/* เพิ่มหมวดวิชา */}
          {currentForm === "addCourseCategory" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="mb-2">เลือกหลักสูตร</label>
              </div>
              <div className="relative mb-6">
                <select
                  id="class"
                  className="dropdown appearance-none w-30 mt-1 text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-2"
                  />
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
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                      <form
                        method="dialog"
                        className="w-full flex justify-between"
                      >
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
          )}
          {/* เพิ่มกลุ่มวิชา */}
          {currentForm === "addCourseGroup" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="mb-2">เลือกหมวดวิชา</label>
              </div>
              <div className="relative mb-6">
                <select
                  id="class"
                  className="dropdown appearance-none text-gray-500 w-30 mt-1 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                >
                  <option value="">เลือกหมวดวิชา</option>
                  {groups.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col col-span-2">
                  <label className="mb-2">ชื่อกลุ่มวิชา</label>
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-2"
                    value={instructorName}
                    onChange={handleInstructorNameChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-2"
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
                {/* Modal */}
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                      <form
                        method="dialog"
                        className="w-full flex justify-between"
                      >
                        {/* if there is a button in form, it will close the modal */}
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
                {/* End Modal */}
              </div>
            </form>
          )}
          {/* เพิ่มรายวิชา  */}
          {currentForm === "addSubject" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <div className="mb-3">เลือกหมวดวิชา</div>
                  <select
                    id="category"
                    className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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
                <div className="flex flex-col mb-2">
                  <div className="mb-3">เลือกกลุ่มวิชา</div>

                  <select
                    id="group"
                    className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
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
                    className="border rounded-lg px-2 py-2 w-full"
                    value={instructorName}
                    onChange={handleInstructorNameChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-2"
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
                {/* Modal */}
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                      <form
                        method="dialog"
                        className="w-full flex justify-between"
                      >
                        {/* if there is a button in form, it will close the modal */}
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
                {/* End Modal */}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
