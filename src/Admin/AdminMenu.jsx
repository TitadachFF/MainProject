import React from "react";
import { useNavigate } from "react-router-dom";

const AdminMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="pb-[120px]">
      <div className="py-4 px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p>เมนูแอดมิน</p>
      </div>

      <div className="py-20 flex flex-wrap justify-center gap-4 p-4">
        {/* Card 1 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/adduser")}
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
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เพิ่มผู้ใช้</h2>
            <p className="border-t py-2">
              เพิ่มผู้ใช้ เช่น อาจารย์ นักศึกษา ตัวแทนหลักสูตร เข้ามาในระบบ
            </p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="card w-96 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/alluser")}
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
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">ดูรายชื่อผู้ใช้</h2>
            <p className="border-t py-2">
              ดูข้อมูลผู้ใช้ และ แก้ไขข้อมูลผู้ใช้ในระบบ
            </p>
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
      </div>
    </div>
  );
};

export default AdminMenu;
