import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="py-8 md:py-12">
      <div className="text-center text-2xl md:text-3xl pt-10 text-gray-600">
        <p>
          CONTACT <span className="text-gray-900 font-bold">US</span>
        </p>
      </div>

      <div className="my-12 md:my-16 flex flex-col justify-center md:flex-row gap-10 md:gap-12 lg:gap-16 mb-28 text-sm md:text-base bg-gradient-to-br from-blue-50/50 to-white p-8 md:p-12 lg:p-16 rounded-2xl shadow-sm">
        <img
          className="w-full md:w-5/12 lg:w-4/12 md:max-w-[400px] rounded-xl shadow-md object-cover h-auto"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6 flex-1">
          <p className="font-bold text-xl md:text-2xl text-gray-900 flex items-center gap-2">
            <span className="text-primary">📍</span> Our OFFICE
          </p>
          <p className="text-gray-600 leading-relaxed">
            123 Medical Plaza <br />
            Healthcare District, New Delhi, India
          </p>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-700">Tel:</span> +91 (11)
            4567-8900 <br />
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            contact@doctorsahab.com
          </p>
          <p className="font-bold text-xl md:text-2xl text-gray-900 flex items-center gap-2 mt-4">
            <span className="text-primary">💼</span> Careers at DOCTOR SAHAB
          </p>
          <p className="text-gray-600">
            Learn more about our teams and job openings.
          </p>
          <button className="bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-4 text-sm font-semibold rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
