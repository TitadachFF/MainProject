import React from "react";
import { useNavigate } from "react-router-dom";

const Documentres = () => {
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
        <p>คำตอบกลับเอกสาร</p>
      </div>
      <div className=" min-h-screen flex justify-center p-6  ">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6 ">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            คำตอบกลับเอกสาร
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <label className="block text-gray-700 font-bold text-xl">
              สถานะ: <span className="text-red font-medium">ไม่ผ่าน</span>
            </label>

            <label className="block text-gray-700 text-lg">เอกสาร:</label>
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
          <div className="py-4">
            <label className="block text-gray-700  text-lg">หมายเหตุ:</label>
          </div>
          <div className="indicator">
            <div className="card border">
              <div className="card-body w-96">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  fuga maiores veritatis odit cumque quia at consectetur facilis
                  officia quibusdam aliquam facere quas eius, eum reiciendis
                  voluptatem optio, aperiam voluptatibus!Lorem Lorem ipsum,
                  dolor sit amet consectetur adipisicing elit. Ipsa dolores,
                  laborum deleniti aliquid inventore, exercitationem nam libero
                  dolore, eius debitis corrupti! Qui, ipsa at voluptate vel
                  aliquid explicabo. Atque, nostrum.
                </p>
              </div>
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
              ส่งอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentres;
