import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

const SkeletonUser = () => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <div className="skeleton h-6 w-6 mr-2"></div>
      <div>
        <div className="skeleton h-4 w-32 mb-1"></div>
        <div className="skeleton h-3 w-24"></div>
      </div>
    </div>
    <div className="flex space-x-2">
      <div className="skeleton h-8 w-16"></div>
      <div className="skeleton h-8 w-20"></div>
      <div className="skeleton h-8 w-12"></div>
    </div>
  </div>
);

const AllUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserPassword, setEditingUserPassword] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedUserName, setUpdatedUserName] = useState("");
  const [updatedUserPassword, setUpdatedUserPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUnSuccessModal, setShowUnSuccessModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const [studentsResponse, teachersResponse] = await Promise.all([
          fetch("http://localhost:3000/api/getAllStudents", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:3000/api/getAllTeachers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!studentsResponse.ok || !teachersResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const studentsData = await studentsResponse.json();
        const teachersData = await teachersResponse.json();

        // Combine students and teachers into a single array
        const combinedUsers = [
          ...studentsData.map((student) => ({
            ...student,
            role: "STUDENT",
            name: `${student.S_firstname} ${student.S_lastname}`,
          })),
          ...teachersData.map((teacher) => ({
            ...teacher,
            role: "TEACHER",
            name: `${teacher.T_firstname} ${teacher.T_lastname}`,
          })),
        ];

        setUsers(combinedUsers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const roleOptions = [
    { value: "ทั้งหมด", label: "ทั้งหมด" },
    { value: "STUDENT", label: "นักศึกษา" },
    // { value: "ADVISOR", label: "ที่ปรึกษา" },
    // { value: "COURSE_INSTRUCTOR", label: "ตัวแทนหลักสูตร" },
    { value: "TEACHER", label: "อาจารย์" },
    // { value: "ADMIN", label: "แอดมิน" },
  ];

  const filteredUsers = users.filter((user) => {
    return (
      (selectedRole === "ทั้งหมด" ||
        selectedRole === "" ||
        user.role === selectedRole) &&
      (user.name || "").toLowerCase().includes(searchUser.toLowerCase())
    );
  });

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchUser(e.target.value);
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setUpdatedName(user.name);
    setUpdatedRole(user.role);
    setUpdatedUserName(user.username);
  };

  const startEditingPassword = (user) => {
    setEditingUserPassword(user);
    setUpdatedUserPassword("");
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        name: updatedName,
        role: updatedRole,
        username: updatedUserName,
        password: updatedUserPassword,
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(
        `http://localhost:3000/api/updateUser/${
          editingUser ? editingUser.id : editingUserPassword.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      setEditingUser(null);
      setEditingUserPassword(null);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      setError(error.message);
      setShowUnSuccessModal(true);
      setTimeout(() => {
        setShowUnSuccessModal(false);
        window.location.reload();
      }, 1000);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/deleteUser/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
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
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-3 flex">
                <div className="flex space-x-4">
                  <div className="relative w-40">
                    <div className="skeleton h-10 w-full rounded-full"></div>
                  </div>
                </div>
                <div className="w-full pl-20 mr-0">
                  <div className="skeleton h-10 w-full rounded-full"></div>
                </div>
              </div>
              <div className="overflow-y-auto h-full">
                <ul className="divide-y divide-gray-200">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                      <SkeletonUser />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <div className="skeleton h-10 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="min-h-screen flex justify-center p-6 bg-gray-100">
        <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-red font-bold mb-6 text-red-600">
            ดูรายชื่อผู้ใช้
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="mb-3 flex">
              <div className="w-40">
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="p-2 border rounded"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full pl-20 mr-0">
                <input
                  type="text"
                  id="search"
                  className="w-full mt-1 bg-white border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                  placeholder="ค้นหารายชื่อผู้ใช้"
                  value={searchUser}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                      <div>
                        <div className="flex">
                          <p className="pr-2">{user.name}</p>{" "}
                          <p className="text-xs badge bg-red text-white">
                            {
                              roleOptions.find(
                                (option) => option.value === user.role
                              )?.label
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(user)}
                        className="px-4 py-2 bg-orange-300 text-white text-sm rounded"
                      >
                        แก้ไข
                      </button>
                      {/* <button
                        onClick={() => startEditingPassword(user)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        เปลี่ยนรหัสผ่าน
                      </button> */}
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-4 py-2 text-white bg-red rounded"
                      >
                        ลบ
                      </button>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg> */}

                    </div>
                  </li>
                ))}
              </ul>
            </div>
 NewFrom
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 border border-red0 text-red rounded"
                onClick={() => navigate("/admin")}
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      </div>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-4/5 md:w-1/2 lg:w-1/3 h-3/5 max-h-screen flex flex-col">
            <div className=" text-white rounded-t-lg p-4 flex-shrink-0">
              <h3 className="text-xl text-red">แก้ไขนักศึกษา</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  Name
                </label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="p-2 border rounded w-full"
                />

              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  Username
                </label>
                <input
                  type="text"
                  value={updatedUserName}
                  onChange={(e) => setUpdatedUserName(e.target.value)}
                  className="mt-1 w-full h-9 rounded border-gray-300 p-2 border text-gray-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-md font-medium text-black">
                  Role
                </label>
                <select
                  value={updatedRole}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-100 rounded-b-lg p-4 flex-shrink-0 flex justify-end space-x-2">
              <button
                className="px-4 py-1 bg-red border border-red text-white rounded"
                onClick={saveChanges}
              >
                บันทึก
              </button>
              <button
                className="px-4 py-1 bg-gray-100 border rounded"
                onClick={() => setEditingUser(null)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Success</h3>
            <p>User updated successfully.</p>
          </div>
        </div>
      )}
      {showUnSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Error</h3>
            <p>Failed to update user.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUser;
