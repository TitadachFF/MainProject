import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StudentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "studentinfo";

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
    <div className=" bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/student")}>
          เมนูนักศึกษา
        </p>
        <span className="mx-1">&gt;</span>
        <p>ข้อมูลส่วนตัว</p>
      </div>
      <div className=" min-h-screen flex justify-center bg-gray-100 ">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full ">
          <h2 className="text-2xl font-bold mb-6 text-red">ข้อมูลส่วนตัว</h2>
          <div className="border-b mb-6 pb-3">
            <ul className="flex">
              <li
                className="mr-4"
                onClick={() => updateQueryString("studentinfo")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "studentinfo"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  ขอมูลทั่วไป
                </a>
              </li>
              <li
                className="mr-4"
                onClick={() => updateQueryString("infotodocument")}
              >
                <a
                  className={`cursor-pointer border-b-2 ${
                    currentForm === "infotodocument"
                      ? "border-red"
                      : "text-gray-600"
                  }`}
                >
                  ข้อมูลสำหรับเอกสาร
                </a>
              </li>
            </ul>
          </div>
          {currentForm === "studentinfo" && (
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
                  className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                  onClick={() => navigate("/student")}
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  className="px-8 py-2 bg-red  border border-red-600 text-white rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}
          {currentForm === "infotodocument" && (
            <form>
              <div className="grid grid-cols-1 gap-6" >
                <div>
                  <label className="block text-gray-700">ชื่อ</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ชื่ออังกฤษ</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ชื่ออังกฤษ"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">รหัสประจำตัว</label>
                  <input
                    type="text"
                    className="w-20 mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสประจำตัว"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">เลขบัตรประชาชน</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="เลขบัตรประชาชน"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">คณะ</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="คณะ"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ศูนย์</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ศูนย์"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">สาขาวิชา</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="สาขาวิชา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">วิชาโท</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="วิชาโท"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ชื่อปริญญา</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ชื่อปริญญา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    ปีการศึกษาที่เข้า
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ปีการศึกษา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">สถานภาพ</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="สภานภาพ"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">วิธีรับเข้า</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="วิธีรับเข้า"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    วุฒิก่อนเข้ารับการศึกษา
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="วุฒิก่อนเข้ารับการศึกษา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    สถานะส่งวุฒิการศึกษา
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="สถานะ"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">จบการศึกษาจาก</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="จบการศึกษาจาก"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">อ.ที่ปรึกษา</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="อาจารย์ที่ปรึกษา"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ที่อยู่</label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ที่อยู่"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between ">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                  onClick={() => navigate("/student")}
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
