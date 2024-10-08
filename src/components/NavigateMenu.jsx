import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-36">
      <div className="px-10 text-red text-xl font-bold flex items-center pt-28">
        <p>เลือกเมนูที่ต้องการใช้งาน</p>
      </div>
      <div className=" py-20 flex flex-wrap justify-center gap-4 p-4 ">

        {/* Card 1 */}
        <div
          className="card w-80 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/course")}
        >
          <figure>
            <svg
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-40 my-10"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              ></path>
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เมนูตัวแทนหลักสูตร</h2>
            <p className="border-t py-2">
              เข้าสู่การใช้งานในเมนูของตัวแทนหลักสูตรเพื่อแก้ไขหรือเพิ่มหลักสูตร
            </p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>


        {/* Card 2 */}
        <div
          className="card w-80 bg-base-100 shadow-xl border hover:bg-gray-50 cursor-pointer "
          onClick={() => navigate("/advice")}
        >
          <figure>
            <svg
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-40 my-10"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              ></path>
            </svg>
          </figure>
          <div className="card-body text-center">
            <h2 className="font-semibold">เมนูอาจารย์ที่ปรึกษา</h2>
            <p className="border-t py-2">
              เข้าสู่การใช้งานในเมนูของอาจารย์ที่ปรึกษา
              เพื่อจัดการกับนักศึกษาในหมู่เรียนของตัวเอง
            </p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigateMenu;
