import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

const SkeletonTeacher = () => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <div className="skeleton h-6 w-6 mr-2"></div>
      <div>
        <div className="skeleton h-4 w-32 mb-1"></div>
        <div className="skeleton h-3 w-24"></div>
      </div>
    </div>
    <div className="flex space-x-2">
      <div className="skeleton h-8 w-16"></div>
      <div className="skeleton h-8 w-20"></div>
    </div>
  </div>
);

const AllTeacher = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [updatedId, setUpdatedId] = useState("");
  const [updatedFirstname, setUpdatedFirstname] = useState("");
  const [updatedLastname, setUpdatedLastname] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(""); // เพิ่มสถานะสำหรับห้อง
  const [rooms, setRooms] = useState([]); // สถานะสำหรับห้อง
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/getAllTeachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }

        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/getAllTeachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }

        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getAllRoom", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTeachers();
    fetchRooms();
  }, []);


  const startEditing = (teacher) => {
    setEditingTeacher(teacher);
    setUpdatedFirstname(teacher.T_firstname);
    setUpdatedLastname(teacher.T_lastname);
    setUpdatedId(teacher.T_id);
    setSelectedRoom(teacher.T_room);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        T_firstname: updatedFirstname,
        T_lastname: updatedLastname,
        T_id: updatedId,
        T_room: selectedRoom,
      };

      const response = await fetch(
        `http://localhost:3000/api/updateTeacher/${updatedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      const updatedTeacher = await response.json();
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.T_id === updatedTeacher.T_id ? updatedTeacher : teacher
        )
      );

      setEditingTeacher(null);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const deleteTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/deleteTeacher/${teacherToDelete.T_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.T_id !== teacherToDelete.T_id)
      );
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const openAddAdvisorModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowAdvisorModal(true);
  };


  const createAdvisor = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        teacherId: selectedTeacher.T_id,
        roomName: selectedRoom,
        teacherfirstName: selectedTeacher.T_firstname,
        teacherlastName: selectedTeacher.T_lastname,
      };

      const response = await fetch("http://localhost:3000/api/createAdvisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create advisor");
      }

      setShowAdvisorModal(false);
      setSelectedTeacher(null);
      setSuccessMessage(
        `เพิ่ม ${selectedTeacher.T_firstname} ${selectedTeacher.T_lastname} เป็น Advisor สำเร็จ`
      );
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000); 

    } catch (error) {
      setError(error.message);
    }
  };


  if (loading) {
    return (
      <div className="bg-gray-100">
        <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
          <p className="cursor-pointer" onClick={() => navigate("/")}>
            หน้าแรก
          </p>
          <span className="mx-1">&gt;</span>
          <p className="cursor-pointer" onClick={() => navigate("/admin")}>
            เมนูแอดมิน
          </p>
          <span className="mx-1">&gt;</span>
          <p>ดูรายชื่ออาจารย์</p>
        </div>
        <div className="min-h-screen flex justify-center p-6 h-full">
          <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
            <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
              ดูรายชื่ออาจารย์
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-3 flex">
                <div className="flex space-x-4">
                  <div className="relative w-40">
                    <div className="skeleton h-10 w-full rounded-full"></div>
                  </div>
                </div>
                <div className="w-full pl-20 mr-0">
                  <div className="skeleton h-10 w-full rounded-full"></div>
                </div>
              </div>
              <div className="overflow-y-auto h-full">
                <ul className="divide-y divide-gray-200">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                      <SkeletonTeacher />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <div className="skeleton h-10 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>รายชื่ออาจารย์</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6">รายชื่ออาจารย์</h2>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <li
                  key={teacher.T_id}
                  className="py-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                    <div>
                      <p className="text-lg">
                        {teacher.T_firstname} {teacher.T_lastname}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 pr-2">
                    <button
                      className="px-4 py-2 text-white bg-red text-sm rounded"
                      onClick={() => openAddAdvisorModal(teacher)}
                    >
                      Add Advisor
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-orange-300 text-white text-sm rounded"
                      onClick={() => startEditing(teacher)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-red text-sm rounded"
                      onClick={() => confirmDeleteTeacher(teacher)}
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border  rounded"
                onClick={() => navigate("/course")}
              >
                ย้อนกลับ
              </button>
            </div>
          </div>

          {editingTeacher && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                <h2 className="text-xl font-semibold mb-4 text-red">
                  เปลี่ยนตำแหน่งอาจารย์
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveChanges();
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-gray-700">รหัสอาจารย์</label>
                    <input
                      type="text"
                      value={updatedId}
                      onChange={(e) => setUpdatedId(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">ชื่อ</label>
                    <input
                      type="text"
                      value={updatedFirstname}
                      onChange={(e) => setUpdatedFirstname(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">นามสกุล</label>
                    <input
                      type="text"
                      value={updatedLastname}
                      onChange={(e) => setUpdatedLastname(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">ห้อง</label>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">เลือกห้อง</option>
                      {rooms.map((room) => (
                        <option key={room.roomname} value={room.roomname}>
                          {room.roomname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className=" rounded-b-lg p-4 flex justify-between items-center">
                    <button
                      type="button"
                      className="px-4 py-1 border rounded bg-gray-100"
                      onClick={() => setEditingTeacher(null)}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-red border border-red text-white rounded"
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-red text-white rounded-lg shadow-lg p-6">
                <p className="text-xl">อัพเดตข้อมูลสำเร็จ</p>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                <h2 className="text-xl font-semibold mb-4">ยืนยันการลบ</h2>
                <p>คุณต้องการลบอาจารย์คนนี้ใช่ไหม?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-red text-white rounded mr-2"
                    onClick={deleteTeacher}
                  >
                    ลบ
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-white rounded"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAdvisorModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4 text-red">
                  Add Advisor
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Teacher ID
                  </label>
                  <p className="border border-gray-300 rounded-lg p-2">
                    {selectedTeacher.T_id}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <p className="border border-gray-300 rounded-lg p-2">
                    {selectedTeacher.T_firstname}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <p className="border border-gray-300 rounded-lg p-2">
                    {selectedTeacher.T_lastname}
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="A_room"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room
                  </label>
                  <select
                    id="A_room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">เลือกห้อง</option>
                    {rooms.map((room) => (
                      <option key={room.roomname} value={room.roomname}>
                        {room.roomname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-100 text-black px-4 py-2 rounded-md mr-2"
                    onClick={() => setShowAdvisorModal(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="px-4 py-1 bg-red border border-red text-white rounded"
                    onClick={createAdvisor}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
              <div className="bg-red text-white rounded-lg shadow-lg p-6">
                <p className="text-xl">{successMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTeacher;
