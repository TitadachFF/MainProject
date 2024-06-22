import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudentplan = () => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState("");

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center p-6">
      <div className="container mx-auto flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl text-red font-bold mb-6 text-red-600">
            แผนการเรียน
          </h1>

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
              type="submit"
              className="px-8 py-1 bg-red border border-red-600 text-white rounded-full"
            >
              เพิ่มรายวิชา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentplan;
