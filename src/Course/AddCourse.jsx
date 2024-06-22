import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const navigate = useNavigate();

  return (
    <div className=" bg-gray-100">
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
                <a href="#" className=" border-b-2 border-red-600">
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
                <a href="#" className="text-gray-600">
                  เพิ่มรายวิชา
                </a>
              </li>
            </ul>
          </div>

          <form>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="mb-2">ชื่อหลักสูตร(ภาษาไทย)</label>
                <input type="text" className="border rounded-full px-2 py-2" />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
                <input type="text" className="border rounded-full px-2 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="mb-2">รหัสหลักสูตร</label>
                <input type="text" className="border rounded-full px-2 py-2" />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">หลักสูตรปี</label>
                <input type="text" className="border rounded-full px-2 py-2" />
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
                type="button"
                className="px-8 py-2 bg-red border border-red-600 text-white rounded"
                onClick={() => navigate("/advicecourse")}
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

export default AddCourse;
