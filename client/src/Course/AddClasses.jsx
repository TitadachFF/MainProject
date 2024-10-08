import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddClasses = () => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [formData, setFormData] = useState({
    sec_name: "",
  });

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/getAllMajors/",
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMajors(data);
        } else {
          console.error("Error fetching majors");
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.sec_name ) {
      setMessage("โปรดกรอกข้อมูลให้ครบถ้วน");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/createSection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("เพิ่มหมู่เรียนสำเร็จ");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/course");
        }, 1000);
      } else {
        setMessage("มีข้อผิดพลาดในการเพิ่มหมู่เรียน");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating section:", error);
      setMessage("มีข้อผิดพลาดในการเพิ่มหมู่เรียน");
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
        <p className="cursor-pointer" onClick={() => navigate("/classes")}>
          เมนูหมู่เรียน
        </p>
        <span className="mx-1">&gt;</span>
        <p>เพิ่มหมู่เรียน</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl max-h-96 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            เพิ่มหมู่เรียน
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">ชื่อหมู่เรียน</label>
                <input
                  type="text"
                  name="sec_name"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อหมู่เรียน"
                  value={formData.sec_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red text-red rounded"
                onClick={() => navigate("/course")}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg modal-box">
            <h3 className="font-bold text-red text-xl pb-4">{message}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClasses;
