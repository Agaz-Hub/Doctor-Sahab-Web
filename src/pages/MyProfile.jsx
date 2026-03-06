import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateUserProfileData = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append(
        "address",
        JSON.stringify(userData.address || { line1: "", line2: "" })
      );
      formData.append("gender", userData.gender || "Male");
      formData.append("dob", userData.dob || "");

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && loadUserProfileData) {
      loadUserProfileData();
    }
  }, [token]);

  // Show loading state while userData is being fetched
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-12 relative">
          <div className="absolute top-4 right-4">
            {!isEdit && (
              <button
                className="bg-white text-primary px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all shadow-md flex items-center gap-2"
                onClick={() => setIsEdit(true)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer group">
                <div className="relative">
                  <img
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:opacity-90 transition-opacity"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="Profile"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-xs font-medium">Change Photo</span>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                src={userData.image}
                alt="Profile"
              />
            )}

            {/* Name */}
            {isEdit ? (
              <input
                className="bg-white text-3xl font-bold mt-6 px-4 py-2 text-center border-2 border-white focus:border-blue-200 rounded-lg outline-none text-gray-800 max-w-md"
                type="text"
                value={userData.name || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
              />
            ) : (
              <h1 className="text-4xl font-bold text-white mt-6 drop-shadow-md">
                {userData.name || "Not provided"}
              </h1>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8">
          {/* Contact Information */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">
                Contact Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Email
                </label>
                <p className="text-base text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  {userData.email || "Not provided"}
                </p>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Phone
                </label>
                {isEdit ? (
                  <input
                    className="bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all text-gray-800"
                    type="text"
                    value={userData.phone || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-base text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {userData.phone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Address
                </label>
                {isEdit ? (
                  <div className="space-y-3">
                    <input
                      className="bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all text-gray-800"
                      type="text"
                      value={userData.address?.line1 || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...(prev.address || {}),
                            line1: e.target.value,
                          },
                        }))
                      }
                      placeholder="Address Line 1"
                    />
                    <input
                      className="bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all text-gray-800"
                      type="text"
                      value={userData.address?.line2 || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...(prev.address || {}),
                            line2: e.target.value,
                          },
                        }))
                      }
                      placeholder="Address Line 2"
                    />
                  </div>
                ) : (
                  <p className="text-base text-gray-800 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-primary mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {userData.address?.line1 || "Not provided"}
                      {userData.address?.line2 && (
                        <>
                          <br />
                          {userData.address.line2}
                        </>
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">
                Basic Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Gender */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Gender
                </label>
                {isEdit ? (
                  <select
                    className="bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all text-gray-800"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={userData.gender || "Male"}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-base text-gray-800">
                    {userData.gender || "Not specified"}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Date of Birth
                </label>
                {isEdit ? (
                  <input
                    className="bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all text-gray-800"
                    type="date"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    value={userData.dob || ""}
                  />
                ) : (
                  <p className="text-base text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {userData.dob || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEdit && (
            <div className="mt-10 flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
              <button
                className="bg-primary text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                onClick={updateUserProfileData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                className="bg-white text-gray-700 px-10 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all border-2 border-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                onClick={() => {
                  setIsEdit(false);
                  setImage(null);
                  loadUserProfileData();
                }}
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
