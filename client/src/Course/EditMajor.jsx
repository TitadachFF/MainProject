// EditMajor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const majorId = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajor = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getMajorById/${majorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Major data");
        }
        const data = await response.json();
        setMajor(data.major); // Assume data.major is the data received
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/getAllCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Categories");
        }
        const data = await response.json();
        setCategories(data.categories); // Assume data.categories is the data received
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    const fetchGroups = async (categoryId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getGroupsByCategory/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Groups");
        }
        const data = await response.json();
        setGroups(data.groups); // Assume data.groups is the data received
      } catch (error) {
        console.error("Error fetching Groups:", error);
      }
    };

    if (majorId) {
      fetchMajor();
    }
    fetchCategories();
  }, [majorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor({
      ...major,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/updateMajor/${major.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(major),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Major");
      }

      navigate("/course");
    } catch (error) {
      console.error("Error updating Major:", error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    await fetchGroups(categoryId);
  };

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
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            แก้ไขหลักสูตร
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">
                  ชื่อหลักสูตร(ภาษาไทย)
                </label>
                <input
                  type="text"
                  name="majorNameTH"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อหลักสูตร(ภาษาไทย)"
                  value={major.majorNameTH}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  ชื่อหลักสูตร(ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  name="majorNameENG"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อหลักสูตร(ภาษาอังกฤษ)"
                  value={major.majorNameENG}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <div className="mr-4 w-1/3">
                  <label className="block text-gray-700">รหัสหลักสูตร</label>
                  <input
                    type="text"
                    name="majorCode"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสหลักสูตร"
                    value={major.majorCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="mr-4 w-1/3">
                  <label className="block text-gray-700">หลักสูตรปี</label>
                  <input
                    type="text"
                    name="majorYear"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="หลักสูตรปี"
                    value={major.majorYear}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    name="majorUnit"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="จำนวนหน่วยกิต"
                    value={major.majorUnit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">
                  อาจารย์ผู้รับผิดชอบหลักสูตร
                </label>
                <input
                  type="text"
                  name="majorSupervisor"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="อาจารย์ผู้รับผิดชอบหลักสูตร"
                  value={major.majorSupervisor}
                  onChange={handleChange}
                />
              </div>

              {/* Categories Section */}
              <div className="mt-6">
                {categories.map((category) => (
                  <details
                    key={category.id}
                    className="collapse bg-base-200 mb-2"
                    open={category.id === selectedCategoryId}
                  >
                    <summary
                      className="collapse-title text-xl font-medium cursor-pointer bg-red text-white"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.categoryName}
                    </summary>
                    <div className="collapse-content">
                      {category.id === selectedCategoryId && (
                        <ul>
                          {groups.map((group) => (
                            <li key={group.id} className="py-2">
                              {group.groupName} - {group.groupUnit}
                            </li>
                          ))}
                        </ul>
                      )}
                      {category.id !== selectedCategoryId && <p>กลุ่มวิชา</p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                onClick={() => navigate("/allcourse")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-2 bg-red text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMajor;
