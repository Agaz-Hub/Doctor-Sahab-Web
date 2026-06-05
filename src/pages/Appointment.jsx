import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    userData,
  } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const upcomingDaysCount = 7;

  const navigation = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [shiftAvailability, setShiftAvailability] = useState({});
  const [dateShiftAvailability, setDateShiftAvailability] = useState({});
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const buildUpcomingDates = (daysCount = upcomingDaysCount) => {
    const today = new Date();
    return Array.from({ length: daysCount }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const dateKey = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      return { date, dateKey };
    });
  };

  const isPastDateKey = (dateKey) => {
    if (!dateKey) return false;
    const [day, month, year] = dateKey.split("_").map(Number);
    if (!day || !month || !year) return false;
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const fetchShiftAvailability = async (dateKey) => {
    if (!docId || !dateKey) return;
    setIsLoadingShifts(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctors/${docId}/slots`,
        { params: { date: dateKey } },
      );

      if (data.success) {
        const mapped = (data.shifts || []).reduce((acc, shift) => {
          acc[shift.id] = shift;
          return acc;
        }, {});
        setShiftAvailability(mapped);
        setDateShiftAvailability((prev) => ({
          ...prev,
          [dateKey]: mapped,
        }));
      } else {
        setShiftAvailability({});
        toast.error(data.message || "Failed to load shift availability");
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShiftAvailability({});
      toast.error(
        error.response?.data?.message ||
          "Error fetching shift availability. Please try again.",
      );
    } finally {
      setIsLoadingShifts(false);
    }
  };

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
    setSelectedShift("");

    const cached = dateShiftAvailability[dateKey];
    if (cached) {
      setShiftAvailability(cached);
      return;
    }

    fetchShiftAvailability(dateKey);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("You need to be logged in to book an appointment");
      return navigation("/login");
    }

    if (!selectedDate) {
      return toast.error("Please select a date for the appointment");
    }

    if (!selectedShift) {
      return toast.error("Please select a shift for the appointment");
    }

    if (shiftAvailability[selectedShift]?.isFull) {
      return toast.error("Selected shift is full. Please choose another.");
    }

    const ageNumber = Number(patientAge);
    if (
      !patientName.trim() ||
      !patientAge.trim() ||
      Number.isNaN(ageNumber) ||
      ageNumber <= 0 ||
      !symptoms.trim()
    ) {
      return toast.error("Please enter patient name, age, and symptoms");
    }

    try {
      setIsBooking(true);
      const { data } = await axios.post(
        backendUrl + "/api/users/me/appointments",
        {
          docId,
          slotDate: selectedDate,
          shiftId: selectedShift,
          patientName: patientName.trim(),
          patientAge: ageNumber,
          symptoms: symptoms.trim(),
        },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        getDoctorsData();
        navigation("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Error booking appointment. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (!docInfo) return;
    const dates = buildUpcomingDates();
    setUpcomingDates(dates);
    if (!selectedDate && dates[0]) {
      setSelectedDate(dates[0].dateKey);
    }
  }, [docInfo]);

  useEffect(() => {
    if (!docInfo || !selectedDate) return;

    const cached = dateShiftAvailability[selectedDate];
    if (cached) {
      setShiftAvailability(cached);
      return;
    }

    fetchShiftAvailability(selectedDate);
  }, [docInfo, selectedDate]);

  useEffect(() => {
    if (userData?.name && !patientName) {
      setPatientName(userData.name);
    }
  }, [userData, patientName]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center text-gray-900 text-2xl gap-2 font-medium">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center text-gray-600 mt-1 text-sm gap-2">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm text-gray-900 font-medium mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 mt-1 max-w-[700px]">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment Fees:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ----- Booking slots ------ */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {upcomingDates.length > 0 &&
              upcomingDates.map((item, index) => (
                <div
                  onClick={() => handleDateSelect(item.dateKey)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    selectedDate === item.dateKey
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{daysOfWeek[item.date.getDay()]}</p>
                  <p>{item.date.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-600">Select a shift</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {(docInfo.shifts || []).map((shift) => {
                const availability = shiftAvailability[shift.id];
                const isFull = availability?.isFull;
                const isDisabled =
                  !selectedDate || isFull || isPastDateKey(selectedDate);

                return (
                  <button
                    key={shift.id}
                    onClick={() => setSelectedShift(shift.id)}
                    disabled={isDisabled}
                    className={`border rounded-xl px-4 py-3 text-left min-w-[180px] transition-all ${
                      selectedShift === shift.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-200"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}`}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {shift.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    {isFull ? (
                      <p className="text-xs text-red-500 mt-1">Full</p>
                    ) : availability?.nextSlotTimeLabel ? (
                      <p className="text-xs text-green-600 mt-1">
                        Next: {availability.nextSlotTimeLabel}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {isLoadingShifts && (
              <p className="text-xs text-gray-500 mt-2">Loading shifts...</p>
            )}
          </div>

          <div className="mt-6 max-w-xl">
            <p className="text-sm text-gray-600">Patient details</p>
            <div className="grid gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Patient Name</p>
                <input
                  className="border border-gray-300 rounded w-full p-2 text-sm"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Patient Age</p>
                <input
                  className="border border-gray-300 rounded w-full p-2 text-sm"
                  type="number"
                  min="1"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Symptoms</p>
                <textarea
                  className="border border-gray-300 rounded w-full p-2 text-sm"
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe symptoms"
                />
              </div>
            </div>
          </div>

          <button
            onClick={bookAppointment}
            disabled={isBooking}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 disabled:opacity-60"
          >
            {isBooking ? "Booking..." : "Book an appointment"}
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
