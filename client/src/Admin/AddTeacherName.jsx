import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTeacherName = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    titlename: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { firstname, lastname, titlename } = formData;

    if (!firstname || !lastname || !titlename) {
      setMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน !");
      setMessage2("*โปรดตรวจสอบข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    const submissionData = {
      titlename,
      firstname,
      lastname,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/createTeacher", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setMessage("เพิ่มอาจารย์สำเร็จ");
        setMessage2("*อาจารย์เข้าสู่ระบบสำเร็จ");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/admin");
        }, 1000);
      } else {
        const errorData = await response.json();
        if (errorData.message === "already Teacher") {
          setMessage("มีอาจารย์คนนี้แล้ว");
          setMessage2("*กรุณาตรวจสอบข้อมูลอีกครั้ง");
        } else {
          setMessage("มีข้อผิดพลาดในการเพิ่มอาจารย์ !");
          setMessage2("*โปรดลองใหม่อีกครั้ง");
        }
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      setMessage("มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ !");
      setMessage2("*โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

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
        <p>เพิ่มผู้ใช้</p>
      </div>
      <div className="min-h-screen flex justify-center p-6">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6">
            เพิ่มรายชื่ออาจารย์
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700">คำนำหน้าชื่อ</label>
              <select
                name="titlename"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                value={formData.titlename}
                onChange={handleChange}
              >
                <option value="">คำนำหน้า</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Miss.">Miss.</option>
                <option value="Dr.">Dr.</option>
                <option value="Asst. Prof.">Asst. Prof.</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">ชื่อ</label>
              <input
                type="text"
                name="firstname"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อ"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">นามสกุล</label>
              <input
                type="text"
                name="lastname"
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="นามสกุล"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
              onClick={() => navigate("/admin")}
            >
              ย้อนกลับ
            </button>
            <button
              id="btn_submit"
              type="button"
              className="px-8 py-2 bg-red text-white rounded"
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg modal-box">
            <h3 className="font-bold text-red text-xl pb-4">{message}</h3>
            <p className="text-lg py-4 text-gray-500">{message2}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTeacherName;
