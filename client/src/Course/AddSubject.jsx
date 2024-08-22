import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseNameTH, setCourseNameTH] = useState("");
  const [courseNameENG, setCourseNameENG] = useState("");
  const [courseUnit, setCourseUnit] = useState(0);
  const [courseTheory, setCourseTheory] = useState(0);
  const [coursePractice, setCoursePractice] = useState(0);
  const [categoryResearch, setCategoryResearch] = useState(0);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch Majors
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/getAllMajors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch Categories By MajorCode
  useEffect(() => {
    if (selectedCourse) {
      const fetchCategoriesByMajorCode = async (major_code) => {
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
          setFilteredCategories(data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategoriesByMajorCode(selectedCourse);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedCourse]);

  // Fetch Groups By CategoryId
  useEffect(() => {
    if (selectedCategory) {
      const fetchGroupsByCategoryId = async (category_id) => {
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
          const data = await response.json();
          setGroups(data || []);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };

      fetchGroupsByCategoryId(selectedCategory);
    } else {
      setGroups([]);
    }
  }, [selectedCategory]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedCategory("");
    setSelectedGroup("");
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedGroup("");
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleCourseCodeChange = (e) => {
    setCourseCode(e.target.value);
  };

  const handleCourseNameTHChange = (e) => {
    setCourseNameTH(e.target.value);
  };

  const handleCourseNameENGChange = (e) => {
    setCourseNameENG(e.target.value);
  };

  const handleCourseUnitChange = (e) => {
    setCourseUnit(e.target.value);
  };

  const handleCourseTheoryChange = (e) => {
    setCourseTheory(e.target.value);
  };

  const handleCoursePracticeChange = (e) => {
    setCoursePractice(e.target.value);
  };

  const handleCategoryResearchChange = (e) => {
    setCategoryResearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/createCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courseCode,
          courseNameTH: courseNameTH,
          courseNameENG: courseNameENG,
          courseTheory: parseInt(courseTheory),
          coursePractice: parseInt(coursePractice),
          categoryResearch: parseInt(categoryResearch),
          courseUnit: parseInt(courseUnit),
          major_id: parseInt(selectedCourse),
          category_id: parseInt(selectedCategory),
          group_id: parseInt(selectedGroup),
        }),
      });

      if (response.ok) {
        document.getElementById("my_modal_1").showModal();
      } else {
        console.error("Failed to submit course data");
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
  };

  const updateQueryString = (form) => {
    navigate(`?form=${form}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">เลือกหลักสูตร</label>
            <select
              id="course"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">เลือกหลักสูตร</option>
              {courses.map((course) => (
                <option key={course.id} value={course.major_code}>
                  {course.majorNameTH}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">เลือกหมวดวิชา</label>
            <select
              id="category"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={!selectedCourse}
            >
              <option value="">เลือกหมวดวิชา</option>
              {filteredCategories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-2">
            <label className="mb-2">เลือกกลุ่มวิชา</label>
            <select
              id="group"
              className="dropdown appearance-none w-full text-gray-500 bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
              value={selectedGroup}
              onChange={handleGroupChange}
              disabled={!selectedCategory}
            >
              <option value="">เลือกกลุ่มวิชา</option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2">รหัสวิชา</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2"
              value={courseCode}
              onChange={handleCourseCodeChange}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อรายวิชา(ภาษาไทย)</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={courseNameTH}
              onChange={handleCourseNameTHChange}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2">ชื่อรายวิชา(English)</label>
            <input
              type="text"
              className="border rounded-lg px-2 py-2 w-full"
              value={courseNameENG}
              onChange={handleCourseNameENGChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">น (หน่วยกิต)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-2"
              value={courseUnit}
              onChange={handleCourseUnitChange}
            />
          </div>
          
          <div className="flex flex-col">
            <label className="mb-2">ท (ทฤษฎี)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-2"
              value={courseTheory}
              onChange={handleCourseTheoryChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ป (ปฏิบัติ)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-2"
              value={coursePractice}
              onChange={handleCoursePracticeChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">ค (ค้นคว้าอิสระ)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-2"
              value={categoryResearch}
              onChange={handleCategoryResearchChange}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
            onClick={() => updateQueryString("addCourseGroup")}
          >
            ย้อนกลับ
          </button>
          <button
            className="px-8 py-2 bg-red border border-red text-white rounded"
            type="submit"
          >
            บันทึก
          </button>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">บันทึกข้อมูลสำเร็จ!</h3>
            <p className="py-4 text-gray-500">
              กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
            </p>
            <div className="modal-action flex justify-between">
              <form method="dialog" className="w-full flex justify-between">
                <button className="px-10 py-2 bg-white text-red border font-semibold border-red rounded">
                  ปิด
                </button>
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() => navigate("/course")}
                >
                  หน้าแรก
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </form>
    </div>
  );
};

export default AddSubject;
