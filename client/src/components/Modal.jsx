
import React, { useContext, useEffect } from "react";


import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Modal = ({ name, onLogin }) => {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from?.pathname || "/";
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  const onSubmit = async (data) => {
    console.log("Submitting login data:", data);
    const result = await login(data.username, data.password);
    if (result.success) {

      const { token, userData } = result;
      console.log("Login successful. Token:", token); // ล็อก token
      console.log("UserData:", userData); // ล็อกข้อมูลผู้ใช้
      localStorage.setItem("authToken", token); // ตั้งค่า token ด้วยคีย์ "authToken"
      localStorage.setItem("userData", JSON.stringify(userData)); // ตั้งค่า userData
      setUser(userData); // ตั้งค่า userData ใน context
      document.getElementById(name).close();
      onLogin();

      // Navigate based on role
      if (userData?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (userData?.role === "STUDENT") {
        navigate("/student", { replace: true });
      } else if (userData?.role === "COURSE_INSTRUCTOR") {
        navigate("/course", { replace: true });
      } else if (userData?.role === "ADVISOR") {
        navigate("/advice", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      alert("Login Successful");

    } else {
      setShowLoginModal(false);
      setMessage("เข้าสู่ระบบไม่สำเร็จ !");
      setMessage2("*กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setShowLoginModal(true);
      }, 2000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");
    if (token && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUser(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, [setUser]);

  return (
    <div>

      <dialog
        id={name}
        className="modal modal-bottom sm:modal-middle text-black"
      >
        <div className="modal-box">
          <div className="modal-action mt-0 flex flex-col justify-center">
            <h3 className="font-bold text-lg text-center">โปรดเข้าสู่ระบบ</h3>
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered"
                  required
                  {...register("username")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  required
                  {...register("password")}
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <input
                  type="submit"
                  value="เข้าสู่ระบบ"
                  className="btn bg-red text-white"
                />
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => document.getElementById(name).close()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-red"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"

                  />
                  <label className="label">
                    <a href="#" className="label-text-alt link link-hover">
                      Forgot password?
                    </a>
                  </label>
                </div>
                <div className="form-control mt-6">
                  <input
                    type="submit"
                    value="เข้าสู่ระบบ"
                    className="btn bg-red text-white"
                  />
                </div>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => document.getElementById(name).close()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg modal-box">
            <h3 className="font-bold text-red text-xl pb-4">{message}</h3>
            <p className="text-lg py-4 text-gray-500">{message2}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
