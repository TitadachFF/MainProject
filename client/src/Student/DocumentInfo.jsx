import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DocumentInfo = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [academicName, setAcademicName] = useState("");
  const [studentData, setStudentData] = useState({
    student_id: "",
    titlenameTh: "",
    firstname: "",
    lastname: "",
    titlenameEng: "",
    firstnameEng: "",
    lastnameEng: "",
    birthdate: "",
    monthdate: "",
    yeardate: "",
    phone: "",
    sector_status: "",
    corps: "",
    sec_id: "",
    academic_id: "",
    pre_educational: "",
    graduated_from: "",
    pregraduatedyear: "",
    afterendcontact: "",
    homenumber: "",
    road: "",
    alley: "",
    subdistrict: "",
    district: "",
    province: "",
    advisor_id: "",
    wanttoend: "",
    yeartoend: "",
  });
  const [sections, setSections] = useState({
    sec_name: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [advisor, setAdvisor] = useState({
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");

        if (token && storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const studentId = parsedUserData.decoded.id;
          const academicNameFromToken =
            parsedUserData.decoded.academic.academic_name || "";
          setAcademicName(academicNameFromToken);
          const studentResponse = await axios.get(
            `http://localhost:3000/api/getStudentById/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setStudentData(studentResponse.data);

          const sectionResponse = await axios.get(
            `http://localhost:3000/api/getSectionById/${studentResponse.data.sec_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSections(sectionResponse.data);

          const advisorResponse = await axios.get(
            `http://localhost:3000/api/getAdvisorById/${studentResponse.data.advisor_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdvisor(advisorResponse.data);

          console.log(advisorResponse.data);
          console.log(studentResponse.data);
          console.log(sectionResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // ป้องกันการ submit ฟอร์มแบบปกติ
    try {
      const token = localStorage.getItem("token");

      // เช็คว่ามี studentId หรือไม่
      if (studentData.student_id) {
        console.log("Student data to update:", studentData); // ตรวจสอบค่าที่จะถูกส่งไปยัง API

        const response = await axios.put(
          `http://localhost:3000/api/updateStudent/${studentData.student_id}`,
          studentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Update response:", response.data);

        if (response.status === 200) {
          document.getElementById("my_modal_1").showModal();
          setMessage("อัพเดตข้อมูลสำเร็จ!");
          setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error updating student data:", error.message);
      document.getElementById("my_modal_1").showModal();
      setMessage("* เกิดข้อผิดพลาดจากเซิฟเวอร์");
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <div className="grid grid-cols-1 gap-2">
        <div className="space-y-2">
          <label className="flex text-gray-700 ">
            รหัสประจำตัว*{" "}
            <p className="text-xs text-gray-400 pl-1"> ตัวอย่าง 644259000</p>
          </label>
          <input
            type="text"
            name="student_id"
            value={studentData.student_id}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="รหัสประจำตัว"
          />
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <label className="block text-gray-700">คำนำหน้าชื่อ</label>
              <select
                name="titlenameTh"
                value={studentData.titlenameTh}
                onChange={handleChange}
                className="w-24 mt-1 border border-gray-300 rounded p-2" // กำหนดความกว้างที่เล็กที่สุด
              >
                <option value="" disabled>
                  เลือกคำนำหน้าชื่อ
                </option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div className="flex-grow">
              <label className="block text-gray-700">ชื่อ</label>
              <input
                type="text"
                name="firstname"
                value={studentData.firstname}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อ"
              />
            </div>
            <div className="flex-grow">
              <label className="block text-gray-700">นามสกุล</label>
              <input
                type="text"
                name="lastname"
                value={studentData.lastname}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <label className="block text-gray-700 ">
                คำนำหน้าชื่ออังกฤษ <p className="text-sm"></p>
              </label>
              <select
                name="titlenameEng"
                value={studentData.titlenameEng}
                onChange={handleChange}
                className=" mt-1 border border-gray-300 rounded p-2" // กำหนดความกว้างที่เล็กที่สุด
              >
                <option value="" disabled>
                  เลือกคำนำหน้าชื่อ
                </option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Miss">Miss</option>
              </select>
            </div>
            <div className="flex-grow">
              <label className="block text-gray-700">ชื่อภาษาอังกฤษ</label>
              <input
                type="text"
                name="firstnameEng"
                value={studentData.firstnameEng}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="ชื่อภาษาอังกฤษ"
              />
            </div>
            <div className="flex-grow">
              <label className="block text-gray-700">นามสกุลภาษาอังกฤษ</label>
              <input
                type="text"
                name="lastnameEng"
                value={studentData.lastnameEng}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="นามสกุลภาษาอังกฤษ"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <label className="block text-gray-700">วันเกิด</label>
              <input
                type="text"
                name="birthdate"
                value={studentData.birthdate}
                onChange={handleChange}
                className="w-24 mt-1 border border-gray-300 rounded p-2"
                placeholder="วันเกิด"
              />
            </div>
            <div className="flex-grow">
              <label className="flex text-gray-700">
                เดือนเกิด{" "}
                <p className="text-xs text-gray-400 pl-1"> ตัวอย่าง มกราคม</p>
              </label>
              <input
                type="text"
                name="monthdate"
                value={studentData.monthdate}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="เดือนเกิด"
              />
            </div>
            <div className="flex-grow">
              <label className="flex text-gray-700">
                ปีเกิด{" "}
                <p className="text-xs text-gray-400 pl-1">
                  {" "}
                  ให้ใส่เป็นพศ.ตัวอย่าง 2560
                </p>
              </label>
              <input
                type="text"
                name="yeardate"
                value={studentData.yeardate}
                onChange={handleChange}
                className="w-24 mt-1 border border-gray-300 rounded p-2"
                placeholder="ปีเกิด"
              />
            </div>
          </div>
          <label className="block text-gray-700">เบอร์โทร</label>
          <input
            type="text"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="เบอร์โทร"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <label className="block text-gray-700">เป็นนักศึกษา</label>
            <select
              name="sector_status"
              value={studentData.sector_status}
              onChange={handleChange}
              className="w-24 mt-1 border border-gray-300 rounded p-2" // กำหนดความกว้างที่เล็กที่สุด
            >
              <option value="" disabled>
                เลือกภาค
              </option>
              <option value="ภาคปกติ">ภาคปกติ</option>
              <option value="กศ.พป.">กศ.พป.</option>
            </select>
          </div>
          <div className="flex-grow">
            <label className="flex text-gray-700">
              หลักสูตร{" "}
              <p className="text-xs text-gray-400 pl-1">
                ตัวอย่าง หลักสูตรวิทยาศาสตรบัณฑิต
              </p>
            </label>

            <input
              type="text"
              name="corps"
              value={studentData.corps}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="หลักสูตร"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <label className="block text-gray-700">หมู่เรียน</label>
            <input
              type="text"
              name="sec_name"
              disabled
              value={sections.sec_name}
              onChange={handleChange}
              className="w-24 mt-1 border border-gray-300 rounded p-2 hover:cursor-text"
              placeholder="หลักสูตร"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">สาขาวิชา</label>
            <input
              type="text"
              name="academic_name "
              value={academicName}
              disabled
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="สาขาวิชา"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <label className="flex text-gray-700">
              ก่อนเข้าศึกษาได้วุฒิ{" "}
              <p className="text-xs text-gray-400 pl-1"> ตัวอย่าง ม.6</p>
            </label>
            <input
              type="text"
              name="pre_educational"
              value={studentData.pre_educational}
              onChange={handleChange}
              className=" mt-1 border border-gray-300 rounded p-2"
              placeholder="ก่อนเข้าศึกษาได้วุฒิ"
            />
          </div>
          <p className="mt-6">จาก</p>
          <div className="flex-grow">
            <label className="flex text-gray-700 mt-2">
              <p className="text-xs text-gray-400 pl-1">
                {" "}
                ตัวอย่าง โรงเรียนมัธยมศึกษา
              </p>
            </label>
            <input
              type="text"
              name="graduated_from"
              value={studentData.graduated_from}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder=""
            />
          </div>
          <p className="mt-6"> เมื่อ พ.ศ. </p>
          <div className="flex-grow">
            <label className="flex text-gray-700 mt-2">
              <p className="text-xs text-gray-400 pl-1">
                {" "}
                ให้ใส่เป็นพศ.ตัวอย่าง 2560
              </p>
            </label>
            <input
              type="text"
              name="pregraduatedyear"
              value={studentData.pregraduatedyear}
              onChange={handleChange}
              className="w-24 mt-1 border border-gray-300 rounded p-2"
              placeholder="ปีเกิด"
            />
          </div>
        </div>
        <div>
          <label className="flex text-gray-700">
            เมื่อสำเร็จแล้วติดต่อข้าพเจ้าได้ที่
            <p className="text-xs text-gray-400 pl-1">
              ตัวอย่าง เช่น หมายเลขโทรศัพท์
            </p>
          </label>
          <input
            type="text"
            name="afterendcontact"
            value={studentData.afterendcontact}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="เมื่อสำเร็จแล้วติดต่อข้าพเจ้าได้ที่"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <label className="block text-gray-700">ตำบล</label>
            <input
              type="text"
              name="subdistrict"
              value={studentData.subdistrict}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="ตำบล"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">อำเภอ</label>
            <input
              type="text"
              name="district"
              value={studentData.district}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="อำเภอ"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">จังหวัด</label>
            <input
              type="text"
              name="province"
              value={studentData.province}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="จังหวัด"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <label className="block text-gray-700">บ้านเลขที่</label>
            <input
              type="text"
              name="homenumber"
              value={studentData.homenumber}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="บ้านเลขที่"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">ถนน</label>
            <input
              type="text"
              name="road"
              value={studentData.road}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="ถนน"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">ตรอก / ซอย</label>
            <input
              type="text"
              name="alley"
              value={studentData.alley}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="ตรอก / ซอย"
            />
          </div>
          <div className="flex-grow">
            <label className="block text-gray-700">รหัสไปรษณีย์</label>
            <input
              type="text"
              name="zipcode"
              value={studentData.zipcode}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded p-2"
              placeholder="รหัสไปรษณีย์"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">อาจารย์ที่ปรึกษา</label>
          <input
            type="text"
            name="firstname"
            disabled
            value={`${advisor.firstname} ${advisor.lastname}`}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="รหัสไปรษณีย์"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <label className=" text-gray-700 mr-2">
              มีความประสงค์จะขอจบการศึกษา เมื่อสิ้นภาคเรียนที่
            </label>
            <input
              type="text"
              name="wanttoend"
              value={studentData.wanttoend}
              onChange={handleChange}
              className="w-24  mt-1 border border-gray-300 rounded p-2"
              placeholder="ภาคเรียน"
            />
          </div>
          <div className="flex-grow">
            <label className=" text-gray-700 mr-2">ปีการศึกษา</label>
            <input
              type="text"
              name="yeartoend"
              value={studentData.yeartoend}
              onChange={handleChange}
              className="w-16 mt-1 border border-gray-300 rounded p-2"
              placeholder="ปี"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between ">
        <button
          type="button"
          className="p-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 hover:shadow-md"
          onClick={() => navigate("/student")}
        >
          ย้อนกลับ
        </button>
        <button
          type="submit"
          className="p-6 py-2 bg-red border text-white rounded hover:bg-gray-400 hover:shadow-md"
        >
          บันทึก
        </button>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 id="alertmodal" className="font-bold text-lg">
            {message}
          </h3>
          <p className="py-4 text-gray-500">
            กดปุ่ม ESC หรือ กดปุ่มปิดด้านล่างเพื่อปิด
          </p>
          <div className="modal-action flex justify-between">
            <form method="dialog" className="w-full flex justify-between">
              <button
                id="close-alertmodal"
                className="px-10 py-2 bg-white text-red border font-semibold border-red rounded"
              >
                ปิด
              </button>
              {isSuccess && (
                <button
                  className="px-8 py-2 bg-red border border-red text-white rounded"
                  onClick={() => navigate("/student")}
                >
                  หน้าแรก
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </form>
  );
};

export default DocumentInfo;
