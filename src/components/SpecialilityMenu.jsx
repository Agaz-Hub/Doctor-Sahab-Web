import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

function SpecialilityMenu() {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-6 py-16 md:py-20 text-gray-800 bg-gradient-to-b from-blue-50/40 to-white rounded-3xl my-12"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Find by Speciality
      </h1>
      <p className="sm:w-2/3 md:w-1/2 text-sm md:text-base text-center text-gray-600 px-4">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex sm:justify-center gap-4 md:gap-6 pt-5 w-full overflow-x-auto px-4 pb-2">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center cursor-pointer text-xs md:text-sm flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 bg-white p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md min-w-[120px]"
            key={index}
            to={`doctors/${item.speciality}`}
          >
            <img
              className="w-16 sm:w-20 md:w-24 mb-3"
              src={item.image}
              alt=""
            />
            <p className="font-medium text-gray-700 text-center">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpecialilityMenu;
