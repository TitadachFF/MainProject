import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentPlan = () => {
  const [studentplan, setStudentplan] = useState([
    {
      id: 1,
      name: "วิศวกรรมซอฟต์แวร์",
      year: "ปีการศึกษา 2566",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = studentplan.filter((course) => {
    return (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.nameeng.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-gray-100 h-[839px]">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>แผนการเรียน</p>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-red font-bold text-red-600">
            แผนการเรียน
          </h1>
          <input
            type="text"
            className="border rounded-full px-2 py-2 w-60"
            placeholder="ค้นหาแผนการเรียน"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-8">
          {filteredStudents.length > 0 ? (
            <table className="w-full rounded-lg border bg-red h-20 text-white cursor-pointer">
              <tbody>
                {filteredStudents.map((studentplan) => (
                  <tr key={studentplan.id} className="border-t">
                    <td className="py-4 px-6">{studentplan.name}</td>
                    <td className="py-4 px-6">{studentplan.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center">ไม่พบข้อมูล</div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-8 py-2 bg-red border border-red-600 text-white rounded mr-4"
            onClick={() => navigate("/advice")}
          >
            หน้าแรก
          </button>
          <button
            type="button"
            className="px-8 py-2 bg-red border border-red-600 text-white rounded"
            onClick={() => navigate("/addstudentplan")}
          >
            เพิ่มแผนการเรียน
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPlan;
