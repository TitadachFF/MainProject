import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

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
  const [updatedName, setUpdatedName] = useState("");
  const [updatedYear, setUpdatedYear] = useState("");
  const [updatedRoom, setUpdatedRoom] = useState("");
  const [updatedIdCard, setUpdatedIdCard] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  //const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getStudent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        //นำข้อมูลที่ได้มาแปลงเป็น JSON (response.json()) แล้วใช้ setStudents เพื่อเซ็ต state ของ students
        const data = await response.json();
        setStudents(data);
        //หา room แล้วมาเก็บไว้ใน roomOptions
        const uniqueRooms = Array.from(
          new Set(data.map((student) => student.studentInfo.room))
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
      const isInSelectedRoom =
        selectedRoom === "" ||
        //เนื่องจากข้อมูลใน Backend เป็น INT จึงใช้ `${student.studentInfo.room}` แทนการเรียกค่า String โดยตรง
        (student.studentInfo && `${student.studentInfo.room}` === selectedRoom);

      const isInSearchTerm =
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase());

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
    setUpdatedName(student.name);
    setUpdatedYear(student.studentInfo.year); 
    setUpdatedRoom(student.studentInfo.room); 
    setUpdatedIdCard(student.studentInfo.studentIdcard); 
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      // แปลง year,room,studentIdcard เป็น integer เพราะหลังบ้านรับเป็น INT
      const requestBody = {
        name: updatedName,
        year: parseInt(updatedYear),
        room: parseInt(updatedRoom),
        studentIdcard: parseInt(updatedIdCard),
      };

      const response = await fetch(
        `http://localhost:3000/api/updateStudent/${editingStudent.id}`,
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
        throw new Error("Failed to update user");
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



  if (loading) {
    return <div>Loading...</div>;
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
                  {roomOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
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
                      <p className="text-lg">{student.studentInfo.studentIdcard} {student.name}</p>
                      {student.studentInfo && (
                        <p className="text-sm text-gray-500">
                          หมู่เรียน {student.studentInfo.year} / {student.studentInfo.room}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1 bg-gray-100 border border-red text-red rounded"
                      onClick={() => startEditing(student)}
                    >
                      แก้ไข
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
              onClick={() => navigate("/advice")}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h3 className="text-xl mb-4 text-red">Edit Student</h3>
            <div className="mb-2">
              <label className="block text-md font-medium text-black">
                Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm text-gray-500"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-md font-medium text-black">
                Year
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm text-gray-500"
                value={updatedYear}
                onChange={(e) => setUpdatedYear(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-md font-medium text-black">
                Room
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm text-gray-500"
                value={updatedRoom}
                onChange={(e) => setUpdatedRoom(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-md font-medium text-black">
                Student ID Card
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm text-gray-500"
                value={updatedIdCard}
                onChange={(e) => setUpdatedIdCard(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-1 bg-red border border-red text-white rounded mr-2"
                onClick={saveChanges}
              >
                Save
              </button>
              <button
                className="px-4 py-1 bg-gray-100 border border-red text-red rounded"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
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
