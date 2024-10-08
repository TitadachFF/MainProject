import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditCategory = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    category_unit: "",
  });
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const handleChangeCategory = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}api/createCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_name: newCategory.category_name,
          category_unit: parseInt(newCategory.category_unit, 10), // Convert to integer
          major_id: major.major_id, // Assumes major ID is available
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add Category");
      }
      const newCategoryData = await response.json();
      // Add new category to state
      setCategories((prevCategories) => [...prevCategories, newCategoryData]);
      setNewCategory({ category_name: "", category_unit: "" }); // Reset form
      setShowAddCategoryModal(false); // Close the modal after adding category
      alert("เพิ่มหมวดวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มหมวดวิชา.");
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบหมวดหมู่นี้?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}api/deleteCategory/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to delete Category ${categoryId}`);
        }
        // Remove deleted category from state
        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) => category.category_id !== categoryId
          )
        );
        alert("ลบหมวดวิชาเรียบร้อยแล้ว!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("เกิดข้อผิดพลาดในการลบหมวดวิชา.");
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}api/updateCategory/${editingCategory.category_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category_name: editingCategory.category_name,
            category_unit: parseInt(editingCategory.category_unit, 10),
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update Category ${editingCategory.category_id}`
        );
      }
      // Update categories state
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.category_id === editingCategory.category_id
            ? editingCategory
            : category
        )
      );
      setEditingCategory(null); // Close modal
      alert("อัพเดตข้อมูลหมวดวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error updating category data:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูลหมวดวิชา.");
    }
  };

  const handleBack = (id) => {
    navigate(`/editMajor?editMajor=${major_code}`);
  };

  useEffect(() => {
    const fetchMajorAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const majorResponse = await fetch(
          `${apiUrl}api/getMajorByCode/${major_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!majorResponse.ok) {
          throw new Error("Failed to fetch Major data");
        }
        const majorData = await majorResponse.json();
        setMajor(majorData);

        const categoriesResponse = await fetch(
          `${apiUrl}api/getCategoriesByMajorCode/${major_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch Categories data");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (major_code) {
      fetchMajorAndCategories();
    }
  }, [major_code]);

  if (!major) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/allcourse")}>
          ดูหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>แก้ไขหลักสูตร</p>
      </div>
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold">แก้ไขหมวดวิชา</h2>
          <form>
            <p className="text-red px-2 font-semibold py-2">
              หลักสูตร {major.major_code} {major.majorNameTH}
            </p>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setShowAddCategoryModal(true)} // Open modal on button click
            >
              เพิ่มหมวดวิชา
            </button>
            <div className="grid grid-cols-1 py-2 gap-2">
              {categories.map((category) => (
                <div
                  key={category.category_id}
                  className="border border-gray-300 rounded-md p-1"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <span className="text-gray-700 font-semibold">
                        {category.category_name}
                      </span>
                      <span className="text-gray-500">
                        จำนวนไม่น้อยกว่า: {category.category_unit} หน่วยกิต
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={() => handleEditClick(category)}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        className="bg-red text-white px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => handleDelete(category.category_id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
          <div className="flex justify-between py-2">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border rounded"
              onClick={handleBack}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {/* Modal for editing category */}
      {editingCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">แก้ไขหมวดวิชา</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อหมวดวิชา
              </label>
              <input
                type="text"
                name="category_name"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCategory.category_name}
                onChange={handleChangeCategory}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                หน่วยกิต
              </label>
              <input
                type="number"
                name="category_unit"
                className="w-full border border-gray-300 rounded p-2"
                value={editingCategory.category_unit}
                onChange={handleChangeCategory}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-white px-4 py-2 rounded"
                onClick={() => setEditingCategory(null)} // ปิดโมดัลแก้ไขหมวดวิชา
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding new category */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">เพิ่มหมวดวิชา</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อหมวดวิชา
              </label>
              <input
                type="text"
                name="category_name"
                className="w-full border border-gray-300 rounded p-2"
                value={newCategory.category_name}
                onChange={handleNewCategoryChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                หน่วยกิต
              </label>
              <input
                type="number"
                name="category_unit"
                className="w-full border border-gray-300 rounded p-2"
                value={newCategory.category_unit}
                onChange={handleNewCategoryChange}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-white px-4 py-2 rounded"
                onClick={() => setShowAddCategoryModal(false)} // แก้ไขตรงนี้
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddCategory}
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategory;
