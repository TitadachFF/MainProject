import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

const Alluser = () => {
  const navigate = useNavigate();
  // State for user data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from backend
  // qwewqe
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getallUser"); 
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Dropdown options
  const roleOptions = [
    { value: "ทั้งหมด", label: "ทั้งหมด" },
    { value: "STUDENT", label: "นักศึกษา" },
    { value: "ADVISOR", label: "ที่ปรึกษา" },
    { value: "COURSE_INSTRUCTOR", label: "ตัวแทนหลักสูตร" }
  ];

  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    return (
      (selectedRole === "ทั้งหมด" || selectedRole === "" || user.role === selectedRole) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="px-2 text-gray-400 text-sm flex items-center pt-28">
        <p className="cursor-pointer" onClick={() => navigate("/")}>
          หน้าแรก
        </p>
        <span className="mx-1">&gt;</span>
        <p className="cursor-pointer" onClick={() => navigate("/admin")}>
          เมนูแอดมิน
        </p>
        <span className="mx-1">&gt;</span>
        <p>ดูรายชื่อผู้ใช้</p>
      </div>
      <div className="min-h-screen flex justify-center p-6 h-full">
        <div className="container mx-auto w-full max-w-3xl bg-white h-full rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ดูรายชื่อผู้ใช้
          </h2>
          {/* Form */}
          <div className="grid grid-cols-1 gap-6">
            <div className="mb-3 flex">
              <div className="flex space-x-4">
                <div className="relative w-40">
                  <select
                    id="role"
                    className="appearance-none w-full mt-1 bg-white border border-gray-300 rounded-full py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    {roleOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 5.293a1 1 0 011.414 0L10 10.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full pl-20 mr-0">
                <input
                  type="text"
                  id="search"
                  className="w-full mt-1 bg-white border border-gray-300 rounded-full py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                  placeholder="ค้นหารายชื่อผู้ใช้"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user.id} className="py-2 flex items-center">
                    <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                    <div>
                      <div className="flex">
                        <p className="text-lg pr-2">{user.name}</p>{" "}
                        <p className="text-sm badge text">
                          {roleOptions.find((option) => option.value === user.role)?.label}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{user.class}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red-600 text-red-600 rounded"
                onClick={() => navigate("/admin")}
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="px-8 py-2 bg-red  border border-red-600 text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alluser;
