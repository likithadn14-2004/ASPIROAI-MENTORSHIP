import React from "react";
import {
  FaUniversity,
  FaPhone,
  FaBook,
  FaGraduationCap,
  FaCodeBranch,
  FaStar,
  FaIdCard,
} from "react-icons/fa";

const StudentDetails = ({ studentData }) => {
  const details = [
    {
      icon: <FaIdCard className="text-blue-400" />,
      label: "USN",
      value: studentData.usn,
    },
    {
      icon: <FaUniversity className="text-purple-400" />,
      label: "College",
      value: studentData.collegeName,
    },
    {
      icon: <FaPhone className="text-green-400" />,
      label: "Phone",
      value: studentData.phone,
    },
    {
      icon: <FaBook className="text-yellow-400" />,
      label: "Semester",
      value: `Semester ${studentData.semester}`,
    },
    {
      icon: <FaGraduationCap className="text-indigo-400" />,
      label: "Year",
      value: studentData.year,
    },
    {
      icon: <FaBook className="text-amber-400" />,
      label: "Course",
      value: studentData.course,
    },
    {
      icon: <FaCodeBranch className="text-red-400" />,
      label: "Department",
      value: studentData.department,
    },
    {
      icon: <FaCodeBranch className="text-teal-400" />,
      label: "Branch",
      value: studentData.branch,
    },
    {
      icon: <FaStar className="text-yellow-400" />,
      label: "CGPA",
      value: studentData.cgpa,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaGraduationCap className="mr-2 text-indigo-400" /> Student Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-center mb-2">
              <div className="text-lg mr-2">{detail.icon}</div>
              <h3 className="text-sm font-medium text-gray-400">
                {detail.label}
              </h3>
            </div>
            <p className="text-white font-medium">{detail.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Member since</span>
          <span className="text-white">
            {new Date(studentData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
