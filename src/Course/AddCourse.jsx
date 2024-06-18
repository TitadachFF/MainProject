import React, { useState } from "react";

const AddCourse = () => {

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
        <h1 className="text-3xl font-bold mb-6">เพิ่มหลักสูตร</h1>
        <div className="border-m mb-6 pb-3">
          <ul className="flex">
            <li className="mr-4">
              <a href="#" className="text-red-600 border-b-2 border-red-600">
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
              <input
                type="text"
                className="border rounded-md px-2 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
              <input
                type="text"
                className="border rounded-md px-2 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="mb-2">รหัสหลักสูตร</label>
              <input
                type="text"
                className="border rounded-md px-2 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">หลักสูตรปี</label>
              <input
                type="text"
                className="border rounded-md px-2 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">จำนวนหน่วยกิต</label>
              <input
                type="number"
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
              className="px-8 py-2 bg-red border border-red-600 text-white rounded"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
