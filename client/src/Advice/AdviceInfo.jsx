import React from 'react'
import { useNavigate } from "react-router-dom";

const AdviceInfo = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-gray-100">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>ข้อมูลส่วนตัว</p>
      </div>
      <div className=" min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="container mx-auto w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-full">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ข้อมูลส่วนตัว
          </h2>
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
                <label className="block text-gray-700">ตำแหน่ง</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-gray-500 cursor-not-allowed"
                  value="อาจารย์ที่ปรึกษา"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อผู้ใช้"
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
                onClick={() => navigate("/advice")}  >
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
        </div>
      </div>
    </div>
  );
}

export default AdviceInfo