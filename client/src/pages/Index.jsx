import React from "react";

const Index = () => {
  return (
    <div className="container mx-auto pb-[71px] pt-28">
      {/* Title */}
      <p className="font-normal text-5xl text-start py-10 text-gray-600">
        ยินดีต้อนรับ{" "}
        <span className="text-3xl">
          ระบบกรอกเเบบฟอร์มคำร้องขอสำเร็จการศึกษา
        </span>
      </p>
      <p className=" text-xl text-gray-400">
        ระบบกรอกเกรดเป็นระบบที่ช่วยให้การกรอกแบบฟอร์มร้องขอจบการศึกษาง่ายมากยิ่งขึ้นและลดข้อผิดพลาดในการกรอกข้อมูล!
      </p>

      {/* Grid Box */}
      <div>
        <div class=" grid grid-rows-3 grid-flow-col max-w-max py-9 h-[500px]">
          <div class="row-span-3 border rounded-sm">
            <div className=" font-bold  ">
              <p className="hover:text-red py-2 px-2 cursor-pointer">
                ปฎิทินการศึกษา
              </p>
              <p
                className="hover:text-red py-2 px-2 cursor-pointer"
                onClick={() =>
                  handleContentChange(
                    <div className="content flex-row px-6 "></div>
                  )
                }
              >
                เงื่อนไขจบการศึกษา
              </p>
              <a
                href="https://drive.google.com/file/d/1hbeDZIBdAdLc1doWCHlXp8Vdvgz2F2qj/view"
                target="_blank"
                className="hover:text-gray-200 mt-72 px-2 flex cursor-pointer bg-red p-1   text-white "
              >
                ตัวอย่างเอกสาร
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              </a>
            </div>
          </div>
          <div class="col-span-2  border h-[428px] ml-4 rounded-sm ">
            <div className="border-b max-w-full h-10 py-2 ">
              <p className=" text-gray-500 font-medium px-6 ">
                {" "}
                ปฏิทินการศึกษา
              </p>
            </div>

            <div className="content flex-row px-6  ">
              <a
                className="flex font-semibold hover:text-red py-2 hover:underline"
                href="https://news.npru.ac.th/u_news/detail.php?news_id=34762&ref_id=PR"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                    clipRule="evenodd"
                  />

                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                11-03-2567 : ประกาศเรื่องการจัดการเรียนการสอนออนไลน์อาคารเรียน
                เอ7
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
                  className="w-6 h-6"
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
                ประจำภาคเรียนที่ 2 ปีการศึกษา 2566
              </a>
              <a
                className="flex font-semibold hover:text-red py-2 hover:underline"
                href="https://news.npru.ac.th/u_news/detail.php?news_id=32743&ref_id=PR"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                    clipRule="evenodd"
                  />

                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                 07-08-2566 : ประกาศกำหนดการเปิดเรียน การลงทะเบียนเรียน
                การชำระเงิน การสอบกลางภาค และการสอบปลายภาค นักศึกษาภาคปกติ
                ทุกชั้นปี ประจำภาคเรียนที่ 1 ปีการศึกษา 2566
              </a>
              <a
                className="flex font-semibold hover:text-red py-2 hover:underline"
                href="https://news.npru.ac.th/u_news/detail.php?news_id=31688&ref_id=PR"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                    clipRule="evenodd"
                  />

                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                09-04-2566
                : ประกาศกำหนดการส่งผลการเรียนของนักศึกษาระดับปริญญาตรี ภาคปกติ
                สาขาครุศาสตร์ ภาคเรียน ชั้นปีที่ 3
              </a>
              <a
                className="flex font-semibold hover:text-red py-2 hover:underline"
                href="https://news.npru.ac.th/u_news/detail.php?news_id=29126&ref_id=PR"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                    clipRule="evenodd"
                  />

                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                08-08-2565 : ปฏิทินการศึกษา ภาคปกติ ปีการศึกษา 2565
              </a>
            </div>

            <div className="content flex-row px-6 pb-">
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
