import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

// AllCourse component
const AllCourse = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getAllMajors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Major");
        }
        const data = await response.json();
        console.log("Fetched Majors:", data);
        setMajors(data.majors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleEdit = (id) => {
    navigate(`/allcourse?editMajor=${id}`);
  };

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
        <p>ดูหลักสูตร</p>
      </div>
      <div className="min-h-screen flex justify-center bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl text-red font-bold mb-6">รายชื่อหลักสูตร</h1>
          <div className="mt-8">
            {loading ? (
              <div className="text-gray-500 text-center">กำลังโหลด...</div>
            ) : error ? (
              <div className="text-gray-500 text-center">{error}</div>
            ) : majors.length > 0 ? (
              <table className="w-full rounded-lg border bg-red h-full text-white cursor-pointer">
                <tbody>
                  {majors.map((major) => (
                    <tr key={major.id} className="border-t relative">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">

                     

                          <span className="text-xl flex">
                            {major.majorNameTH}
                            <p className="pl-8">{major.majorUnit} หน่วยกิต</p>
                          </span>

                          <span>{major.majorNameENG}</span>
                        </div>
                      </td>
                      <td className="px-6">
                        <div className="relative">
                          <svg
                            data-slot="icon"
                            fill="none"
                            stroke-width="4"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="w-6 h-8 text-gray-300 cursor-pointer z-10"
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === major.id ? null : major.id
                              )
                            }
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                            ></path>
                          </svg>
                          {/* dropdown Menu */}
                          {dropdownOpen === major.id && (
                            <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow-lg w-48 z-50">
                              <button
                                onClick={() => handleEdit(major.id)}
                                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                              >
                                แก้ไขหลักสูตร
                              </button>
                              <button
                                onClick={() => handleStore(major.id)}
                                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                              >
                                จัดเก็บหลักสูตร
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 text-center">ไม่มีหลักสูตร</div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-8 py-2 bg-red border border-red text-white rounded"
              onClick={() => navigate("/addcourse")}
            >
              เพิ่มหลักสูตร
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


//
const EditMajor = () => {
  const [searchParams] = useSearchParams();
  const majorId = searchParams.get("editMajor");
  const [major, setMajor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState({});
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

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
        setMajor(data.major);
      } catch (error) {
        console.error("Error fetching Major data:", error);
      }
    };

    const fetchCategories = async (majorId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/categories/major/${majorId}`,
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
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    if (majorId) {
      fetchMajor();
      fetchCategories(majorId);
    }
  }, [majorId]);

  const fetchGroups = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/group/category/${categoryId}`,
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
      setGroups(data.groups);
      // Fetch courses for each group in this category
      const groupIds = data.groups.map((group) => group.id);
      for (const groupId of groupIds) {
        await fetchCourses(groupId);
      }
    } catch (error) {
      console.error("Error fetching Groups:", error);
    }
  };

  const fetchCourses = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/courses/group/${groupId}`,
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
      setCourses((prevCourses) => ({
        ...prevCourses,
        [groupId]: data.courses,
      }));
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

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

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    await fetchGroups(categoryId);
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
              <div className="flex">
                <label className="block text-gray-700 pr-2 py-1">
                  สถานะหลักสูตร :
                </label>
                <div
                  className={`badge ${
                    major.status === "INACTIVE"
                      ? "badge-error"
                      : "badge-success"
                  } gap-2 p-4`}
                >
                  <p className="text-white font-semibold">{major.status}</p>
                </div>
              </div>
              {/* Categories Section */}
              <div className="">
                {categories.map((category) => (
                  <details
                    key={category.id}
                    className="collapse bg-gray-50 mb-2"
                    open={category.id === selectedCategoryId}
                  >
                    <summary
                      className="collapse-title text-lg cursor-pointer bg-red text-white"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          className="bg-red rounded-full border pl-10 pr-3 py-2"
                          value={category.categoryName}
                        />
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
                    <div className="collapse-content text-base">
                      {category.id === selectedCategoryId && (
                        <ul>
                          {groups.map((group) => (
                            <li key={group.id} className="py-2">
                              <span
                                className="cursor-pointer"
                                onClick={() => handleGroupClick(group.id)}
                              >
                                {group.groupName} - {group.groupUnit} หน่วยกิต
                              </span>
                              <hr />

                              <ul>
                                {courses[group.id] &&
                                  courses[group.id].map((course) => (
                                    <li key={course.id} className="ml-4">
                                      <span className="flex">
                                        <p className="pr-4">
                                          {" "}
                                          {course.courseCode}{" "}
                                          {course.courseNameTH}
                                          <div className="flex-row">
                                            {" "}
                                            {course.courseNameENG}
                                          </div>
                                        </p>{" "}
                                        <p className="text-sm">
                                          {" "}
                                          {course.courseUnit}{" "}
                                          {course.courseYear}
                                        </p>
                                      </span>
                                      <hr />
                                    </li>
                                  ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      )}
                      {category.id !== selectedCategoryId && <p>กลุ่มวิชา</p>}
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

// Combined Export
const CoursePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editMajorId = searchParams.get("editMajor");

  if (editMajorId) {
    return <EditMajor />;
  }

  return <AllCourse />;
};

export default CoursePage;

