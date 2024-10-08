import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllCourse = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}api/getAllMajors`, {
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

  const handleDelete = async (majorId) => {
    if (!window.confirm("คุณแน่ใจหรือว่าต้องการลบหลักสูตรนี้?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}api/deleteMajor/${majorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the major.");
      }

      // ลบหลักสูตรจาก state
      setMajors(majors.filter((major) => major.major_id !== majorId));
      alert("ลบหลักสูตรเรียบร้อยแล้ว.");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบหลักสูตร.");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editmajor?editMajor=${id}`);
  };

  const handleView = (id) => {
    navigate(`/viewmajor?viewMajor=${id}`);
  };

  // แยกหลักสูตรที่ ACTIVE และ INACTIVE
  const activeMajors = majors.filter((major) => major.status === "ACTIVE");
  const inactiveMajors = majors.filter((major) => major.status === "INACTIVE");

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
          <div></div>
          <h1 className="text-2xl text-red font-bold mb-6">รายชื่อหลักสูตร</h1>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-8 py-2 bg-red  text-white rounded  hover:shadow-md hover:bg-gray-500"
              onClick={() => navigate("/addcourse")}
            >
              เพิ่มหลักสูตร
            </button>
          </div>
          <h1 className="text-lg text-gray-500 font-medium mb-3">
            หลักสูตรที่ใช้งานอยู่
          </h1>

          <div className="">
            {loading ? (
              <div className="text-gray-500 text-center">กำลังโหลด...</div>
            ) : error ? (
              <div className="text-gray-500 text-center">{error}</div>
            ) : majors.length > 0 ? (
              <>
                <table className="w-full rounded-lg border bg-red  shadow-md h-full text-white cursor-pointer mb-4" >
                  <tbody>
                    {activeMajors.map((major) => (
                      <tr key={major.major_code} className="border-t relative">
                        <td className="px-6 py-4 flex justify-between items-center">
                          <div
                            className="flex flex-col"
                            onClick={() => handleView(major.major_code)}
                          >
                            <span className="text-xl flex">
                              {major.major_code} {major.majorNameTH}{" "}
                              {major.majorYear}
                              <p className="pl-8">{major.majorUnit} หน่วยกิต</p>
                            </span>
                            <span>{major.majorNameENG}</span>
                          </div>
                          <div className="relative ml-auto">
                            <svg
                              data-slot="icon"
                              fill="none"
                              strokeWidth="4"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="w-8 h-8 text-white cursor-pointer z-10 hover:text-gray-300"
                              onClick={() =>
                                setDropdownOpen(
                                  dropdownOpen === major.major_code
                                    ? null
                                    : major.major_code
                                )
                              }
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                                <button
                                  onClick={() => handleDelete(major.major_id)}
                                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                                >
                                  ลบหลักสูตร
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* หลักสูตรที่ไม่ได้ใช้งาน */}
                <h1 className="text-lg text-gray-500 font-medium py-4 mb-">
                  หลักสูตรที่ไม่ได้ใช้งาน
                </h1>
                <table className="w-full rounded-lg border shadow-md bg-gray-200 h-full text-black cursor-pointer">
                  <tbody>
                    {inactiveMajors.map((major) => (
                      <tr key={major.major_code} className="border-t relative">
                        <td className="px-6 py-4 flex justify-between items-center">
                          <div
                            className="flex flex-col"
                            onClick={() => handleView(major.major_code)}
                          >
                            <span className="text-xl flex">
                              {major.major_code} {major.majorNameTH}{" "}
                              {major.majorYear}
                              <p className="pl-8">{major.majorUnit} หน่วยกิต</p>
                            </span>
                            <span>{major.majorNameENG}</span>
                          </div>
                          <div className="relative ml-auto">
                            <svg
                              data-slot="icon"
                              fill="none"
                              strokeWidth="4"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="w-8 h-8 text-black cursor-pointer z-10 hover:text-gray-500"
                              onClick={() =>
                                setDropdownOpen(
                                  dropdownOpen === major.major_code
                                    ? null
                                    : major.major_code
                                )
                              }
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                                <button
                                  onClick={() => handleDelete(major.major_id)}
                                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                                >
                                  ลบหลักสูตร
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="text-gray-500 text-center">ไม่มีหลักสูตร</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourse;
