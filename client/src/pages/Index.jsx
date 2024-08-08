import React from "react";

const Index = () => {
  return (
    <div className="section-container mx-auto pb-16 pt-28 min-h-screen">
      {/* Title */}
      <p className="font-normal text-5xl text-start py-10 text-gray-600 leading-tight">
        ยินดีต้อนรับ{" "}
        <span className="block text-3xl">
          ระบบกรอกเเบบฟอร์มคำร้องขอสำเร็จการศึกษา
        </span>
      </p>
      <p className="text-xl text-gray-400 mb-8">
        ระบบกรอกเกรดเป็นระบบที่ช่วยให้การกรอกแบบฟอร์มร้องขอจบการศึกษาง่ายมากยิ่งขึ้นและลดข้อผิดพลาดในการกรอกข้อมูล!
      </p>

      {/* Grid Box */}

      <div className="md:col-span-2 border rounded-sm h-auto">
        <div className="border-b h-12 p-2 px-6 bg-red flex items-center justify-between">
          <p className="text-white text-xl font-semibold">ประกาศเรื่อง 📢</p>
          <a
            href="https://drive.google.com/file/d/1hbeDZIBdAdLc1doWCHlXp8Vdvgz2F2qj/view"
            target="_blank"
            className="flex items-center ml-auto text-white font-semibold px-4 rounded-xl bg-gray-700 hover:bg-gray-300"
            rel="noopener noreferrer"
          >
           ตัวอย่างเอกสาร
           📝
           
          </a>
        </div>

        <div className="content p-6 space-y-4">
          <a
            className="flex font-semibold hover:text-red py-2 hover:underline"
            href="https://news.npru.ac.th/u_news/detail.php?news_id=34762&ref_id=PR"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
              />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
            11-03-2567 : ประกาศเรื่องการจัดการเรียนการสอนออนไลน์อาคารเรียน เอ7
          </a>
          <a
            className="flex font-semibold hover:text-red py-2 hover:underline"
            href="https://news.npru.ac.th/u_news/detail.php?news_id=33315&ref_id=PR"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
              />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
             17-10-2566 : กำหนดการเปิดการเรียน การลงทะเบียน การชำระเงิน
            การสอบกลางภาค และการสอบปลายภาค นักศึกษาภาคปกติ ทุกชั้นปี
            ประจำภาคเรียนที่ 2/2566
          </a>
          <a
            className="flex font-semibold hover:text-red py-2 hover:underline"
            href="https://news.npru.ac.th/u_news/detail.php?news_id=32345&ref_id=PR"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
              />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
             15-01-2567 : กำหนดการลงทะเบียนภาคการศึกษา 2/2566
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
