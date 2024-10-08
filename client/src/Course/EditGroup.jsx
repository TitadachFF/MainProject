import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditGroup = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [newGroup, setNewGroup] = useState({
    group_name: "",
    group_unit: "",
    category_id: "", // Assuming this is needed, adjust as necessary
  });
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const navigate = useNavigate();

  const handleNewGroupChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prevGroup) => ({
      ...prevGroup,
      [name]: value,
    }));
  };
  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleAddGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}api/createGroupMajor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            group_name: newGroup.group_name,
            group_unit: parseInt(newGroup.group_unit, 10), // Convert to integer
            category_id: parseInt(newGroup.category_id, 10), // Convert to integer if necessary
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add Group");
      }
      const newGroupData = await response.json();
      // Add new group to state
      setGroups((prevGroups) => [...prevGroups, newGroupData]);
      setNewGroup({ group_name: "", group_unit: "", category_id: "" }); // Reset form
      setShowAddGroupModal(false); // Close the modal after adding group
      alert("เพิ่มกลุ่มวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error adding group:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มกลุ่มวิชา.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบกลุ่มนี้?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}api/deleteGroupMajor/${groupId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to delete Group ${groupId}`);
        }
        // Remove deleted group from state
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.group_id !== groupId)
        );
        alert("ลบกลุ่มวิชาเรียบร้อยแล้ว!");
      } catch (error) {
        console.error("Error deleting group:", error);
        alert("เกิดข้อผิดพลาดในการลบกลุ่มวิชา.");
      }
    }
  };

  const handleEditGroupClick = (group) => {
    setEditingGroup(group);
  };

  const handleSaveGroupChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}api/updateGroupMajor/${editingGroup.group_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            group_name: editingGroup.group_name,
            group_unit: parseInt(editingGroup.group_unit, 10), // แปลงค่าให้เป็น int
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update Group ${editingGroup.group_id}`);
      }
      // Update groups state
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.group_id === editingGroup.group_id ? editingGroup : group
        )
      );
      setEditingGroup(null); // Close modal
      alert("อัพเดตข้อมูลกลุ่มวิชาเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error updating group data:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูลกลุ่มวิชา.");
    }
  };

  const handleSubmit = async () => {
    // Call API to save changes for all categories if needed
    // Handle additional save logic here if needed
  };

  const handleBack = (id) => {
    navigate(`/editMajor?editMajor=${major_code}`);
  };

  useEffect(() => {
    const fetchGroups = async (category_id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}api/getGroupsByCategoryId/${category_id}`,
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
        return data || [];
      } catch (error) {
        console.error("Error fetching Groups:", error);
        return [];
      }
    };
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

        // Fetch groups for each category
        const allGroups = await Promise.all(
          categoriesData.map((category) => fetchGroups(category.category_id))
        );
        setGroups(allGroups.flat()); // Combine all groups into one array
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
        <p>แก้ไขหมวดวิชา</p>
      </div>
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold">แก้ไขกลุ่มวิชา</h2>
          <form>
            <p className="text-red px-2 font-semibold py-2">
              หลักสูตร {major.major_code} {major.majorNameTH}
            </p>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setShowAddGroupModal(true)} // Open modal on button click
            >
              เพิ่มกลุ่มวิชา
            </button>
            <div className="grid grid-cols-1 py-2 gap-2">
              {groups.map((group) => {
                const groupCategory = categories.find(
                  (category) => category.category_id === group.category_id
                );

                return (
                  <div
                    key={group.group_id}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <span className="text-gray-700 font-semibold">
                          {group.group_name}
                        </span>
                        <span className="text-gray-500">
                          จำนวนไม่น้อยกว่า: {group.group_unit}หน่วยกิต
                        </span>
                        {groupCategory && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                            หมวดวิชา: {groupCategory.category_name}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                          onClick={() => handleEditGroupClick(group)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          className="bg-red text-white px-4 py-2 rounded hover:bg-gray-400 ml-2"
                          onClick={() => handleDeleteGroup(group.group_id)}
                        >
                          ลบ
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                );
              })}
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
            <button
              type="button"
              className="bg-red text-white px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      {/* Modal for editing category */}
      {editingGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">แก้ไขกลุ่มวิชา</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อกลุ่มวิชา
              </label>
              <input
                type="text"
                name="group_name"
                className="w-full border border-gray-300 rounded p-2"
                value={editingGroup.group_name}
                onChange={(e) =>
                  setEditingGroup({
                    ...editingGroup,
                    group_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                หน่วยกิต
              </label>
              <input
                type="text"
                name="group_unit"
                className="w-full border border-gray-300 rounded p-2"
                value={editingGroup.group_unit}
                onChange={(e) =>
                  setEditingGroup({
                    ...editingGroup,
                    group_unit: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-white px-4 py-2 rounded"
                onClick={() => setEditingGroup(null)} // Close modal
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveGroupChanges}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for adding new category */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">เพิ่มกลุ่มวิชา</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                หมวดวิชา
              </label>
              <select
                name="category_id"
                className="w-full border border-gray-300 rounded p-2"
                value={newGroup.category_id}
                onChange={handleNewCategoryChange}
              >
                <option value="">เลือกหมวดวิชา</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                ชื่อกลุ่มวิชา
              </label>
              <input
                type="text"
                name="group_name"
                className="w-full border border-gray-300 rounded p-2"
                value={newGroup.group_name}
                onChange={handleNewGroupChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                จำนวนหน่วยกิต
              </label>
              <input
                type="number"
                name="group_unit"
                className="w-full border border-gray-300 rounded p-2"
                value={newGroup.group_unit}
                onChange={handleNewGroupChange}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-white px-4 py-2 rounded"
                onClick={() => setShowAddGroupModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddGroup}
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}
      ;
    </div>
  );
};

export default EditGroup;
