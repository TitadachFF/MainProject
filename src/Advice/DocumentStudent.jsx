import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/16/solid";
import { useNavigate, useLocation } from "react-router-dom";

const DocumentStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };
  const currentForm = getQueryStringValue("form") || "documentstudent";
  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "นายกิตติพงษ์ เดชจิต",
      class: "64/46",
      evaluationStatus: null,
    },
    { id: 2, name: "นายศพล นิลเพรช", class: "64/46", evaluationStatus: null },
    {
      id: 3,
      name: "นายธิทเดท สระทองอุ่น",
      class: "64/46",
      evaluationStatus: null,
    },
    {
      id: 4,
      name: "นายณภัทร สายทองสุข",
      class: "64/46",
      evaluationStatus: null,
    },
    { id: 5, name: "นายก นามสกุล", class: "64/45", evaluationStatus: null },
  ]);

  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (selectedClass === "" || student.class === selectedClass) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setEvaluationModalOpen(false);
    setReasonModalOpen(false);
  };

  const openEvaluationModal = () => {
    setEvaluationModalOpen(true);
  };

  const openReasonModal = () => {
    setEvaluationModalOpen(false);
    setReasonModalOpen(true);
  };

  const handleEvaluatePass = () => {
    setStudents(
      students.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, evaluationStatus: "ผ่าน" }
          : student
      )
    );
    closeModal();
  };

  const handleEvaluateFail = () => {
    openReasonModal();
  };

  const handleSubmitReason = () => {
    setStudents(
      students.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, evaluationStatus: "ไม่ผ่าน", reason }
          : student
      )
    );
    closeModal();
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advicemenu")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มนักศึกษา</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เอกสารคำร้องขอ
          </h2>
          <div className="mb-3 flex"></div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              <div className="border-m mb-6 pb-3">
                <ul className="flex">
                  <li
                    className="mr-4"
                    onClick={() => updateQueryString("documentstudent")}
                  >
                    <a
                      className={`cursor-pointer border-b-2 ${
                        currentForm === "documentstudent"
                          ? "border-red"
                          : "text-gray-600"
                      }`}
                    >
                      เอกสารที่ยังไม่ได้ตรวจสอบ
                    </a>
                  </li>
                  <li
                    className="mr-4"
                    onClick={() => updateQueryString("chackdocument")}
                  >
                    <a
                      className={`cursor-pointer border-b-2 ${
                        currentForm === "chackdocument"
                          ? "border-red"
                          : "text-gray-600"
                      }`}
                    >
                      เอกสารที่ตรวจสอบแล้ว
                    </a>
                  </li>
                </ul>
              </div>

              {/**เอกสารที่ยังไม่ได้ตรวจสอบ */}
              {currentForm === "documentstudent" && (
                <>
                  {filteredStudents.map((student) => (
                    <a
                      key={student.id}
                      href="#"
                      className="block py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleStudentClick(student)}
                    >
                      <div className="flex items-center">
                        <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                        <div>
                          <p className="text-lg">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.class}
                          </p>
                        </div>
                      </div>
                      {student.evaluationStatus && (
                        <span
                          className={`text-sm font-bold ${
                            student.evaluationStatus === "ผ่าน"
                              ? "text-gray-500"
                              : "text-red"
                          }`}
                        >
                          {student.evaluationStatus}
                        </span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                    </a>
                  ))}
                </>
              )}

              {/**เอกสารที่ตรวจสอบแล้ว */}
              {currentForm === "chackdocument" && (
                <div className="text-center text-gray-600 mt-4">
                  <p>ยังไม่มีเอกสารที่ตรวจสอบแล้ว</p>
                </div>
              )}
            </ul>
          </div>
          <div className="mt-6 flex justify-between py-12">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
              onClick={() => navigate("/advice")}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-0 w-96">
            <div>
              <div className="bg-red text-white p-3  rounded-t-lg h-14 flex justify-between items-center">
                <h3 className="text-xl font-bold mb-0">
                  เอกสารของ {selectedStudent.name}
                </h3>
                {selectedStudent.evaluationStatus && (
                  <span
                    className={`text-sm font-bold ${
                      selectedStudent.evaluationStatus === "ผ่าน"
                        ? "text-gray-500"
                        : "text-red"
                    }`}
                  >
                    {selectedStudent.evaluationStatus}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="border p-4 mb-4">
                  <p className="text-gray-700">ไฟล์</p>
                </div>
                <div className="border p-4 mb-4">
                  <p className="text-gray-700">ไฟล์</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4 p-6">
              <button
                className="px-4 py-2 bg-red text-white rounded-full"
                onClick={openEvaluationModal}
              >
                ประเมิณ
              </button>
              <button
                className="px-4 py-2 bg-red text-white rounded-full"
                onClick={closeModal}
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      )}

      {evaluationModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">ประเมิณเอกสาร</h3>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-red text-white rounded-full"
                onClick={handleEvaluatePass}
              >
                ผ่าน
              </button>
              <button
                className="px-4 py-2 bg-red text-white rounded-full"
                onClick={handleEvaluateFail}
              >
                ไม่ผ่าน
              </button>
            </div>
          </div>
        </div>
      )}

      {reasonModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">หมายเหตุ</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-red text-white rounded-full"
              onClick={handleSubmitReason}
            >
              ส่งเหตุผล
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentStudent;
