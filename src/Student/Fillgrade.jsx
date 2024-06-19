import React from "react";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
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
        <p>แบบบันทึกผลการเรียน</p>
      </div>
      <div className=" min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            กรอกแบบบันทึกผลการเรียน
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex space-x-4">
              <label className="block text-gray-700">ชื่อ:</label>
              <label className="block text-gray-700">รหัสนักศึกษา:</label>
            </div>
            <div className="flex space-x-4">
              <label className="block text-gray-700">สาขาวิชา:</label>
              <label className="block text-gray-700">คณะ:</label>
            </div>
            <label className="block text-gray-700">ปีการศึกษา:</label>
            <div>
              <label className="block text-gray-700">เทอม</label>
            </div>
          </div>
          <br />
          {/* Table */}
          <div className="overflow-x-auto border">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-base-200">
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>นก./ชม.</th>
                  <th>ภาคเรียน</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="hover cursor-pointer">
                  <th>150001</th>
                  <td>ภาษาอังกฤษเพื่อการสื่อสารในสังคม</td>
                  <td>3(3-0-6)</td>
                  <td>2564/1</td>
                </tr>
                {/* row 2 */}
                <tr className="hover cursor-pointer">
                <th>150001</th>
                  <td>ภาษาอังกฤษเพื่อการสื่อสารในสังคม</td>
                  <td>3(3-0-6)</td>
                  <td>2564/1</td>
                </tr>
                {/* row 3 */}
                <tr className="hover cursor-pointer">
                <th>150001</th>
                  <td>ภาษาอังกฤษเพื่อการสื่อสารในสังคม</td>
                  <td>3(3-0-6)</td>
                  <td>2564/1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
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
        </div>
      </div>
    </div>
  );
};

export default Fillgrade;
