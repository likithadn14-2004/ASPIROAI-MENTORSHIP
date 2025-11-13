import React from "react";
import { FaCalendarAlt, FaClock, FaExclamationCircle } from "react-icons/fa";

const AttendanceRecords = ({ studentData }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <FaCalendarAlt className="text-indigo-400 text-xl mr-2" />
        <h2 className="text-xl font-semibold text-white">Attendance Records</h2>
      </div>

      {studentData.attendance?.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {studentData.attendance
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((record, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                  record.status === "Present"
                    ? "border-green-900 bg-gray-750 hover:border-green-700"
                    : record.status === "Late"
                    ? "border-yellow-900 bg-gray-750 hover:border-yellow-700"
                    : record.status === "Half Day"
                    ? "border-blue-900 bg-gray-750 hover:border-blue-700"
                    : "border-red-900 bg-gray-750 hover:border-red-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        record.status === "Present"
                          ? "bg-green-500"
                          : record.status === "Late"
                          ? "bg-yellow-500"
                          : record.status === "Half Day"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <h3 className="font-medium capitalize text-white">
                        {record.status}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center">
                        <FaClock className="mr-1" />
                        {new Date(record.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaExclamationCircle className="mx-auto text-4xl text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-400">
            No attendance records yet
          </h3>
          <p className="text-gray-500">
            Mark your attendance to see records here
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
