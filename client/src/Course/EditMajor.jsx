// EditMajor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState({});
  const [totalUnits, setTotalUnits] = useState(0); // State สำหรับเก็บผลรวมของ category_unit

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor((prevMajor) => ({
      ...prevMajor,
      [name]: value,
    }));
  };

  useEffect(() => {
    // getMajorByMajorCode
    const fetchMajor = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getMajorByCode/${major_code}`,
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
        console.log("Fetched Major data:", data);
        setMajor(data);
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };
    // getCategoriesByMajorCode
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/getCategoriesByMajorCode/${major_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Categories");
        }
        const data = await response.json();
        console.log("Fetched Categories data:", data);

        setCategories(data); // ตั้งค่า categories ตามที่ได้รับจาก API

        // คำนวณผลรวมของ category_unit
        const totalUnits = data.reduce(
          (acc, category) => acc + category.category_unit,
          0
        );
        setTotalUnits(totalUnits); // อัพเดต state ของผลรวม
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    if (major_code) {
      fetchMajor();
      fetchCategories();
    }
  }, [major_code]);

  // getGroupsByCategoryId
  const fetchGroups = async (category_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/getGroupsByCategoryId/${category_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Groups");
      }
      const data = await response.json();
      console.log("Fetched Groups data:", data); // ตรวจสอบข้อมูลที่ได้รับ
      setGroups(data || []); // ป้องกัน groups เป็น undefined
    } catch (error) {
      console.error("Error fetching Groups:", error);
      setGroups([]); // กรณีที่เกิด error จะตั้งค่าเป็น array ว่าง
    }
  };

  const fetchCourses = async (group_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/getCoursesByGroupId/${group_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Courses");
      }
      const data = await response.json();
      console.log("Fetched Courses data:", data); // ตรวจสอบข้อมูลที่ได้รับ
      setCourses((prevCourses) => ({
        ...prevCourses,
        [group_id]: data,
      }));
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

  const handleCategoryClick = async (category_id) => {
    setSelectedCategoryId(category_id);
    await fetchGroups(category_id);
  };

  const handleGroupClick = async (group_id) => {
    await fetchCourses(group_id);
  };

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-red font-bold">รายละเอียดหลักสูตร</h2>
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
              <div>
                <p>หน่วยกิตหลักสูตร{totalUnits}</p>
                <p>หน่วยกิตหมวดวิชาทั่วไป{totalUnits}</p>
              </div>

              {/* Categories  */}
              <div className="">
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <details
                      key={category.category_id}
                      className="collapse collapse-arrow bg-gray-50 mb-2"
                      onClick={() => handleCategoryClick(category.category_id)}
                    >
                      <summary
                        className="collapse-title text-lg cursor-pointer bg-red text-white"
                        onClick={() =>
                          handleCategoryClick(category.category_id)
                        }
                      >
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            className="bg-red rounded-full border pl-10 pr-3 py-2"
                            value={category.category_name}
                            readOnly // ป้องกันการแก้ไข
                          />
                          <p className="pl-4">
                            จำนวนไม่น้อยกว่า {category.category_unit} หน่วยกิต
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-3 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        </div>
                      </summary>
                      {/* Fetch Group */}
                      <div className="collapse-content text-base">
                        {category.category_id === selectedCategoryId && (
                          <ul>
                            {groups.length > 0 ? (
                              groups.map((group) => (
                                <li key={group.group_id} className="py-2">
                                  <span
                                    className="cursor-pointer font-bold hover:text-gray-400 flex"
                                    onClick={() =>
                                      handleGroupClick(group.group_id)
                                    }
                                  >
                                    {group.group_name} - {group.group_unit}{" "}
                                    หน่วยกิต
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                      />
                                    </svg>
                                  </span>
                                  <hr />
                                  <ul>
                                    {courses[group.group_id] &&
                                      courses[group.group_id].map((course) => (
                                        <li
                                          key={course.group_id}
                                          className="ml-4"
                                        >
                                          <span className="flex">
                                            <p className="pr-4">
                                              {course.course_id}{" "}
                                              {course.courseNameTH}
                                              <div className="flex-row">
                                                {course.courseNameENG}
                                              </div>
                                            </p>
                                            <p className="text-sm">
                                              {course.courseUnit} (
                                              {course.courseTheory}-
                                              {course.coursePractice}-
                                              {course.categoryResearch})
                                            </p>
                                          </span>
                                          <hr />
                                        </li>
                                      ))}
                                  </ul>
                                </li>
                              ))
                            ) : (
                              <li>ไม่มีกลุ่มวิชา</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </details>
                  ))}
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
                // onClick={handleSave}
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
