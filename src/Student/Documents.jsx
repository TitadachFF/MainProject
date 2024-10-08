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
        <div className="container mx-auto w-full max-w-6xl h-full bg-white rounded-lg shadow-lg p-6">
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
              {/* <li
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
              </li> */}
            </ul>
          </div>
          {/* คำร้อง */}
          {currentForm === "documents" && (
            <div className="flex justify-center items-center bg-gradient-to-r from-gray-100 to-gray-100 py-8 h-[200px]">
              <button
                type="button"
                className="px-16 py-4 bg-red hover:bg-red text-white text-2xl font-bold rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105 flex"
                onClick={() => (window.location.href = "/qweqe.pdf")}
              >
                ดูเอกสาร
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8"
                >
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              </button>
            </div>
          )}

          {/* แบบบันทึกผลการเรียน */}
          {currentForm === "documentinfo" && (
            <form onSubmit={handleSubmit}>
              {/* First Table */}
              <div className="p-4">
                {/* First Category */}

                <div className="border border-black rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-7 text-center font-bold">
                    <div className="border border-r-0 border-black p-2">
                      รหัสวิชา
                    </div>
                    <div className="border border-r-0 border-black p-2 col-span-2">
                      ชื่อวิชา
                    </div>
                    <div className="border border-r-0 border-black p-2">
                      นก./ชม.
                    </div>
                    <div className="border border-r-0 border-black p-2">
                      ภาคเรียน
                    </div>
                    <div className="border border-r-0 border-black p-2">
                      ชื่อผู้สอบ
                    </div>
                    <div className="border border-black p-2">ผลการเรียน</div>
                  </div>
                  <div className="border border-black border-t-0 flex items-center justify-between p-2">
                    <div className="text-black font-bold mb-2">
                      1. หมวดวิชาศึกษาทั่วไป
                    </div>
                    <div className="flex-1 text-center">
                      ไม่ต่ำกว่า 30 หน่วยกิต
                    </div>
                  </div>
                  <div className="border border-t-0 border-black flex items-center justify-between p-2">
                    <div className="ml-8 mb-1">
                      11 กลุ่มวิชาภาษาและการสื่อสาร
                    </div>
                    <div className="flex-1 text-center">
                      จำนวนไม่น้อยกว่า 12 หน่วยกิต
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="grid grid-cols-7 text-center ">
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        1500201
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2 col-span-2">
                        ภาษาอังกฤษเพื่อการสื่อสารข้ามวัฒนธรรม
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        1500202
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        ภาษาอังกฤษเพื่อการสื่อสารในบริบทสากล
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        1500204
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        การสื่อสารอย่างผู้นํา
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>
                    <div className="text-right pr-2 border border-t-0 border-black">
                      รวม.....................หน่วยกิต
                    </div>
                  </div>
                  {/* box 2 */}
                  <div className="border border-black flex items-center justify-between p-2">
                    <div className="text-black font-bold mb-1">
                      2. หมวดวิชาเฉพาะ
                    </div>
                    <div className="flex-1 text-center">
                      ไม่ต่ำกว่า 92 หน่วยกิต
                    </div>
                  </div>
                  <div className="border border-t-0 border-black flex items-center justify-between p-2">
                    <div className="ml-8 mb-1">2.1 กลุ่มวิชาแกน</div>
                    <div className="flex-1 text-center">
                      จำนวนไม่น้อยกว่า 12 หน่วยกิต
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="grid grid-cols-7 text-center ">
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        7152801
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2 col-span-2">
                        คณิตศาสตร์ดีสครีต
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        7152802
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        พีชคณิตเชิงเส้นและโครงสร้างข้อมูล
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        7153803
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        สถิติและวิธีการเชิงประสบการณ์สําหรับวิศวกรรมซอฟต์แวร์
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>
                    <div className="text-right pr-2 border border-t-0 border-black">
                      รวม.....................หน่วยกิต
                    </div>
                  </div>
                  {/* box 3 */}
                  <div className="border border-black flex items-center justify-between p-2">
                    <div className="text-black font-bold">
                      3. หมวดวิชาเลือกเสรี
                    </div>
                    <div className="flex-1 text-center">
                      ไม่ต่ำกว่า 6 หน่วยกิต
                    </div>
                  </div>
                  <div className="border border-t-0 border-black flex items-center justify-between p-2">
                    <div className="ml-8 mb-1">
                      3.1 กลุ่มวิชาภาษาและการสื่อสาร
                    </div>
                    <div className="flex-1 text-center">
                      จำนวนไม่น้อยกว่า 12 หน่วยกิต
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="grid grid-cols-7 text-center ">
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        1500201
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2 col-span-2">
                        ภาษาอังกฤษเพื่อการสื่อสารข้ามวัฒนธรรม
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-r-0 border-t-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        1500202
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        ภาษาอังกฤษเพื่อการสื่อสารในบริบทสากล
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        1500204
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2 col-span-2">
                        การสื่อสารอย่างผู้นํา
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        3(3-0-6)
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        2654/1
                      </div>
                      <div className="border border-t-0 border-r-0 border-black p-2">
                        ดร.วรเชษฐ์ อุทธา
                      </div>
                      <input
                        className="border border-t-0 border-black p-2 text-center"
                        type="text"
                        placeholder="กรอกเกรด"
                      ></input>
                    </div>
                    <div className="text-right pr-2 border border-t-0 border-black">
                      รวม.....................หน่วยกิต
                    </div>
                  </div>
                  {/* Summary Section */}
                  <div className="mt-4">
                    <div className="col-span-6 text-end">
                      รวมหน่วยกิตตลอดหลักสูตร.......หน่วยกิต
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
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
                    className="px-8 py-2 bg-red text-white rounded-full ml-2"
                  >
                    ส่งให้อาจารย์ที่ปรึกษา
                  </button>
                  <button
                    type="button"
                    className="px-8 py-2 bg-red text-white rounded-full ml-2"
                  >
                    ดาวน์โหลด PDF
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
