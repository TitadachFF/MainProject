import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user?.photoURL ? (
                <div className="w-10 rounded-full">
                  <img alt="User Photo Profile" src={user?.photoURL} />
                </div>
              ) : (
                <img
                  alt="User Photo Profile"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              )}
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a href="/update-profile">Profile</a>
            </li>
            <li>
              <a href="/AddtoCart">Orders</a>
            </li>
            <li>
              <a>Setting</a>
            </li>
            <li>
              <a onClick={handleLogout}>Log out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
