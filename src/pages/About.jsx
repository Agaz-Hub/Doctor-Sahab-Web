import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="py-8 md:py-12">
      <div className="text-center text-2xl md:text-3xl pt-10 text-gray-600">
        <p>
          ABOUT <span className="text-gray-900 font-bold">US</span>
        </p>
      </div>

      <div className="my-12 md:my-16 flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 bg-gradient-to-br from-blue-50/50 to-white p-6 md:p-10 lg:p-12 rounded-2xl shadow-sm">
        <img
          className="w-full md:w-5/12 lg:w-4/12 md:max-w-[400px] rounded-xl shadow-md object-cover h-auto md:h-[400px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 flex-1 text-sm md:text-base text-gray-600">
          <p className="leading-relaxed">
            Welcome to Doctor Sahab, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Doctor Sahab, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="leading-relaxed">
            Doctor Sahab is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Doctor Sahab is here to support you every step of the
            way.
          </p>
          <b className="text-gray-900 text-lg md:text-xl">Our Vision</b>
          <p className="leading-relaxed">
            Our vision at Doctor Sahab is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      <div className="text-xl md:text-2xl my-8 md:my-12 text-center">
        <p>
          WHY <span className="text-gray-900 font-bold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20 gap-6 md:gap-4 lg:gap-6">
        <div className="border-2 border-blue-100 bg-white px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 flex flex-col gap-5 text-[15px] md:text-base hover:bg-gradient-to-br hover:from-primary hover:to-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 flex-1">
          <b className="text-lg md:text-xl">Efficiency:</b>
          <p className="leading-relaxed">
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border-2 border-blue-100 bg-white px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 flex flex-col gap-5 text-[15px] md:text-base hover:bg-gradient-to-br hover:from-primary hover:to-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 flex-1">
          <b className="text-lg md:text-xl">Convenience:</b>
          <p className="leading-relaxed">
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border-2 border-blue-100 bg-white px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 flex flex-col gap-5 text-[15px] md:text-base hover:bg-gradient-to-br hover:from-primary hover:to-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 flex-1">
          <b className="text-lg md:text-xl">Personalization:</b>
          <p className="leading-relaxed">
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
