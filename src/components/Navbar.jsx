import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  let [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 px-4 sm:px-6 md:px-8 lg:px-[8%] xl:px-[10%] mb-5 border-b border-b-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT US</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT US</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/docai" className="relative">
          <li className="py-1 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            DOC AI
          </li>
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded-full text-gray-800 font-bold animate-pulse shadow-md">
            AI
          </span>
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userData?.image || assets.profile_pic}
              alt="Profile Picture"
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="dropdown_icon"
            />
            <div className="absolute right-0 top-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl flex flex-col gap-4 p-4 border border-gray-100">
                <p
                  onClick={() => {
                    navigate("/my-profile");
                  }}
                  className="hover:text-black cursor-pointer transition-colors"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/my-appointments");
                  }}
                  className="hover:text-black cursor-pointer transition-colors"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer transition-colors"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Create account
          </button>
        )}
        <img
          className="w-6 md:hidden"
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt=""
        />
        {showMenu && (
          <div className="fixed inset-0 z-20 md:hidden bg-white/95 backdrop-blur-md transition-all">
            <div className="flex items-center justify-between px-5 py-6 bg-white/95 backdrop-blur-md border-b border-gray-100">
              <img className="w-44" src={assets.logo} alt="Logo" />
              <button
                className="w-8"
                onClick={() => setShowMenu(false)}
                aria-label="Close menu"
              >
                <img src={assets.cross_icon} alt="Close menu" />
              </button>
            </div>
            <nav
              aria-label="Mobile navigation"
              className="px-5 pb-4 bg-white/95"
            >
              <ul className="flex flex-col items-center gap-2 text-lg font-medium">
                <li className="w-full">
                  <NavLink
                    to="/"
                    onClick={() => setShowMenu(false)}
                    className="block w-full text-center px-4 py-2 rounded"
                  >
                    HOME
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/doctors"
                    onClick={() => setShowMenu(false)}
                    className="block w-full text-center px-4 py-2 rounded"
                  >
                    ALL DOCTORS
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/about"
                    onClick={() => setShowMenu(false)}
                    className="block w-full text-center px-4 py-2 rounded"
                  >
                    ABOUT US
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/contact"
                    onClick={() => setShowMenu(false)}
                    className="block w-full text-center px-4 py-2 rounded"
                  >
                    CONTACT US
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/docai"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span>DOC AI</span>
                    <span className="bg-yellow-400 text-xs px-2 py-0.5 rounded-full text-gray-800 font-bold">
                      AI
                    </span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
