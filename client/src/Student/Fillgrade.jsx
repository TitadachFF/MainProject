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
              <label className="flex text-gray-700">
                ชื่อ: <p className="font-bold ml-2"> นายณภัทร สายทองสุข</p>
              </label>
              <label className="block text-gray-700">
                รหัสนักศึกษา: 644259030
              </label>
            </div>
            <div className="flex space-x-4">
              <label className="block text-gray-700">
                สาขาวิชา: วิศวกรรมซอฟต์แวร์
              </label>
              <label className="block text-gray-700">
                คณะ: วิทยาศาสตร์และเทคโนโลยี
              </label>
            </div>
            <label className="block text-gray-700 flex">
              ปีการศึกษา :
              <select className="select select-bordered select-xs  max-w-xs ml-2">
                <option disabled selected>
                  เลือกปีการศึกษา
                </option>
                <option>2564</option>
                <option>2565</option>
                <option>2566</option>
                <option>2567</option>
              </select>
            </label>

            <div className="flex">
              <label className="block text-gray-700 mr-2">เทอม :</label>
              <input
                type="radio"
                name="radio-1"
                className="radio mr-2"
                defaultChecked
              />
              <p className="mr-2">ทั้งหมด</p>
              <input type="radio" name="radio-1" className="radio mr-2" />
              <p className="mr-2">1</p>
              <input type="radio" name="radio-1" className="radio mr-2" />
              <p className="mr-2">2</p>
            </div>
          </div>
          <br />
          {/* Table */}
          <div className="overflow-x-auto border">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-base-300">
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>นก./ชม.</th>
                  <th>ภาคเรียน</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 1,
                    code: "150001",
                    name: "ภาษาอังกฤษเพื่อการสื่อสารในสังคม 1",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
                  {
                    id: 2,
                    code: "2000201",
                    name: "ปรัชญาของเศรษฐกิจพอเพียง",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
                  {
                    id: 3,
                    code: "7151101",
                    name: "การบริหารและการจัดการฐานข้อมูล",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
                  {
                    id: 4,
                    code: "7151201",
                    name: "ปฏิสัมพันธ์ระหว่างมนุษย์กับคอมพิวเตอร์",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
                  {
                    id: 5,
                    code: "7151301",
                    name: "การออกแบบอัลกอริทึมเบื้องต้น",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
                  {
                    id: 6,
                    code: "7152501",
                    name: "องค์ประกอบและสถาปัตยกรรมคอมพิวเตอร์",
                    credits: "3(3-0-6)",
                    semester: "2564/1",
                  },
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
                          <div className="p-4 bg-gray-100 rounded-md">
                            {/* ข้อมูลเพิ่มเติมที่ต้องการแสดงเมื่อแถวขยาย */}
                            <div className="flex space-x-4">
                              <label className="flex text-gray-700">
                                <input
                                  type="text"
                                  placeholder="ชื่อผู้สอน"
                                  className="input input-bordered input-sm  max-w-xs"
                                />
                              </label>
                              <label className="block text-gray-700">
                                <select className="select select-bordered select-sm w-full max-w-xs">
                                  <option disabled selected>
                                    ผลการเรียน
                                  </option>
                                  <option>P(Pass)</option>
                                  <option>A</option>
                                  <option>B+</option>
                                  <option>B</option>
                                  <option>C+</option>
                                  <option>C</option>
                                  <option>D</option>
                                </select>
                              </label>
                              <label className="block text-gray-700">
                                <input
                                  type="text"
                                  placeholder="หมายเหตุ"
                                  className="input input-bordered input-sm  max-w-xs"
                                />
                              </label>
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
              onClick={() => (window.location.href = "/qweqe.pdf")}
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
