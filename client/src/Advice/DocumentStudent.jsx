import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

const DocumentStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { id: 1, name: "นายกิตติพงษ์ เดชจิต", class: "64/46" },
    { id: 2, name: "นายศพล นิลเพรช", class: "64/46" },
    { id: 3, name: "นายธิทเดท สระทองอุ่น", class: "64/46" },
    { id: 4, name: "นายณภัทร สายทองสุข", class: "64/46" },
    { id: 5, name: "นายก นามสกุล", class: "64/45" },
  ]);

  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (selectedClass === "" || student.class === selectedClass) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStudentClick = (studentId) => {
    console.log(`Clicked on student with ID: ${studentId}`);
  };

  return (
    <div className="bg-gray-100">
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
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เอกสารคำร้องขอ
          </h2>
          <div className="mb-3 flex"></div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              <div className="border-m mb-6 pb-3">
                <ul className="flex">
                  <li className="mr-4">
                    <a
                      href="#"
                      className="text-red-600 border-b-2 border-red-600"
                    >
                      เอกสารที่ยังไม่ได้ตรวจสอบ
                    </a>
                  </li>
                  <li className="mr-4">
                    <a href="#" className="text-gray-600">
                      เอกสารที่ตรวจสอบแล้ว
                    </a>
                  </li>
                </ul>
              </div>
              {filteredStudents.map((student) => (
                <a
                  key={student.id}
                  href="#"
                  className="block py-2 flex items-center justify-between cursor-pointer"
                  onClick={() => handleStudentClick(student.id)}
                >
                  <div className="flex items-center">
                    <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                    <div>
                      <p className="text-lg">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.class}</p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </a>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-between  py-12">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                onClick={() => navigate("/advice")}
              >
                ย้อนกลับ
              </button>
         
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentStudent;
