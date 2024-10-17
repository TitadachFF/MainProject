import React, { useState, useEffect } from "react";
import "./Documents.css";
import axios from "axios";

const Documents = () => {
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
          เอกสาร
        </h2>
        <button
          className="hidden-on-print bg-red text-white px-4 mb-2 py-2 rounded hover:bg-gray-400"
          onClick={handlePrint}
        >
          บันทึก PDF
        </button>
        <div className="flex justify-center">
          <img
            src="/public/PDF (1).jpg"
            alt="Description"
            className="max-w-3xl h-auto rounded-lg mb-20"
          />
          {/* Student Info */}
          {studentData && (
            <>
              <div className=" name text absolute z-0">
                <p className="nameTh">
                  {studentData.firstname} {studentData.lastname}
                </p>
                <p className="nameEng">
                  {studentData.firstnameEng} {studentData.lastnameEng}
                </p>
              </div>
              <p className="birth-day text absolute z-0">
                {studentData.birthdate}
              </p>
              <p className="month-date text absolute z-0">
                {studentData.monthdate}
              </p>
              <p className="year-date text absolute z-0">
                {studentData.yeardate}
              </p>
              <p className="phone-number text absolute z-0">
                {studentData.phone}
              </p>
              <p className="corp text absolute z-0">{studentData.corps}</p>
              <p className="student-id text absolute z-0 ">
                {studentData.student_id}
              </p>
              <p className="section text absolute z-0">{sections.sec_name}</p>
              <p className="major text absolute z-0">{academicName}</p>
              <p className="before-join text absolute z-0">
                {studentData.pre_educational}
              </p>
              <p className="end-from text absolute z-0">
                {studentData.graduated_from}
              </p>
              <p className="end-year text absolute z-0">
                {studentData.pregraduatedyear}
              </p>
              <p className="want-to-end text absolute z-0">
                {studentData.wanttoend}
              </p>
              <p className="year-end text absolute z-0">
                {studentData.yeartoend}
              </p>
              <p className="confirm-name text absolute z-0">
                {studentData.firstname} {studentData.lastname}
              </p>
              <p className="sub-confirm-name text absolute z-0">
                {studentData.titlenameTh} {studentData.firstname}{" "}
                {studentData.lastname}
              </p>
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
    </div>
  );
};

export default Documents;
