import React from "react";
import { FaChartLine, FaRegCalendarCheck } from "react-icons/fa";

const AttendanceStats = ({ studentData }) => {
  const calculateAttendanceStats = () => {
    if (!studentData?.attendance) return {};

    const stats = {
      total: studentData.attendance.length,
      present: 0,
      late: 0,
      halfDay: 0,
      absent: 0,
    };

    studentData.attendance.forEach((record) => {
      if (record.status === "Present") stats.present++;
      else if (record.status === "Late") stats.late++;
      else if (record.status === "Half Day") stats.halfDay++;
      else if (record.status === "Absent") stats.absent++;
    });

    return stats;
  };

  const attendanceStats = calculateAttendanceStats();
  const presentPercentage =
    attendanceStats.total > 0
      ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
      : 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <FaChartLine className="text-indigo-400 text-xl mr-2" />
        <h2 className="text-xl font-semibold text-white">Attendance Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm">Total Days</h3>
            <FaRegCalendarCheck className="text-indigo-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-white">
            {attendanceStats.total || 0}
          </p>
        </div>

        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm">Present</h3>
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">
            {attendanceStats.present || 0}
          </p>
          {attendanceStats.total > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {presentPercentage}% of total
            </p>
          )}
        </div>

        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm">Late Arrivals</h3>
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">
            {attendanceStats.late || 0}
          </p>
          {attendanceStats.total > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.round((attendanceStats.late / attendanceStats.total) * 100)}
              % of total
            </p>
          )}
        </div>

        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm">Half Days</h3>
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">
            {attendanceStats.halfDay || 0}
          </p>
          {attendanceStats.total > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.round(
                (attendanceStats.halfDay / attendanceStats.total) * 100
              )}
              % of total
            </p>
          )}
        </div>
      </div>

      {/* Attendance Progress Bar */}
      {attendanceStats.total > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Attendance Rate</span>
            <span>{presentPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500"
              style={{ width: `${presentPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;
