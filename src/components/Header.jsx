import React from "react";
import { assets } from "../assets/assets";

function Header() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-primary via-indigo-600 to-blue-600 rounded-2xl px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 shadow-xl my-8 overflow-hidden">
      {/* ------ Left Side ------ */}
      <div className="md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-16 md:py-16 lg:py-18 md:pr-8">
        <p className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl text-center md:text-start text-white font-bold leading-tight drop-shadow-md">
          Book Appointment <br />
          With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center text-white gap-3 text-sm md:text-sm lg:text-base font-light max-w-lg">
          <img
            className="w-24 sm:w-28 md:w-28 lg:w-32"
            src={assets.group_profiles}
            alt=""
          />
          <p className="text-center md:text-start opacity-95 leading-relaxed">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center px-8 py-3.5 gap-2 rounded-full bg-white text-primary text-sm md:text-sm lg:text-base font-semibold mt-4 hover:scale-105 hover:shadow-lg transition-all duration-500"
        >
          Book Appointment{" "}
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* ------ Right Side ------ */}
      <div className="md:w-1/2 relative flex items-end justify-center md:justify-end min-h-[280px] md:min-h-[320px] lg:min-h-[360px]">
        <img
          className="w-full max-w-md md:max-w-sm lg:max-w-md md:absolute bottom-0 right-0 h-auto rounded-lg object-contain"
          src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
}

export default Header;
