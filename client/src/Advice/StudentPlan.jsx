import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentPlan = () => {
  const [studentPlans, setStudentPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedYear, setExpandedYear] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/getStudentplanByAcademic",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentPlans(response.data);
      } catch (error) {
        console.error("Error fetching student plans by academic:", error);
      }
    };

    fetchStudentPlans();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Group by year
  const groupByYear = (plans) => {
    return plans.reduce((acc, plan) => {
      const year = plan.year || "Unknown Year";
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(plan);
      return acc;
    }, {});
  };

  const filteredPlans = studentPlans.filter(
    (plan) =>
      (plan.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.nameeng || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPlans = groupByYear(filteredPlans);

  const courseMap = courses.reduce((map, course) => {
    map[course.course_id] = {
      nameTH: course.courseNameTH,
      unit: course.courseUnit,
    };
    return map;
  }, {});

  const handleDropdownClick = (year) => {
    setDropdownOpen(dropdownOpen === year ? null : year);
  };

  const handleEdit = (year, plans) => {
    navigate("/editstudentplan", { state: { year, plans } });
  };


  const handleDelete = async (year, plans) => {
    setPlanToDelete({ year, plans });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete || !planToDelete.plans || !planToDelete.plans.length) {
      console.error("No plan to delete");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Assuming the ID is stored in the first plan object in the list
      const planId = planToDelete.plans[0]?.studentplan_id; // Adjust to match actual property name

      if (!planId) {
        console.error("Plan ID is missing");
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/deleteStudentPlan/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudentPlans(
        studentPlans.filter((plan) => plan.year !== planToDelete.year)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting student plan:", error);
    }
  };


  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

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
          {Object.keys(groupedPlans).length > 0 ? (
            <div>
              {Object.entries(groupedPlans).map(([year, plans]) => {
                return (
                  <div key={year} className="mb-4 relative">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="w-full text-left bg-red text-white py-4 px-4 rounded flex items-center justify-between"
                        onClick={() =>
                          setExpandedYear(expandedYear === year ? null : year)
                        }
                      >
                        <span>แผนการเรียน ปีการศึกษา {year}</span>
                        <svg
                          data-slot="icon"
                          fill="none"
                          strokeWidth="4"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-6 h-6 text-gray-300 ml-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownClick(year);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          ></path>
                        </svg>
                      </button>
                      {dropdownOpen === year && (
                        <div className="absolute right-6 mt-24 bg-white text-black border rounded shadow-lg w-48 z-50">
                          <button
                            onClick={() => handleEdit(year, groupedPlans[year])}
                            className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                          >
                            แก้ไขแผนการเรียน
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(year, groupedPlans[year])
                            }
                            className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                          >
                            ลบแผนการเรียน
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">ยืนยันการลบ</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบแผนการเรียนนี้?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 border border-red rounded mr-2 text-red"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red border border-red text-white rounded"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPlan;
