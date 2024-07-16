import React, { useContext, useState, useEffect } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setUserData(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 py-5 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a href="/" className="pl-4 text-5xl text-red pr-2  font-serif  ">
          SE
        </a>
        <div className="border-l-4">
          <p className="pl-2 text-sm  pt-1">
            Graduated System <br />
            ระบบกรอกแบบฟอร์มคำร้องขอสำเร็จการศึกษา
          </p>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex ">
        <ul className="menu menu-horizontal px-1  ">
          <li>
            <a
              className="font-semibold hover:underline"
              onClick={() => navigate("/")}
            >
              หน้าแรก
            </a>
          </li>
          {/* {user.role === "STUDENT" && (
            <li>
              <a
                className="font-semibold hover:underline"
                onClick={() => navigate("/student")}
              >
                StudentMenu
              </a>
            </li>
          )}
          {user.role === "COURSE_INSTRUCTOR" && (
            <li>
              <a
                className="font-semibold hover:underline"
                onClick={() => navigate("/course")}
              >
                CourseManagerMenu
              </a>
            </li>
          )}
          {user.role === "ADVISOR" && (
            <li>
              <a
                className="font-semibold hover:underline"
                onClick={() => navigate("/advice")}
              >
                AdviceMenu
              </a>
            </li>
           )} */}
          {user?.role === "ADMIN" && (
            <li>
              <a
                className="font-semibold hover:underline"
                onClick={() => navigate("/admin")}
              >
                AdminMenu
              </a>
            </li>
          )}
          <li>
            <details>
              <summary>Parent Dropdown</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a className="hover:underline">ข้อมูลส่วนตัว</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end pr-4">
        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-red"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <div className="justify-between">
                  <span>{userData?.decoded.name}</span>
                  <span className="badge">{userData?.decoded.role}</span>
                </div>
              </li>
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <a
            className=" btn rounded-full p-2 pr-5 pl-5 bg-red text-white cursor-pointer"
            onClick={() => document.getElementById("login").showModal()}
          >
            เข้าสู่ระบบ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
        <Modal name="login" onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Navbar;
