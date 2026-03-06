import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 my-16 md:my-20 text-gray-900">
      <h1 className="text-3xl md:text-4xl font-bold">Top Doctors to Book</h1>
      <p className="sm:w-2/3 md:w-1/2 text-center text-sm md:text-base text-gray-600 px-4">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pt-5 px-3 sm:px-0">
        {doctors.slice(0, 8).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white shadow-sm hover:shadow-xl h-full"
          >
            <div className="aspect-square overflow-hidden">
              <img
                className="bg-gradient-to-br from-blue-50 to-indigo-50 w-full h-full object-cover"
                src={item.image}
                alt=""
              />
            </div>
            <div className="p-4">
              <div className="flex items-center text-green-500 text-center gap-2 text-sm mb-2">
                <p className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 font-medium text-lg">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate(`/doctors`);
          scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-full px-12 py-3 mt-10 hover:scale-105 hover:shadow-lg transition-all"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
