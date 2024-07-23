import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllCourse = () => {
    const [courses, setcourses] = useState([
      {
        id: 1,
        code: "644259009",
        name: "วิศวกรรมซอฟต์แวร์",
        nameeng: "software engineer",
      },
    ]);

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
        <p>ดูหลักสูตร</p>
      </div>
      <div className=" min-h-screen flex justify-center bg-gray-100 ">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl text-red font-bold mb-6 text-red-600">
            รายชื่อหลักสูตร
          </h1>
          <div className="mt-8">
            {courses.length > 0 ? (
              <table className="w-full rounded-lg border bg-red h-20 text-white cursor-pointer">
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t">
                      <td className="py-4 px-6">{course.code}</td>
                      <td className="py-4 px-6">{course.name}</td>
                      <td className="py-4 px-6">{course.nameeng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 text-center">ไม่มีหลักสูตร</div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-8 py-2 bg-red border border-red-600 text-white rounded"
              onClick={() => navigate("/addcourse")}
            >
              เพิ่มหลักสูตร
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourse;