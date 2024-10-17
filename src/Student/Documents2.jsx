import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Documents2 = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({});
  const [sections, setSections] = useState({});
  const [academicName, setAcademicName] = useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");
        if (token && storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const studentId = parsedUserData.decoded.id;
          const academicNameFromToken =
            parsedUserData.decoded.academic.academic_name || "";
          const studentResponse = await axios.get(
            `${apiUrl}api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStudentData(studentResponse.data);
          setAcademicName(academicNameFromToken);
          console.log("AcademicName: ", academicNameFromToken);

          console.log("Student Data:", studentResponse.data);
          const sectionResponse = await axios.get(
            `${apiUrl}api/getSectionById/${studentResponse.data.sec_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSections(sectionResponse.data);
          console.log("Section Response", sectionResponse.data);
        }
      } catch (error) {}
    };
    fetchStudentData();
  }, []);

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28 hidden-on-print">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/student")}>
          เมนูนักศึกษา
        </p>
        <span className="mx-1">&gt;</span>
        <p>เอกสาร</p>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-2xl text-red text-center font-bold mb- text-red-600 hidden-on-print">
          คู่คำร้องแจ้งความประสงค์
        </h2>
        <button
          className="hidden-on-print bg-red text-white px-4 mb-2 py-2 rounded hover:bg-gray-400"
          onClick={handlePrint}
        >
          บันทึก PDF
        </button>
        <div className="flex justify-center">
          <img
            src="/PDF (2).jpg"
            alt="Description"
            className="max-w-3xl h-auto rounded-lg mb-6"
          />
          {/* Student Info */}
          {studentData && (
            <>
              <p className="full-name text absolute z-0">
                {studentData.firstname} {studentData.lastname}
              </p>
              <p className="student-id-2 text absolute z-0">
                {studentData.student_id}
              </p>
              <p className="section-2 text absolute z-0">{sections.sec_name}</p>
              <p className="corps-2 text absolute z-0">{academicName}</p>
              <p className="afterendcontact text absolute z-0">
                {studentData.afterendcontact}
              </p>
              <p className="homenumber text absolute z-0">
                {studentData.homenumber}
              </p>
              <p className="road text absolute z-0">{studentData.road}</p>
              <p className="alley text absolute z-0">{studentData.alley}</p>
              <p className="district text absolute z-0">
                {studentData.district}
              </p>
              <p className="subdistrict text absolute z-0">
                {studentData.subdistrict}
              </p>
              <p className="province text absolute z-0">
                {studentData.province}
              </p>
              <p className="zipcode text absolute z-0">{studentData.zipcode}</p>
              <p className="phone-2 text absolute z-0">{studentData.phone}</p>
            </>
          )}
        </div>
      </div>

      {/* PDF Style */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            margin: 0;
          }
          .container {
            padding: 20px;
            border: none;
          }
          table {
            border-collapse: collapse;
          }
          .border-2 {
            border-width: 1px;
          }
          .border-black {
            border-color: black;
          }
          .print-only {
            display: block;
          }
          .navbar {
            display: none !important;
          }
          .footer {
            display: none !important;
          }
          .print:hidden {
            display: none;
          }
          .hidden-on-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
      <div className="hidden-on-print flex justify-around">
        <button
          type="button"
          className="px-6 py-2 mb-6 bg-gray-200  border text-black rounded"
          onClick={() => navigate("/documents")}
        >
          ย้อนกลับ
        </button>
        <button
          type="button"
          className="px-6 py-2 mb-6 text-white border bg-red  border-red text-red-600 rounded"
          onClick={() => navigate("/documentpdf")}
        >
          หน้าถัดไป
        </button>
      </div>
    </div>
  );
};

export default Documents2;
