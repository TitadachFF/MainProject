import React from 'react'

const CourseInfo = () => {
  return (
    <div className=" min-h-screen flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
        <h2 className="text-2xl font-bold mb-6 text-red-600">ข้อมูลส่วนตัว</h2>
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
                value="ตัวแทนหลักสูตร"
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
      </div>
    </div>
  );
}

export default CourseInfo