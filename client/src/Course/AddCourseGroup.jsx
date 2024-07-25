import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCourseGroup = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/getAllCategories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategories(data.categories || []); // กำหนดค่า default เป็นอาร์เรย์ว่าง
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `Selected Category: ${selectedCategory}, Group Name: ${groupName}`
    );
  };

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="mb-2">เลือกหมวดวิชา</label>
      </div>
      <div className="relative mb-6">
        <select
          id="category"
          className="dropdown appearance-none text-gray-500 w-30 mt-1 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">เลือกหมวดวิชา</option>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col col-span-2">
          <label className="mb-2">ชื่อกลุ่มวิชา</label>
          <input
            type="text"
            className="border rounded-lg px-2 py-2"
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2">จำนวนหน่วยกิต</label>
          <input
            type="number"
            className="border rounded-lg px-2 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
          onClick={() => updateQueryString("addCourseCategory")}
        >
          ย้อนกลับ
        </button>
        {/* Modal */}
        <button
          className="px-8 py-2 bg-red border border-red text-white rounded"
          onClick={() =>
            document.getElementById("my_modal_1").showModal()
          }
        >
          บันทึก
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
            <p className="py-4 text-gray-500">
              กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
            </p>
            <div className="modal-action flex justify-between">
              <form
                method="dialog"
                className="w-full flex justify-between"
              >
                {/* if there is a button in form, it will close the modal */}
                <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                  ปิด
                </button>
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() => updateQueryString("addSubject")}
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
  );
};

export default AddCourseGroup;