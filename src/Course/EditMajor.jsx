import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor((prevMajor) => ({
      ...prevMajor,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!major || !major.major_id) {
        throw new Error("Major data is not available or missing major_id.");
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiUrl}api/updateMajor/${major.major_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            major_code: major.major_code,
            majorNameTH: major.majorNameTH,
            majorNameENG: major.majorNameENG,
            majorYear: major.majorYear,
            majorUnit: major.majorUnit,
            status: major.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Major data");
      }

      alert("อัพเดตข้อมูลสำเร็จ!");
      navigate("/allcourse");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูล.");
    }
  };

  const handleCategoryEdit = (id) => {
    navigate(`/editcategory?editMajor=${major_code}`);
  };

  const handleGroupEdit = (id) => {
    navigate(`/editgroup?editMajor=${major_code}`);
  };
  const handleCourseEdit = (id) => {
    navigate(`/editcourse?editMajor=${major_code}`);
  };
  useEffect(() => {
    const fetchMajor = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}api/getMajorByCode/${major_code}`,
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
        setMajor(data);
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };

    if (major_code) {
      fetchMajor();
    }
  }, [major_code]);

  if (!major) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
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
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-">
            <h2 className="text-2xl  text-red  font-bold">แก้ไขหลักสูตร</h2>

            <div className="flex items-center">
              <label className="block text-gray-400 pr-2 py-1">
                สถานะหลักสูตร:
              </label>
              <div
                className={`badge ${
                  major.status === "INACTIVE" ? "badge-error" : "badge-success"
                } gap-2 p-2`}
              >
                <p className="text-white font-semibold">{major.status}</p>
              </div>
            </div>
          </div>

          <form>
            <p className="text-red px-2 font-semibold py-2">
              รายละเอียดหลักสูตร
            </p>
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
                <p></p>
                <div className="mr-4 w-1/3">
                  <label className="block text-gray-700">
                    รหัสหลักสูตร 14 หลัก{" "}
                  </label>
                  <input
                    type="text"
                    name="major_code"
                    className="w-full mt-1 border border-gray-300 rounded p-2"
                    placeholder="รหัสหลักสูตร"
                    value={major.major_code}
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

              {/* การแสดงหมวดหมู่และกลุ่มวิชา */}
            </div>
          </form>
          <div className="flex justify-between py-2">
            <button
              type="button"
              className="bg-gray-200 border transition duration-300 ease-in-out text-black px-4 py-2 rounded hover:bg-gray-200 "
              onClick={() => navigate("/allcourse")}
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              className="bg-red  transition duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-gray-300 "
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
          <div className="flex space-x-1 py-4">
            <button
              type="button"
              className="bg-red  transition duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-gray-300 "
              onClick={() => handleCategoryEdit(major.major_code)}
            >
              แก้ไขหมวดวิชาในหลักสูตรนี้
            </button>
            <button
              type="button"
              className="bg-red  transition duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-gray-300 "
              onClick={() => handleGroupEdit(major.major_code)}
            >
              แก้ไขกลุ่มวิชาในหลักสูตรนี้
            </button>
            <button
              type="button"
              className="bg-red  transition duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-gray-300 "
              onClick={() => handleCourseEdit(major.major_code)}
            >
              แก้ไขรายวิชาในหลักสูตรนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMajor;
