import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddListplan from "./AddListplan";

const AddStudentplan = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [currentForm, setCurrentForm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [year, setYear] = useState("");
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const form = query.get("form") || "addCourse";
    setCurrentForm(form);
    fetchMajors();
  }, [location.search]);

  const fetchMajors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}api/getAllMajors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMajors(data);
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMajorChange = (e) => {
    setSelectedMajor(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Check for incomplete form
      if (!year || !selectedTerm || !selectedMajor) {
        setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
        setIsSuccess(false);
        setIsModalOpen(true);
        return;
      }

      const response = await fetch(`${apiUrl}api/createStudentPlan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          year: year,
          semester: parseInt(selectedTerm, 10),
          major_id: parseInt(selectedMajor, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for duplicate entry
        if (errorData.message === "Duplicate entry") {
          setMessage("รหัสหลักสูตรนี้มีอยู่แล้ว");
        } else {
          setMessage("เกิดข้อผิดพลาดในการบันทึกแผนการเรียน");
        }
        setIsSuccess(false);
        setIsModalOpen(true);
      } else {
        const data = await response.json();
        console.log("Student plan created:", data);
        setMessage("แผนการเรียนถูกบันทึกเรียบร้อยแล้ว");
        setIsSuccess(true);
        setIsModalOpen(true); // Show success modal

        // Use a timeout to navigate after showing the modal
        setTimeout(() => {
          navigate("/studentplan");
        }, 2000); // Wait 2 seconds before navigating
      }
    } catch (error) {
      console.error("Error creating student plan:", error);
      setMessage("เกิดข้อผิดพลาดในการบันทึกแผนการเรียน");
      setIsSuccess(false);
      setIsModalOpen(true);
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
                <div className="flex flex-col w-1/3">
                  <label className="mb-2">ปีการศึกษา</label>
                  <input
                    id="add-planyear"
                    type="text"
                    className="border rounded-full px-2 py-2"
                    placeholder="ปีการศึกษา"
                    value={year}
                    onChange={handleYearChange}
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="mb-2">เทอม</label>
                  <select
                    id="semester-select"
                    className="border rounded-full px-2 py-2 text-sm"
                    value={selectedTerm}
                    onChange={handleTermChange}
                  >
                    <option value="">เลือกเทอม</option>
                    <option value="1" id="semester1">
                      เทอม 1
                    </option>
                    <option value="2" id="semester2">
                      เทอม 2
                    </option>
                  </select>
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="mb-2">สาขาวิชา</label>
                  <select
                    id="major"
                    className="border rounded-full px-2 py-2 text-sm"
                    value={selectedMajor}
                    onChange={handleMajorChange}
                  >
                    <option value="">เลือกสาขาวิชา</option>
                    {majors.map((major) => (
                      <option
                        key={major.major_id}
                        value={major.major_id}
                        id="major-name"
                      >
                        {major.majorNameTH}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-3 mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                  onClick={() => navigate("/studentplan")}
                >
                  ย้อนกลับ
                </button>
                <button
                  id="save-studentplan"
                  type="button"
                  className="px-8 py-2 bg-red text-white rounded"
                  onClick={handleSubmit}
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}

          {currentForm === "addlistplan" && <AddListplan />}
        </div>
      </div>

      {isModalOpen && (
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{message}</h3>
            <p className="py-4 text-gray-500">
              กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
            </p>
            <div className="modal-action flex justify-between">
              <form method="dialog" className="w-full flex justify-between">
                <button
                  id="close-alertmodal"
                  type="button"
                  className="px-10 py-2 bg-white text-red border font-semibold border-red rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  ปิด
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AddStudentplan;
