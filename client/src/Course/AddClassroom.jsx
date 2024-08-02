import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddClassroom = () => {
  const [roomname, setRoomname] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setRoomname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Room name to be sent:", roomname); // Log the room name to be sent

    try {
      const response = await axios.post(
        "http://localhost:3000/api/createClassroom",
        { roomname },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Classroom created:", response.data);
      alert("หมู่เรียนถูกสร้างเรียบร้อยแล้ว");
      navigate("/course");
    } catch (error) {
      console.error("Error creating classroom:", error.response.data);
      alert(
        `มีข้อผิดพลาดในการสร้างหมู่เรียน: ${
          error.response.data.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-hidden">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/course")}>
          เมนูตัวแทนหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มหมู่เรียน</p>
      </div>
      <div className="flex justify-center p-10">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เพิ่มหมู่เรียน
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 mt-5">หมู่เรียน</label>
                <div className="flex">
                  <input
                    type="text"
                    name="roomname"
                    className="w-full mt-1 border border-gray-300 rounded p-2 mr-2"
                    placeholder="กรุณากรอกปีและหมู่เรียน"
                    value={roomname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mt-28 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                  onClick={() => navigate("/course")}
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-red text-white rounded"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClassroom;
