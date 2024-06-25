import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "documents";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      `Selected Course: ${selectedCourse}, Instructor Name: ${instructorName}`
    );
  };

  return (
    <div className="bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
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
      <div className="min-h-screen flex justify-center bg-gray-100">
        <div className="container mx-auto w-full max-w-3xl h-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-red-600">เอกสาร</h2>
          <div className="border-b mb-6 pb-3">
            <ul className="flex">
              <li
                className="mr-4"
                onClick={() => updateQueryString("documents")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "documents" ? "border-red" : "text-gray-600"
                  }`}
                >
                  คำร้องแจ้งความประสงค์
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("documentinfo")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "documentinfo"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  แบบบันทึกผลการเรียน
                </a>
              </li>
            </ul>
          </div>
          {/* คำร้อง */}
          {currentForm === "documents" && (
            <form>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">รหัสนักศึกษา</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสนักศึกษา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">หมู่เรียน</label>
                  <input
                    type="text"
                    className="w-20 mt-1 border border-gray-300 rounded p-2"
                    placeholder="XX/XX"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">รหัสผ่าน</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสผ่าน"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ยืนยันรหัสผ่าน"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red rounded-full"
                  onClick={() => navigate("/student")}
                >
                  ย้อนกลับ
                </button>
                <div className="flex ml-auto">
                  <button
                    type="button"
                    className="px-8 py-2 bg-red border border-red text-white rounded-full"
                  >
                    ส่งให้อาจารย์ที่ปรึกษา
                  </button>
                  <button
                    type="button"
                    className="px-8 py-2 bg-red border border-red text-white rounded-full ml-2"
                  >
                    ดาวโหลดPDF
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* แบบบันทึกผลการเรียน */}
          {currentForm === "documentinfo" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">no content</div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red0 rounded-full"
                  onClick={() => navigate("/documents")}
                >
                  ย้อนกลับ
                </button>
                <div className="flex ml-auto">
                  <button
                    type="button"
                    className="px-8 py-2 bg-red border border-red text-white rounded-full"
                  >
                  ส่งให้อาจารย์ที่ปรึกษา
                  </button>
                  <button
                    type="button"
                    className="px-8 py-2 bg-red border border-red text-white rounded-full ml-2"
                  >
                    ดาวโหลดPDF
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
