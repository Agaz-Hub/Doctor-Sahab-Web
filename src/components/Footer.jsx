import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="mt-20 md:mt-24">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 md:gap-14 my-10 mt-20 md:mt-32 text-sm md:text-base bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 md:p-12 rounded-2xl">
        {/* ------ Left Section ------ */}
        <div className="max-w-md">
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full text-gray-600 leading-relaxed">
            Doctor Sahab is your trusted healthcare companion, connecting you
            with qualified medical professionals across various specialties. We
            are committed to making quality healthcare accessible, convenient,
            and reliable for everyone.
          </p>
        </div>

        {/* ------ Center Section ------ */}
        <div>
          <p className="text-lg md:text-xl font-bold mb-5 text-gray-900">
            COMPANY
          </p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li className="hover:text-primary cursor-pointer transition-colors">
              Home
            </li>
            <li className="hover:text-primary cursor-pointer transition-colors">
              About
            </li>
            <li className="hover:text-primary cursor-pointer transition-colors">
              Contact us
            </li>
            <li className="hover:text-primary cursor-pointer transition-colors">
              Privacy policy
            </li>
          </ul>
        </div>

        {/* ------ Right Section ------ */}
        <div>
          <p className="text-lg md:text-xl font-bold mb-5 text-gray-900">
            GET IN TOUCH
          </p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li className="hover:text-primary cursor-pointer transition-colors">
              +91 (11) 4567-8900
            </li>
            <li className="hover:text-primary cursor-pointer transition-colors">
              contact@doctorsahab.com
            </li>
          </ul>
        </div>
      </div>

      {/* ------- Copyright Text ------- */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-6 text-sm md:text-base text-center text-gray-600">
          Copyright © 2024 Doctor Sahab - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
