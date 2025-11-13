import React from "react";
import { FaUser, FaCalendarAlt, FaCamera } from "react-icons/fa";

const ProfileHeader = ({
  studentData,
  setShowAttendanceModal,
  setShowFaceAttendanceModal,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex flex-col items-center mt-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-4 border-indigo-500/30">
            {studentData.profilePhoto ? (
              <img
                src={studentData.profilePhoto}
                alt={studentData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-indigo-200 text-5xl" />
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            {studentData.name}
          </h1>
          <p className="text-gray-400 mb-4">{studentData.email}</p>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="inline-block bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-200 text-xs px-3 py-1.5 rounded-full uppercase font-semibold tracking-wide">
              {studentData.role}
            </span>
            {studentData.badge && (
              <span
                className={`inline-flex items-center ${
                  studentData.badge === "Golden"
                    ? "bg-gradient-to-r from-yellow-700 to-amber-700 text-amber-200"
                    : studentData.badge === "Silver"
                    ? "bg-gradient-to-r from-gray-700 to-slate-700 text-gray-200"
                    : "bg-gradient-to-r from-amber-800 to-orange-800 text-amber-200"
                } text-xs px-3 py-1.5 rounded-full uppercase font-semibold tracking-wide`}
              >
                🏆 {studentData.badge} Badge
              </span>
            )}
          </div>

          <button
            onClick={() => setShowFaceAttendanceModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <FaCamera className="mr-2" /> Mark Attendance with Face
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
