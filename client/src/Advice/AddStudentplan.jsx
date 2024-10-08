import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddListplan from "./AddListplan"; // Make sure you import the AddListplan component

const AddStudentplan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentForm, setCurrentForm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const form = query.get("form") || "addCourse";
    setCurrentForm(form);
  }, [location.search]);

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Submitting student plan with data:", {
        year: year,
        semester: selectedTerm,
      });

      if (!year || !selectedTerm) {
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      const response = await fetch(
        "http://localhost:3000/api/createStudentPlan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            year: year,
            semester: parseInt(selectedTerm, 10),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error("Failed to create student plan");
      }

      const data = await response.json();
      console.log("Student plan created:", data);

      navigate("/studentplan");
    } catch (error) {
      console.error("Error creating student plan:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>สร้างแผนการเรียน</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full">
          <h1 className="text-2xl text-red font-bold mb-6">เพิ่มแผนการเรียน</h1>
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
                  แผนการเรียน
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("addlistplan")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "addlistplan"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  เพิ่มรายวิชา
                </a>
              </li>
            </ul>
          </div>
          {currentForm === "addCourse" && (
            <form className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-3 flex space-x-4">
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ปีการศึกษา</label>
                  <input
                    type="text"
                    className="border rounded-full px-2 py-2"
                    placeholder="ปีการศึกษา"
                    value={year}
                    onChange={handleYearChange}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">เทอม</label>
                  <select
                    className="border rounded-full px-2 py-2 text-sm"
                    value={selectedTerm}
                    onChange={handleTermChange}
                  >
                    <option value="">เลือกเทอม</option>
                    <option value="1">เทอม 1</option>
                    <option value="2">เทอม 2</option>
                  </select>
                </div>
              </div>

              {/* Buttons at left and right corners */}
              <div className="col-span-3 mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                  onClick={() => navigate("/studentplan")}
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  className="px-8 py-2 bg-red text-white rounded"
                  onClick={handleSubmit}
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}

          {currentForm === "addlistplan" && <AddListplan />}{" "}

        </div>
      </div>
    </div>
  );
};

export default AddStudentplan;
