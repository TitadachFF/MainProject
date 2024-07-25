import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllCourse = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getallMajor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Major");
        }
        const data = await response.json();
        console.log("Fetched Majors:", data); 
        setMajors(data.majors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

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
        <p>ดูหลักสูตร</p>
      </div>
      <div className="min-h-screen flex justify-center bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl text-red font-bold mb-6 text-red-600">
            รายชื่อหลักสูตร
          </h1>
          <div className="mt-8">
            {loading ? (
              <div className="text-gray-500 text-center">กำลังโหลด...</div>
            ) : error ? (
              <div className="text-gray-500 text-center">{error}</div>
            ) : majors.length > 0 ? (
              <table className="w-full rounded-lg border bg-red h-20 text-white cursor-pointer">
                <thead>
                  <tr>
                    <th className="py-4 px-6">รหัสหลักสูตร</th>
                    <th className="py-4 px-6">ชื่อหลักสูตร (TH)</th>
                    <th className="py-4 px-6">ชื่อหลักสูตร (ENG)</th>
                  </tr>
                </thead>
                <tbody>
                  {majors.map((major) => (
                    <tr key={major.id} className="border-t">
                      <td className="py-4 px-6">{major.majorCode}</td>
                      <td className="py-4 px-6">{major.majorNameTH}</td>
                      <td className="py-4 px-6">{major.majorNameENG}</td>
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
