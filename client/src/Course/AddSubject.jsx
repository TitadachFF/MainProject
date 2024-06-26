import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddSubject = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const navigate = useNavigate();
  const handleInstructorNameChange = (e) => {
    setInstructorName(e.target.value);
  };
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const [categories, setCategories] = useState([
    { id: 1, name: "หมวดวิชาศึกษาทั่วไป" },
    { id: 2, name: "หมวดเลือกเสรี" },
  ]);
  const [groups, setgroups] = useState([
    { id: 1, name: "หมวดวิชาศึกษาทั่วไป" },
    { id: 2, name: "หมวดวิชาแกน" },
  ]);
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
    <div>
      {" "}
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

<br />
          <div className="flex flex-col">
            <label className="mb-2">รหัสวิชา</label>
            <input type="number" className="border rounded-lg px-2 py-2" />
          </div>
          
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อกลุ่มวิชา(ภาษาไทย)</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={instructorName}
              onChange={handleInstructorNameChange}
            />
          </div>

        </div>
        <div className="flex flex-col mb-4">
            <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
            <input type="text" className="border rounded-lg px-2 py-2" />
          </div>

          <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <select className="select select-bordered w-full max-w-xs">
  <option disabled selected>หน่วยกิต</option>
  <option>4</option>
  <option>3</option>
  <option>2</option>
  <option>1</option>
</select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 ">(ท ป ค)</label>
            <input type="text" className="border rounded-lg px-2 py-2 h-12" />
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
    </div>
  );
};

export default AddSubject;
