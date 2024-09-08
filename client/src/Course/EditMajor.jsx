import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const major_code = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [groupsByCategory, setGroupsByCategory] = useState({});
  const [coursesByGroup, setCoursesByGroup] = useState({});
  const [totalUnits, setTotalUnits] = useState(0);
  const [openGroups, setOpenGroups] = useState({}); // เพิ่ม state นี้

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor((prevMajor) => ({
      ...prevMajor,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // ตรวจสอบว่ามีข้อมูล major และ major_id หรือไม่
      if (!major || !major.major_id) {
        throw new Error("Major data is not available or missing major_id.");
      }

      const token = localStorage.getItem("token");

      // การอัพเดตข้อมูลหลักสูตร
      const response = await fetch(
        `http://localhost:3000/api/updateMajor/${major.major_id}`,
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
        setMajor(data);
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };

    const fetchCategoriesAndGroups = async () => {
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
        const categoriesData = await response.json();
        setCategories(categoriesData);

        const totalUnits = categoriesData.reduce(
          (acc, category) => acc + category.category_unit,
          0
        );
        setTotalUnits(totalUnits);

        const groupsData = await Promise.all(
          categoriesData.map(async (category) => {
            const groupResponse = await fetchGroups(category.category_id);
            return { category_id: category.category_id, groups: groupResponse };
          })
        );

        const groupsByCategory = {};
        groupsData.forEach((item) => {
          groupsByCategory[item.category_id] = item.groups;
        });

        setGroupsByCategory(groupsByCategory);

        // Fetch courses data
        const coursesData = await Promise.all(
          groupsData.flatMap((item) =>
            item.groups.map((group) => fetchCourses(group.group_id))
          )
        );

        const coursesByGroup = {};
        groupsData.forEach((item) => {
          item.groups.forEach((group) => {
            coursesByGroup[group.group_id] = coursesData.shift() || [];
          });
        });

        setCoursesByGroup(coursesByGroup);
      } catch (error) {
        console.error("Error fetching Categories and Groups:", error);
      }
    };

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
        return data || [];
      } catch (error) {
        console.error("Error fetching Groups:", error);
        return [];
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
        return data || [];
      } catch (error) {
        console.error("Error fetching Courses:", error);
        return [];
      }
    };
    const toggleGroup = (categoryId, groupId) => {
      setOpenGroups((prevOpenGroups) => ({
        ...prevOpenGroups,
        [`${categoryId}-${groupId}`]:
          !prevOpenGroups[`${categoryId}-${groupId}`],
      }));
    };
    if (major_code) {
      fetchMajor();
      fetchCategoriesAndGroups();
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
              {categories.map((category) => (
                <div key={category.category_id}>
                  <h3 className="text-sm font-semibold text-gray-700 ">
                    <div className="flex">
                      {category.category_name}{" "}
                      <p className="ml-4 mr-2">จำนวนไม่น้อยกว่า </p>{" "}
                      {category.category_unit} หน่วยกิต
                    </div>
                  </h3>

                  {groupsByCategory[category.category_id]?.map((group) => (
                    <div key={group.group_id} className="ml-4">
                      <input
                        type="text"
                        className="w-full text-sm mt-1 border border-gray-300 rounded p-2"
                        value={group.group_name}
                        readOnly
                      />
                      {/* แสดง Courses ในแต่ละกลุ่ม */}
                      {coursesByGroup[group.group_id]?.map((course) => (
                        <div
                          key={course.course_id}
                          className="ml-8 flex border p-1 mb-1 mt-1 text-sm"
                        >
                          <p className="text-sm">{course.courseNameTH}</p>
                          <p className="ml-4">หน่วยกิต: {course.courseUnit}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </form>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red  transition duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-gray-300 "
              onClick={handleSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMajor;
