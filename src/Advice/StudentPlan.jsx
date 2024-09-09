import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentPlan = () => {
  const [studentPlans, setStudentPlans] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSecId, setExpandedSecId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getStudentPlans"
        );
        setStudentPlans(response.data);
      } catch (error) {
        console.error("Error fetching student plans:", error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getSections"
        );
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getAllCourses"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchStudentPlans();
    fetchSections();
    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const groupBySection = (plans) => {
    return plans.reduce((acc, plan) => {
      const secId = plan.sec_id || "Unknown Section";
      if (!acc[secId]) {
        acc[secId] = [];
      }
      acc[secId].push(plan);
      return acc;
    }, {});
  };

  const filteredPlans = studentPlans.filter(
    (plan) =>
      (plan.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.nameeng || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPlans = groupBySection(filteredPlans);

  const sectionMap = sections.reduce((map, section) => {
    map[section.sec_id] = section.sec_name;
    return map;
  }, {});

  const courseMap = courses.reduce((map, course) => {
    map[course.course_id] = {
      nameTH: course.courseNameTH,
      unit: course.courseUnit,
    };
    return map;
  }, {});

  const handleDropdownClick = (secId) => {
    setDropdownOpen(dropdownOpen === secId ? null : secId);
  };

  const handleEdit = (secId, plans) => {
    navigate("/editstudentplan", { state: { secId, plans } });
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
              {Object.entries(groupedPlans).map(([secId, plans]) => (
                <div key={secId} className="mb-4 relative">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-full text-left bg-red text-white py-4 px-4 rounded flex items-center justify-between"
                      onClick={() =>
                        setExpandedSecId(expandedSecId === secId ? null : secId)
                      }
                    >
                      <span>
                        แผนการเรียนของหมู่เรียน{" "}
                        {sectionMap[secId] || "Unknown Section"}
                      </span>
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
                          handleDropdownClick(secId);
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        ></path>
                      </svg>
                    </button>
                    {dropdownOpen === secId && (
                      <div className="absolute right-0 mt-16 bg-white text-black border rounded shadow-lg w-48 z-50">
                        <button
                          onClick={() => handleEdit(secId, groupedPlans[secId])}
                          className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                        >
                          แก้ไขแผนการเรียน
                        </button>
                      </div>
                    )}
                  </div>
                  {expandedSecId === secId && (
                    <table className="w-full rounded-lg border bg-gray-200 text-black">
                      <tbody>
                        {groupedPlans[secId].map((plan, index) => (
                          <tr
                            key={`${secId}-${plan.course_id}-${index}`}
                            className="border-t"
                          >
                            <td className="py-4 px-6">
                              {plan.course_id || "N/A"}
                            </td>
                            <td className="py-4 px-6">
                              {courseMap[plan.course_id]?.nameTH || "N/A"}
                            </td>
                            <td className="py-4 px-6">
                              หน่วยกิต {courseMap[plan.course_id]?.unit || "N/A"}
                            </td>
                            <td className="py-4 px-6">ปี {plan.year || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
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
    </div>
  );
};

export default StudentPlan;
