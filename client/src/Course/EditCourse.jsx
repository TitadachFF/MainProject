import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// EditMajor component
const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const majorId = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajor = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getMajorById/${majorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Major data");
        }
        const data = await response.json();
        setMajor(data.major); // สมมติว่า `data.major` คือข้อมูลที่ได้รับ
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };

    if (majorId) {
      fetchMajor();
    }
  }, [majorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor({
      ...major,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/updateMajor/${major.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(major),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Major");
      }

      navigate("/course");
    } catch (error) {
      console.error("Error updating Major:", error);
    }
  };

  if (!major) {
    return <div>Loading...</div>;
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
        <p className="cursor-pointer" onClick={() => navigate("/allcourse")}>
          ดูหลักสูตร
        </p>
        <span className="mx-1">&gt;</span>
        <p>แก้ไขหลักสูตร</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[700px]">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            แก้ไขหลักสูตร
          </h2>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">
                  ชื่อหลักสูตร(ภาษาไทย)
                </label>
                <input
                  type="text"
                  name="majorNameTH"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อหลักสูตร(ภาษาไทย)"
                  value={major.majorNameTH}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  ชื่อหลักสูตร(ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  name="majorNameENG"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="ชื่อหลักสูตร(ภาษาอังกฤษ)"
                  value={major.majorNameENG}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <div className="mr-4 w-1/3">
                  <label className="block text-gray-700">รหัสหลักสูตร</label>
                  <input
                    type="text"
                    name="majorCode"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสหลักสูตร"
                    value={major.majorCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="mr-4 w-1/3">
                  <label className="block text-gray-700">หลักสูตรปี</label>
                  <input
                    type="text"
                    name="majorYear"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="หลักสูตรปี"
                    value={major.majorYear}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">จำนวนหน่วยกิต</label>
                  <input
                    type="number"
                    name="majorUnit"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="จำนวนหน่วยกิต"
                    value={major.majorUnit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">
                  อาจารย์ผู้รับผิดชอบหลักสูตร
                </label>
                <input
                  type="text"
                  name="majorSupervisor"
                  className="w-full mt-1 border border-gray-300 rounded p-2"
                  placeholder="อาจารย์ผู้รับผิดชอบหลักสูตร"
                  value={major.majorSupervisor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                onClick={() => navigate("/allcourse")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-2 bg-red text-white rounded"
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

export default EditMajor;



