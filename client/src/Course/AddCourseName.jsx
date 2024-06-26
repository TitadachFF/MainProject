import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddCourseName = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
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
      {" "}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">ชื่อหลักสูตร(ภาษาไทย)</label>
            <input type="text" className="border rounded-lg px-2 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ชื่อหลักสูตร(ภาษาอังกฤษ)</label>
            <input type="text" className="border rounded-lg px-2 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">รหัสหลักสูตร</label>
            <input type="text" className="border rounded-lg px-2 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">หลักสูตร ปี</label>
            <input type="text" className="border rounded-lg px-2 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">จำนวนหน่วยกิต</label>
            <input type="number" className="border rounded-lg px-2 py-2" />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => navigate("/course")}
          >
            ย้อนกลับ
          </button>
          {/* Modal */}
          <button
            className="px-8 py-2 bg-red border border-red text-white rounded"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            บักทึก
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
              <p className="py-4 text-gray-500">
                กดปุ่ม ESC หรือ กดปุ่มปิดด้านล้างเพื่อปิด
              </p>
              <div className="modal-action flex justify-between">
                <form method="dialog" className="w-full flex justify-between">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                    ปิด
                  </button>
                  <button
                    className="px-8 py-2 bg-red border border-red text-white rounded"
                    onClick={() => updateQueryString("addTeacher")}
                  >
                    ถัดไป
                  </button>
                </form>
              </div>
            </div>
          </dialog>
          {/* End Modal */}
        </div>
      </form>
    </div>
  );
};

export default AddCourseName;
