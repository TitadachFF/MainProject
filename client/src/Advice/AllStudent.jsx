import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

const SkeletonUser = () => (
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
      <div className="skeleton h-8 w-12"></div>
    </div>
  </div>
);



const AllStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  //const [showErrorModal, setShowErrorModal] = useState(false);

  const [updatedStudent, setUpdatedStudent] = useState({
    id: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    room: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getStudents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);

        // ดึงข้อมูล Section และอัปเดต roomOptions ด้วย section names
        const sectionResponse = await fetch(
          "http://localhost:3000/api/getSections",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!sectionResponse.ok) {
          throw new Error("Failed to fetch sections");
        }
        const sections = await sectionResponse.json();
        setRoomOptions(sections);

        // Log section data for debugging
        //console.log("Fetched sections:", sections);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);



  useEffect(() => {
    const filtered = students.filter((student) => {
      const isInSelectedRoom =
        selectedRoom === "" || student.sec_id === parseInt(selectedRoom);

      const isInSearchTerm =
        searchTerm === "" ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase());

      return isInSelectedRoom && isInSearchTerm;
    });
    setFilteredStudents(filtered);
  }, [students, selectedRoom, searchTerm]);


  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const startEditing = (student) => {
    setEditingStudent(student);
    setUpdatedStudent({
      id: student.student_id,
      firstname: student.firstname,
      lastname: student.lastname,
      phone: student.phone,
      email: student.email,
      room:
        // หาชื่อห้อง (sec_name) ที่ตรงกับ sec_id ของนักเรียนจากรายการห้องที่มี
        roomOptions.find((room) => room.sec_id === student.sec_id)?.sec_name ||
        "",
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      // หา sec_id ของห้องที่ตรงกับชื่อห้องใน updatedStudent
      const room = roomOptions.find(
        (room) => room.sec_name === updatedStudent.room
      );
      const secId = room ? room.sec_id : "";

      // ตรวจสอบว่า editingStudent มีข้อมูลที่ถูกต้องก่อนที่จะทำการอัปเดต
      if (!editingStudent || !editingStudent.student_id) {
        throw new Error("Invalid student data");
      }

      const response = await fetch(
        `http://localhost:3000/api/updateStudent/${editingStudent.student_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedStudent,
            sec_id: secId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudentData = await response.json();
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.student_id === updatedStudentData.student_id
            ? updatedStudentData
            : student
        )
      );

      setEditingStudent(null);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1000);
    } catch (error) {
      setError(error.message);
    }
  };



  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const deleteStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      // ตรวจสอบว่ามีข้อมูลของนักเรียนที่ต้องการลบหรือไม่
      if (!studentToDelete || !studentToDelete.student_id) {
        throw new Error("Student ID is undefined");
      }
      const response = await fetch(
        `http://localhost:3000/api/deleteStudent/${studentToDelete.student_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student.student_id !== studentToDelete.student_id
        )
      );
      setShowDeleteModal(false);
      setStudentToDelete(null);
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
          <p className="cursor-pointer" onClick={() => navigate("/advice")}>
            อาจารย์
          </p>
          <span className="mx-1">&gt;</span>
          <p>ดูราชื่อนักศึกษา</p>
        </div>
        <div className="min-h-screen flex justify-center p-6 h-full">
          <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
            <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
              ดูรายชื่อนักศึกษา
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
                      <SkeletonUser />
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
        <p className="cursor-pointer" onClick={() => navigate("/advice")}>
          เมนูอาจารย์
        </p>
        <span className="mx-1">&gt;</span>
        <p>รายชื่อนักศึกษา</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg p-6  ">
          <h2 className="text-2xl text-red font-bold mb-6">รายชื่อนักศึกษา</h2>
          <div className="mb-3 flex">
            <div className="w-40">
              <div className="relative">
                <select
                  id="room"
                  className="dropdown appearance-none w-full mt-1 bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                  value={selectedRoom}
                  onChange={handleRoomChange}
                >
                  <option value="">ทั้งหมด</option>
                  {roomOptions.map((room) => (
                    <option key={room.sec_id} value={room.sec_id}>
                      {room.sec_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full pl-20 mr-0">
              <input
                type="text"
                id="search"
                className="w-full mt-1 bg-white border border-gray-300 rounded-full py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                placeholder="ค้นหาชื่อนักศึกษา"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                // หาชื่อหมู่เรียนจากข้อมูลของนักเรียนที่มี sec_id ตรงกับ roomOptions
                const secName = roomOptions.find(
                  (sec) => sec.sec_id === student.sec_id
                )?.sec_name;
                return (
                  <li
                    key={student.id}
                    className="py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                      <div>
                        <p className="text-lg">
                          {student.student_id} {student.firstname}{" "}
                          {student.lastname}
                        </p>
                        {student && (
                          <p className="text-sm text-gray-500">
                            หมู่เรียน {secName || "หมู่เรียนไม่ระบุ"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 pr-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-orange-300 text-white text-sm rounded"
                        onClick={() => startEditing(student)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="px-4 py-2 text-white bg-red rounded"
                        onClick={() => confirmDeleteStudent(student)}
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
              className="px-6 py-2 bg-gray-100 border  rounded"
              onClick={() => navigate("/advice")}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-4/5 md:w-1/2 lg:w-1/3 h-3/5 max-h-screen flex flex-col">
            <div className=" text-white rounded-t-lg p-4 flex-shrink-0">
              <h3 className="text-xl text-red">แก้ไขนักศึกษา</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  รหัสนักศึกษา
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedStudent.id}
                  readOnly
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="firstname"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedStudent.firstname}
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
                  value={updatedStudent.lastname}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  ห้อง
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedStudent.room}
                  readOnly
                  onChange={handleUpdateChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  เบอร์โทร
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedStudent.phone}
                  readOnly
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  อีเมล
                </label>
                <input
                  type="email"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedStudent.email}
                  readOnly
                  onChange={handleUpdateChange}
                />
              </div>
            </div>
            <div className="bg-gray-100 rounded-b-lg p-4 flex-shrink-0 flex justify-end space-x-2">
              <button
                className="px-4 py-1 bg-red border border-red text-white rounded"
                onClick={saveChanges}
              >
                บันทึก
              </button>
              <button
                className="px-4 py-1 bg-gray-100 border rounded"
                onClick={() => setEditingStudent(null)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl text-red mb-2">แก้ไขข้อมูลสำเร็จ!</h3>
            <p className="text-lg">อัปเดตข้อมูลนักศึกษาเรียบร้อยแล้ว.</p>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-red">
              ยืนยันการลบนักศึกษา
            </h3>
            <p>
              คุณต้องการลบนักศึกษาชื่อ {studentToDelete?.firstname}{" "}
              {studentToDelete?.lastname} หรือไม่?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-red text-white px-4 py-2 rounded"
                onClick={deleteStudent}
              >
                ลบ
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl text-red mb-2">แก้ไขข้อมูลไม่สำเร็จ!</h3>
            <p className="text-lg text-black">
              ข้อมูลของนักศึกษาอัปเดตไม่สำเร็จ.
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AllStudent;
