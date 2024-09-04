// AllCourse.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllCourse = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getAllMajors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Majors");
        }
        const data = await response.json();
        console.log("Fetched Majors:", data);
        if (Array.isArray(data)) {
          setMajors(data);
        } else {
          throw new Error("Data format is incorrect");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editmajor?editMajor=${id}`);
  };
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
          <h1 className="text-2xl text-red font-bold mb-6">รายชื่อหลักสูตร</h1>
          <div className="mt-8">
            {loading ? (
              <div className="text-gray-500 text-center">กำลังโหลด...</div>
            ) : error ? (
              <div className="text-gray-500 text-center">{error}</div>
            ) : majors.length > 0 ? (
              <table className="w-full rounded-lg border hover:shadow-xl bg-red h-full text-white cursor-pointer">
                <tbody>
                  {majors.map((major) => (
                    <tr key={major.major_code} className="border-t relative">
                      <td className="px-6 py-4">
                        <div
                          className="flex flex-col "
                          onClick={() => handleEdit(major.major_code)}
                        >
                          <span className="text-xl flex">
                            {major.major_code} {major.majorNameTH}
                            <p className="pl-8">{major.majorUnit} หน่วยกิต</p>
                          </span>
                          <span>{major.majorNameENG}</span>
                        </div>
                      </td>
                      <td className="px-6">
                        <div className="relative">
                          <svg
                            data-slot="icon"
                            fill="none"
                            stroke-width="4"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="w-6 h-8 text-gray-300 cursor-pointer z-10"
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === major.major_code
                                  ? null
                                  : major.major_code
                              )
                            }
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                            ></path>
                          </svg>
                          {/* dropdown Menu */}
                          {dropdownOpen === major.major_code && (
                            <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow-lg w-48 z-50">
                              <button
                                onClick={() => handleEdit(major.major_code)}
                                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                              >
                                แก้ไขหลักสูตร
                              </button>
                              <button
                                onClick={() => handleStore(major.major_code)}
                                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                              >
                                จัดเก็บหลักสูตร
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 text-center">ไม่มีหลักสูตร</div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-8 py-2 bg-red border border-red text-white rounded  hover:shadow-md hover:bg-gray-500"
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
