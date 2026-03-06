import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gradient-to-r from-primary to-indigo-600 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 my-28 md:my-32 shadow-xl">
      {/* ------ Left Side ------ */}
      <div className="flex-1 py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-xs sm:text-sm text-primary font-semibold px-6 py-3 rounded-full mt-6 hover:scale-105 hover:shadow-lg transition-all"
        >
          Create account
        </button>
      </div>

      {/* ------ Right Side ------ */}
      <div className="hidden md:block md:w-3/5 lg:w-[400px] relative">
        <img
          className="w-full absolute right-0 bottom-0 max-w-lg h-auto object-contain"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
