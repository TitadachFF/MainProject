import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/16/solid";

const AddCourse = () => {
  // student data
  const [students, setStudents] = useState([
    { id: 1, name: "นายกิตติพงษ์ เดชจิต", class: "64/46" },
    { id: 2, name: "นายศพล นิลเพรช", class: "64/46" },
    { id: 3, name: "นายธิทเดท สระทองอุ่น", class: "64/46" },
    { id: 4, name: "นายณภัทร สายทองสุข", class: "64/46" },
    { id: 5, name: "นายก นามสกุล", class: "64/45" },
  ]);

  const classOptions = ["64/46", "64/45"];

  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) => {
    return (
      (selectedClass === "" || student.class === selectedClass) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className=" bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advicemenu")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มนักศึกษา</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            รายชื่อนักศึกษา
          </h2>
          <div className="mb-3 flex">
            <div className="w-40">
              <div className="relative ">
                <select
                  id="class"
                  className="dropdown appearance-none w-full mt-1 bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                  value={selectedClass}
                  onChange={handleClassChange}
                >
                  <option value="">หมู่เรียน</option>
                  {classOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 5.293a1 1 0 011.414 0L10 10.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full pl-20 mr-0">
              <input
                type="text"
                id="search"
                className="w-full mt-1 bg-white border border-gray-300 rounded-full py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                placeholder="ค้นหาชื่อนักศึกษา"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li key={student.id} className="py-2 flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                  <div>
                    <p className="text-lg">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.class}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
