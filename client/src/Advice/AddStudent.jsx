import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    S_id: "",
    S_firstname: "",
    S_lastname: "",
    S_password: "",
    confirmPassword: "",
    S_phone: "",
    S_email: "",
    room: "",
  });

  console.log("Form Data:", formData);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getAllRoom", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched rooms:", data); // แสดงผลลัพธ์ที่ดึงมาเพื่อเช็ค
          setRooms(data);
        } else {
          console.error("Error fetching rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (formData.S_password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // เตรียมข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
    const requestBody = {
      S_id: formData.S_id,
      S_firstname: formData.S_firstname,
      S_lastname: formData.S_lastname,
      S_password: formData.S_password,
      room: formData.room,
    };

    if (formData.S_phone) {
      requestBody.S_phone = formData.S_phone;
    }

    if (formData.S_email) {
      requestBody.S_email = formData.S_email;
    }

    try {
      const response = await fetch("http://localhost:3000/api/createStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // เพิ่ม header การยืนยันตัวตน
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("เพิ่มนักศึกษาเรียบร้อยแล้ว");
        navigate("/advice");
      } else {
        const errorData = await response.json();
        console.log("Response data:", errorData);
        alert(
          `มีข้อผิดพลาดในการเพิ่มนักศึกษา: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("มีข้อผิดพลาดในการเพิ่มนักศึกษา");
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
        <p>เพิ่มนักศึกษา</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[800px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เพิ่มนักศึกษา
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <label className="block text-gray-700">ชื่อ</label>
                  <input
                    type="text"
                    name="S_firstname"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="ชื่อ"
                    value={formData.S_firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">นามสกุล</label>
                  <input
                    type="text"
                    name="S_lastname"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="นามสกุล"
                    value={formData.S_lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">รหัสนักศึกษา</label>
                <input
                  type="text"
                  name="S_id"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="รหัสนักศึกษา"
                  value={formData.S_id}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">ห้องเรียน</label>
                <select
                  name="room"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  value={formData.room}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    เลือกห้องเรียน
                  </option>
                  {rooms.map((room) => (
                    <option key={room.roomname} value={room.roomname}>
                      {room.roomname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">เบอร์โทร</label>
                <input
                  type="text"
                  name="S_phone"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="เบอร์โทร (ไม่จำเป็นต้องกรอก)"
                  value={formData.S_phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">อีเมล</label>
                <input
                  type="email"
                  name="S_email"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="อีเมล (ไม่จำเป็นต้องกรอก)"
                  value={formData.S_email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  name="S_password"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="รหัสผ่าน"
                  value={formData.S_password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                onClick={() => navigate("/advice")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red text-white rounded"
                onClick={handleSubmit}
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

export default AddStudent;
