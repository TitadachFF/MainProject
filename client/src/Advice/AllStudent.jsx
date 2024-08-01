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
  const [updatedId, setUpdatedId] = useState("");
  const [updatedFirstname, setUpdatedFirstname] = useState("");
  const [updatedLastname, setUpdatedLastname] = useState("");
  const [updatedPhone, setUpdatedPhone] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedRoom, setUpdatedRoom] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  //const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/getAllStudents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        //นำข้อมูลที่ได้มาแปลงเป็น JSON (response.json()) แล้วใช้ setStudents เพื่อเซ็ต state ของ students
        const data = await response.json();
        console.log("API Response:", data); // ตรวจสอบข้อมูลที่ดึงมา
        setStudents(data);
        //หา room แล้วมาเก็บไว้ใน roomOptions
        const uniqueRooms = Array.from(
          new Set(data.map((student) => student.room))
        );
        setRoomOptions(uniqueRooms);
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
      //ค้นจากห้อง ถ้าเป็น String ค่าว่าง "" จะแสดงทั้งหมด
      const isInSelectedRoom =
        selectedRoom === "" || student.room === selectedRoom;

      //ค้นจากชื่อนักศึกษา ถ้าเป็น String ค่าว่าง "" จะแสดงทั้งหมด
      const isInSearchTerm =
        searchTerm === "" ||
        (student.S_id + " " + student.S_firstname + " " + student.S_lastname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return isInSelectedRoom && isInSearchTerm;
    });
    setFilteredStudents(filtered);
  }, [students, selectedRoom, searchTerm, loading]);

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const startEditing = (student) => {
    setEditingStudent(student);
    setUpdatedFirstname(student.S_firstname);
    setUpdatedLastname(student.S_lastname);
    setUpdatedRoom(student.room);
    setUpdatedId(student.S_id);
    setUpdatedPhone(student.S_phone);
    setUpdatedEmail(student.S_email);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        S_firstname: updatedFirstname,
        S_lastname: updatedLastname,
        room: updatedRoom,
        studentIdcard: updatedId,
      };

      const response = await fetch(
        `http://localhost:3000/api/updateStudent/${editingStudent.S_id}`,
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
        throw new Error("Failed to update student");
      }

      const updatedStudent = await response.json();
      //ใช้ setStudents เพื่ออัพเดตข้อมูลนักศึกษาใน state โดยใช้ข้อมูลที่ได้รับกลับมา
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.updateStudent.id
            ? updatedStudent.updateStudent
            : student
        )
      );

      setEditingStudent(null);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
      //setShowErrorModal(true);

      // setTimeout(() => {
      //   setShowErrorModal(false);
      // }, 1000);
    }
  };

  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const deleteStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/deleteStudent/${studentToDelete.S_id}`,
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
        prevStudents.filter((student) => student.S_id !== studentToDelete.S_id)
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
          <p className="cursor-pointer" onClick={() => navigate("/admin")}>
            เมนูแอดมิน
          </p>
          <span className="mx-1">&gt;</span>
          <p>ดูรายชื่อผู้ใช้</p>
        </div>
        <div className="min-h-screen flex justify-center p-6 h-full">
          <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
            <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
              ดูรายชื่อผู้ใช้
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
        <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
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
                  {roomOptions.map((room, index) => (
                    <option key={index} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 5.293a1 1 0 011.414 0L10 10.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
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
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className="py-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                    <div>
                      <p className="text-lg">
                        {student.S_id} {student.S_firstname}{" "}
                        {student.S_lastname}
                      </p>
                      {student && (
                        <p className="text-sm text-gray-500">
                          หมู่เรียน {student.room}
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
              ))}
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
                  value={updatedId}
                  readOnly
                  onChange={(e) => setUpdatedId(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  ชื่อ
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedFirstname}
                  onChange={(e) => setUpdatedFirstname(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  นามสกุล
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedLastname}
                  onChange={(e) => setUpdatedLastname(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  ห้อง
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedRoom}
                  readOnly
                  onChange={(e) => setUpdatedRoom(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  เบอร์โทร
                </label>
                <input
                  type="text"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedPhone}
                  readOnly
                  onChange={(e) => setUpdatedPhone(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  อีเมล
                </label>
                <input
                  type="email"
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                  value={updatedEmail}
                  readOnly
                  onChange={(e) => setUpdatedEmail(e.target.value)}
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-red">ยืนยันการลบนักศึกษา</h3>
            <p>
              คุณต้องการลบนักศึกษาชื่อ {studentToDelete.S_firstname}{" "}
              {studentToDelete.S_lastname} หรือไม่?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-red text-white px-4 py-2 rounded "
                onClick={deleteStudent}
              >
                ลบ
              </button>
              <button
                className="px-4 py-1 bg-gray-100 border rounded"
                onClick={() => setShowDeleteModal(false)}
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
