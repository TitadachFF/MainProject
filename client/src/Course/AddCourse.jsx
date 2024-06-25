import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddSubject from "./AddSubject";
import AddCourseName from "./AddCourseName";
import AddCourseGroup from "./AddCourseGroup";
import AddCourseCategory from "./AddCourseCategory";
import AddTeacher from "./AddTeacher";

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };
  const currentForm = getQueryStringValue("form") || "addCourse";
  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    // Selected Menu
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

          {/* เพิ่มชื่อหลักสูตร */}
          {currentForm === "addCourse" && <AddCourseName />}
          {/* เพิ่มอาจารย์ */}
          {currentForm === "addTeacher" && <AddTeacher />}
          {/* You can add more conditional forms here for other cases */}
          {/* เพิ่มหมวดวิชา */}
          {currentForm === "addCourseCategory" && <AddCourseCategory />}
          {/* เพิ่มกลุ่มวิชา */}
          {currentForm === "addCourseGroup" && <AddCourseGroup />}
          {/* เพิ่มรายวิชา  */}
          {currentForm === "addSubject" && <AddSubject />}
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
