import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddCourseName = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    majorNameTH: "",
    majorNameENG: "",
    majorYear: "",
    majorUnit: "",
    majorCode: "",
    majorStatus: "",
    majorSupervisor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/createMajor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ major: formData }),
      });
      
      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const currentForm = getQueryStringValue("form") || "addCourse";

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">ชื่อหลักสูตร(ภาษาไทย)</label>
            <input
              type="text"
              name="majorNameTH"
              className="border rounded-lg px-2 py-2"
              value={formData.majorNameTH}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
            <input
              type="text"
              name="majorNameENG"
              className="border rounded-lg px-2 py-2"
              value={formData.majorNameENG}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">รหัสหลักสูตร</label>
            <input
              type="text"
              name="majorCode"
              className="border rounded-lg px-2 py-2"
              value={formData.majorCode}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">หลักสูตร ปี</label>
            <input
              type="text"
              name="majorYear"
              className="border rounded-lg px-2 py-2"
              value={formData.majorYear}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <input
              type="number"
              name="majorUnit"
              className="border rounded-lg px-2 py-2"
              value={formData.majorUnit}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">สถานะ</label>
            <input
              type="text"
              name="majorStatus"
              className="border rounded-lg px-2 py-2"
              value={formData.majorStatus}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="mb-2">อาจารย์ผู้รับผิดชอบหลักสูตร</label>
          <input
            type="text"
            name="majorSupervisor"
            className="border rounded-lg px-2 py-2 mb-2 mt-2 block w-full"
            placeholder="ชื่อ-สกุล อาจารย์"
            value={formData.majorSupervisor}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => navigate("/course")}
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

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
          <p className="py-4 text-gray-500">
            กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
          </p>
          <div className="modal-action flex justify-between">
            <form method="dialog" className="w-full flex justify-between">
              <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                ปิด
              </button>
              <button
                className="px-8 py-2 bg-red border border-red text-white rounded"
                onClick={() => updateQueryString("addCourseCategory")}
              >
                ถัดไป
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddCourseName;