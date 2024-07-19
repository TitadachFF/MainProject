import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";

const AllUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const roleOptions = [
    { value: "ทั้งหมด", label: "ทั้งหมด" },
    { value: "STUDENT", label: "นักศึกษา" },
    { value: "ADVISOR", label: "ที่ปรึกษา" },
    { value: "COURSE_INSTRUCTOR", label: "ตัวแทนหลักสูตร" },
    { value: "ADMIN", label: "แอดมิน" },
  ];

  const filteredUsers = users.filter((user) => {
    return (
      (selectedRole === "ทั้งหมด" ||
        selectedRole === "" ||
        user.role === selectedRole) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setUpdatedName(user.name);
    setUpdatedRole(user.role);
  };

  const saveChanges = async () => {
    try {
      const requestBody = { name: updatedName, role: updatedRole };

      const response = await fetch(
        `http://localhost:3000/api/updateUser/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/deleteUser/${userId}`,
        {
          method: "DELETE",
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
                  className=" text-sm w-full mt-1 bg-white border border-gray-300 rounded-full py-2 px-4 leading-tight focus:outline-none focus:border-gray-500"
                  placeholder="ค้นหารายชื่อผู้ใช้"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                      <div>
                        <div className="flex">
                          <p className="pr-2">{user.name}</p>{" "}
                          <p className="text-xs badge">
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
                        type="button"
                        className="px-4 py-2 bg-orange-300 text-white text-sm rounded"
                        onClick={() => startEditing(user)}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-red text-white text-sm rounded"
                        onClick={() => deleteUser(user.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {editingUser && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-1/3">
                  <h3 className="text-xl mb-4 text-red">Edit User</h3>
                  <div className="mb-2">
                    <label className="block text-md font-medium text-black">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded border-gray-300 shadow-sm text-gray-500"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-md font-medium text-black">
                      Role
                    </label>
                    <select
                      className="w-full mt-1 bg-white border border-gray-300 rounded py-2 pl-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                      value={updatedRole}
                      onChange={(e) => setUpdatedRole(e.target.value)}
                    >
                      {roleOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-white text-sm rounded"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red text-white text-sm rounded"
                      onClick={saveChanges}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showSuccessModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-1/3">
                  <p className="text-green-500 text-lg font-bold">Success!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUser;
