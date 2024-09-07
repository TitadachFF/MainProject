import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ViewMajor = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("viewMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState({});
  const [totalUnits, setTotalUnits] = useState(0); // State สำหรับเก็บผลรวมของ category_unit
  const [openGroupId, setOpenGroupId] = useState(null); // State สำหรับเก็บกลุ่มที่เปิดอยู่

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor((prevMajor) => ({
      ...prevMajor,
      [name]: value,
    }));
  };
  const handleEdit = (id) => {
    navigate(`/editmajor?editMajor=${id}`);
  };

  useEffect(() => {
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

        setCategories(data);

        const totalUnits = data.reduce(
          (acc, category) => acc + category.category_unit,
          0
        );
        setTotalUnits(totalUnits);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    if (major_code) {
      fetchMajor();
      fetchCategories();
    }
  }, [major_code]);

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
      console.log("Fetched Groups data:", data);
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching Groups:", error);
      setGroups([]);
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
      console.log("Fetched Courses data:", data);
      setCourses((prevCourses) => ({
        ...prevCourses,
        [group_id]: data,
      }));
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

  const handleCategoryClick = async (category_id) => {
    if (selectedCategoryId === category_id) {
      setSelectedCategoryId(null);
      setGroups([]);
      setCourses({});
      setOpenGroupId(null); // ปิดกลุ่มที่เปิดอยู่เมื่อปิด category
    } else {
      setSelectedCategoryId(category_id);
      setOpenGroupId(null); // ปิดกลุ่มที่เปิดอยู่เมื่อเปลี่ยน category
      await fetchGroups(category_id);
    }
  };

  const handleGroupClick = async (group_id) => {
    if (openGroupId === group_id) {
      setOpenGroupId(null); // ปิดกลุ่มที่เปิดอยู่
    } else {
      setOpenGroupId(group_id); // เปิดกลุ่มใหม่
      await fetchCourses(group_id);
    }
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
          <hr />
          <form>
            <div className="grid grid-cols-1 gap-6 py-2">
              <div className="flex">
                <label className="block font-semibold text-gray-700">
                  รหัสหลักสูตร :
                </label>
                <p className="pl-2">{major.major_code}</p>
              </div>
              <div className="flex">
                <label className="block font-semibold text-gray-700">
                  ชื่อหลักสูตร(ภาษาไทย):
                </label>
                <p className="pl-2">{major.majorNameTH}</p>
              </div>
              <div className="flex">
                <label className="block font-semibold text-gray-700">
                  ชื่อหลักสูตร(ภาษาอังกฤษ):
                </label>
                <p className="pl-2">{major.majorNameENG}</p>
              </div>
              <div className="flex">
                <label className="block font-semibold text-gray-700">
                  หลักสูตรปี :
                </label>
                <p className="pl-2">{major.majorYear}</p>
                <label className="block font-semibold pl-4 text-gray-700">
                  จํานวนหน่วยกิตรวมตลอดหลักสูตรไม่น้อยกว่า :
                </label>
                <p className="pl-2">{major.majorUnit}</p>
                <p className="font-semibold pl-2 text-gray-700">หน่วยกิต</p>
              </div>

              {/* New collapse */}
              {categories &&
                categories.length > 0 &&
                categories.map((category) => (
                  <div
                    key={category.category_id}
                    className="collapse collapse-arrow text-white bg-red"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryId === category.category_id} // ทำให้ checkbox แสดงสถานะเปิด/ปิดตาม state
                      onChange={() => handleCategoryClick(category.category_id)} // เรียก handleCategoryClick เมื่อคลิก
                    />
                    <div className="collapse-title text-xl font-medium flex">
                      {category.category_name}{" "}
                      <p className="text-base  ml-4 mt-1">
                        *จำนวนไม่น้อยกว่า {category.category_unit} หน่วยกิต
                      </p>
                    </div>
                    <div className="collapse-content bg-base-100 text-black border">
                      {selectedCategoryId === category.category_id &&
                      groups.length > 0 ? (
                        groups.map((group) => (
                          <div
                            key={group.group_id}
                            className="collapse collapse-arrow text-black  my-1 bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              checked={openGroupId === group.group_id} // ทำให้ checkbox แสดงสถานะเปิด/ปิดตาม state
                              onChange={() => handleGroupClick(group.group_id)} // เรียก handleGroupClick เมื่อคลิก
                            />
                            <div className="collapse-title text-base  font-semibold">
                              {group.group_name} - ไม่น้อยกว่า{" "}
                              {group.group_unit} หน่วยกิต
                            </div>
                            <div className="collapse-content bg-base-100 text-black border">
                              {openGroupId === group.group_id &&
                              courses[group.group_id] &&
                              courses[group.group_id].length > 0 ? (
                                <ul className="ml-4 mt-2">
                                  {courses[group.group_id].map((course) => (
                                    <li key={course.course_id} className="ml-2">
                                      <div className="flex  flex-col">
                                        <span className="flex">
                                          {course.course_id}{" "}
                                          {course.courseNameTH}{" "}
                                          <p className="ml-6">
                                            {" "}
                                            {course.courseUnit} (
                                            {course.courseTheory}-
                                            {course.coursePractice}-
                                            {course.categoryResearch}) น(ท-ป-ค)
                                          </p>
                                        </span>
                                        <span className="text-sm">
                                          {course.courseNameENG}
                                        </span>

                                        <hr />
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div>ไม่มีรายวิชา</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>ไม่มีกลุ่มวิชา</div>
                      )}
                    </div>
                  </div>
                ))}
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
                onClick={() => handleEdit(major.major_code)}
              >
                แก้ไขหลักสูตร
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewMajor;
