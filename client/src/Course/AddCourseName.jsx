import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddCourseName = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false); 
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    major_code: "",
    majorNameTH: "",
    majorNameENG: "",
    majorYear: "",
    majorUnit: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "majorUnit") {
      if (value >= 0) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleToggle = () => {
    setFormData((prevState) => ({
      ...prevState,
      status: prevState.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { major_code, majorNameTH, majorNameENG, majorYear, majorUnit } =
      formData;
    if (
      !major_code ||
      !majorNameTH ||
      !majorNameENG ||
      !majorYear ||
      !majorUnit
    ) {
      document.getElementById("my_modal_1").showModal();
      setMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน !");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/createMajor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
        setMessage("เพิ่มหลักสูตรสำเร็จ !");
        setIsSuccess(true);
      } else if (response.status === 409) {
        document.getElementById("my_modal_1").showModal();
        setMessage("* รหัสหลักสูตรนี้มีอยู่แล้ว");
        setIsSuccess(false);
      } else {
        const errorData = await response.json();
        document.getElementById("my_modal_1").showModal();
        setMessage("* เกิดข้อผิดพลาดในการส่งข้อมูล");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("my_modal_1").showModal();
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      setIsSuccess(false);
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
              id="input-majornameth"
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
              id="input-majornameeng"
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
              id="input-majorcode"
              type="text"
              name="major_code"
              className="border rounded-lg px-2 py-2"
              value={formData.major_code}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">หลักสูตร ปี</label>
            <input
              id="input-majoryear"
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
              id="input-majorunit"
              type="number"
              name="majorUnit"
              className="border rounded-lg px-2 py-2"
              value={formData.majorUnit}
              onChange={handleChange}
              min="0" // กำหนดค่า minimum เป็น 0
            />
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-2">สถานะ</label>
          <div className="flex items-center">
            <p className="font-semibold">Inactive</p>
            <input
              type="checkbox"
              className="toggle toggle-info text-red mr-2  ml-2"
              checked={formData.status === "ACTIVE"}
              onChange={handleToggle}
            />
            <p className="font-semibold">Active</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            id="back-button"
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => navigate("/course")}
          >
            ย้อนกลับ
          </button>
          <button
            id="savebutton"
            type="submit"
            className="px-8 py-2 bg-red border border-red text-white rounded"
          >
            บันทึก
          </button>
        </div>
      </form>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 id="alertmodal" className="font-bold text-lg">
            {message}
          </h3>
          <p className="py-4 text-gray-500">
            กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
          </p>
          <div className="modal-action flex justify-between">
            <form method="dialog" className="w-full flex justify-between">
              <button
                id="close-alertmodal"
                className="px-10 py-2 bg-white text-red border font-semibold border-red rounded"
              >
                ปิด
              </button>
              {isSuccess && (
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() => updateQueryString("addCourseCategory")}
                >
                  ถัดไป
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddCourseName;
