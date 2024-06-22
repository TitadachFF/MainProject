import React from "react";
import { useNavigate } from "react-router-dom";

const StudentMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-36">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p>เมนูนักศึกษา</p>
      </div>

      <div className="py-20 flex flex-wrap justify-center gap-4 p-4">
        <div  
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/fillgrade")}
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">กรอกแบบบันทึกผลการเรียน</h2>
            <p className="border-t py-2">เพิ่มและแก้ไขผลการเรียน</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/documents")}
        >
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className=" my-10 size-40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เอกสาร</h2>
            <p className="border-t py-2">แก้ไข หรือ ตรวจสอบเอกสาร</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/studentinfo")}
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

        {/* Card 4 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/documentresponse")}
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
                d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">คำตอบกลับเอกสาร</h2>
            <p className="border-t py-2">
              ดูเอกสารที่ส่งไปยังอาจารย์ที่ปรึกษาตรวจสอบ
            </p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMenu;
