import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllTeacher = () => {
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [advisorToDelete, setAdvisorToDelete] = useState(null);
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [updatedAdvisor, setUpdatedAdvisor] = useState({});
  const [sections, setSections] = useState([]);


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getSections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sections");
        }
        const sectionData = await response.json();
        setSections(sectionData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSections();
  }, []);


  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getAdvisors"
        );
        setAdvisors(response.data);
        setFilteredAdvisors(response.data);
      } catch (error) {
        console.error("Error fetching advisors:", error.message);
      }
    };

    fetchAdvisors();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAdvisors(
      advisors.filter((advisor) =>
        `${advisor.firstname} ${advisor.lastname}`.toLowerCase().includes(term)
      )
    );
  };

  const startEditing = (advisor) => {
    setEditingAdvisor(advisor);
    setUpdatedAdvisor(advisor);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAdvisor((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/updateAdvisor/${updatedAdvisor.id}`,
        updatedAdvisor
      );
      setShowSuccessModal(true);
      setEditingAdvisor(null);
      // Refresh list after successful update
      const response = await axios.get("http://localhost:3000/api/getAdvisors");
      setAdvisors(response.data);
      setFilteredAdvisors(response.data);
    } catch (error) {
      console.error("Error updating advisor:", error.message);
    }
  };

  const confirmDeleteAdvisor = (advisor) => {
    setAdvisorToDelete(advisor);
    setShowDeleteModal(true);
  };

  const deleteAdvisor = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/deleteAdvisor/${advisorToDelete.id}`
      );
      setShowDeleteModal(false);
      setAdvisorToDelete(null);
      // Refresh list after successful delete
      const response = await axios.get("http://localhost:3000/api/getAdvisors");
      setAdvisors(response.data);
      setFilteredAdvisors(response.data);
    } catch (error) {
      console.error("Error deleting advisor:", error.message);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>รายชื่ออาจารย์</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6">รายชื่ออาจารย์</h2>
          <div className="mb-3 flex">
            <div className="w-full pl-20 mr-0">
              <input
                type="text"
                id="search"
                className="w-full mt-1 bg-white border border-gray-300 rounded-full py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                placeholder="ค้นหาชื่ออาจารย์"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {filteredAdvisors.map((advisor) => {
                return (
                  <li
                    key={advisor.id}
                    className="py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div>
                        <p className="text-lg">
                          {advisor.firstname} {advisor.lastname}
                        </p>
                        {advisor && (
                          <p className="text-sm text-gray-500">
                            หมู่เรียน {advisor.sec_name || "หมู่เรียนไม่ระบุ"}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          เบอร์โทร: {advisor.phone || "ไม่ระบุ"}
                        </p>
                        <p className="text-sm text-gray-500">
                          อีเมล: {advisor.email || "ไม่ระบุ"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 pr-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-orange-300 text-white text-sm rounded"
                        onClick={() => startEditing(advisor)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="px-4 py-2 text-white bg-red rounded"
                        onClick={() => confirmDeleteAdvisor(advisor)}
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border rounded"
              onClick={() => navigate("/advice")}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {editingAdvisor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-4/5 md:w-1/2 lg:w-1/3 h-3/5 max-h-screen flex flex-col">
            <div className="text-white rounded-t-lg p-4 flex-shrink-0">
              <h3 className="text-xl text-red">แก้ไขอาจารย์</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="firstname"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedAdvisor.firstname || ""}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="lastname"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedAdvisor.lastname || ""}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  เบอร์โทร
                </label>
                <input
                  type="text"
                  name="phone"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedAdvisor.phone || ""}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedAdvisor.email || ""}
                  onChange={handleUpdateChange}
                />
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-white rounded mr-2"
                onClick={() => setEditingAdvisor(null)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={saveChanges}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-green-500">อัปเดตสำเร็จ!</p>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-500">
              คุณแน่ใจว่าต้องการลบอาจารย์นี้ใช่ไหม?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-white rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={deleteAdvisor}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTeacher;
