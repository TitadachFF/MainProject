import React from "react";
import { useNavigate } from "react-router-dom";

const CourseMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-36">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p>เมนูตัวแทนหลักสูตร</p>
      </div>
      <div className=" py-20 flex flex-wrap justify-center gap-4 p-4 ">
        {/* Card 1 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/addcourse")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เพิ่มหลักสูตร</h2>
            <p className="border-t py-2">เพิ่มหลักสูตรเข้าไปในระบบ</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/allcourse")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">ดูหลักสูตร</h2>
            <p className="border-t py-2">ตรวจสอบหลักสูตร</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card3 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/courseinfo")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">ข้อมูลส่วนตัว</h2>
            <p className="border-t py-2">
              ดูข้อมูลส่วนตัว และ แก้ไขข้อมูลส่วนตัว
            </p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card4 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/addclassroom")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เพิ่มหมู่เรียน</h2>
            <p className="border-t py-2">เพิ่มหมู่เรียน</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card5 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/allteacher")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">ดูรายชื่ออาจารย์</h2>
            <p className="border-t py-2">ดูรายชื่อ และ แก้ไขข้อมูลอาจารย์</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card6
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/alladvisor")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-40 my-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">ดูรายชื่ออาจารย์ที่ปรึกษา</h2>
            <p className="border-t py-2">ดูรายชื่อ และ แก้ไขข้อมูลอาจารย์ที่ปรึกษา</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div> */}

        
      </div>
    </div>
  );
};

export default CourseMenu;
