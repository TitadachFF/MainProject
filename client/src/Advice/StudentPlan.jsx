import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentPlan = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [studentPlans, setStudentPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiUrl}api/getStudentplanByAcademic`,
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
  

  // Group by year and semester
  const groupByYearAndSemester = (plans) => {
    return plans.reduce((acc, plan) => {
      const year = plan.year || "Unknown Year";
      const semester = plan.semester || "Unknown Semester";
      const key = `${year} - ${semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(plan);
      return acc;
    }, {});
  };

  const filteredPlans = studentPlans.filter(
    (plan) =>
      (plan.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.nameeng || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPlans = groupByYearAndSemester(filteredPlans);

  const handleDropdownClick = (key) => {
    setDropdownOpen(dropdownOpen === key ? null : key);
  };

  const handleEdit = (key, plans) => {
    navigate("/editstudentplan", {
      state: {
        year: key.split(" - ")[0],
        plans,
        studentplan_id: plans[0]?.studentplan_id,
      },
    });
  };


  const handleDelete = (key, plans) => {
    setPlanToDelete({ key, plans });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete || !planToDelete.plans || !planToDelete.plans.length) {
      console.error("No plan to delete");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const planId = planToDelete.plans[0]?.studentplan_id;

      if (!planId) {
        console.error("Plan ID is missing");
        return;
      }

      await axios.delete(`${apiUrl}api/deleteStudentPlan/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudentPlans(
        studentPlans.filter(
          (plan) => `${plan.year} - ${plan.semester}` !== planToDelete.key
        )
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
    <div className="bg-gray-100 min-h-screen flex flex-col">
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
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-600">แผนการเรียน</h1>
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
              {Object.entries(groupedPlans).map(([key, plans]) => {
                const [year, semester] = key.split(" - ");
                return (
                  <div key={key} className="mb-4 relative">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="w-full text-left bg-red text-white py-4 px-4 rounded flex items-center justify-between"
                      >
                        <span>
                          แผนการเรียน ปีการศึกษา {year} เทอม {semester}
                        </span>
                        <svg
                          fill="none"
                          strokeWidth="4"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-6 h-6 text-gray-300 ml-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownClick(key);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          ></path>
                        </svg>
                      </button>
                      {dropdownOpen === key && (
                        <div className="absolute right-6 mt-24 bg-white text-black border rounded shadow-lg w-48 z-50">
                          <button
                            onClick={() => handleEdit(key, plans)}
                            className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                          >
                            แก้ไขแผนการเรียน
                          </button>
                          <button
                            onClick={() => handleDelete(key, plans)}
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
                className="px-4 py-2 bg-red text-white rounded"
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
