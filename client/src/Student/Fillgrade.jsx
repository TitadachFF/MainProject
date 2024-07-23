import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Fillgrade = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (index) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(index);

    const newExpandedRows = isRowExpanded
      ? currentExpandedRows.filter((id) => id !== index)
      : currentExpandedRows.concat(index);

    setExpandedRows(newExpandedRows);
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
        <p>แบบบันทึกผลการเรียน</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6 ">
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
                {[
                  { id: 1, code: "150001", name: "ภาษาอังกฤษเพื่อการสื่อสารในสังคม", credits: "3(3-0-6)", semester: "2564/1" },
                  { id: 2, code: "150001", name: "ภาษาอังกฤษเพื่อการสื่อสารในสังคม", credits: "3(3-0-6)", semester: "2564/1" },
                  { id: 3, code: "150001", name: "ภาษาอังกฤษเพื่อการสื่อสารในสังคม", credits: "3(3-0-6)", semester: "2564/1" },
                ].map((row, index) => (
                  <>
                    <tr
                      key={row.id}
                      className="hover cursor-pointer"
                      onClick={() => handleRowClick(index)}
                    >
                      <th>{row.code}</th>
                      <td>{row.name}</td>
                      <td>{row.credits}</td>
                      <td>{row.semester}</td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr>
                        <td colSpan="4">
                          <div className="p-4 bg-gray-100">
                            {/* ข้อมูลเพิ่มเติมที่ต้องการแสดงเมื่อแถวขยาย */}
                            <div className="flex space-x-4">
                              <label className="block text-gray-700">ชื่อผู้สอน:</label>
                              <label className="block text-gray-700">ผลการเรียน:</label>
                              <label className="block text-gray-700">หมายเหตุ:</label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
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
              className="px-8 py-2 bg-red border border-red-600 text-white rounded"
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
