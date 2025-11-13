import React from "react";
import {
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

const MentorDetails = ({ mentorData }) => {
  const details = [
    {
      icon: <FaUserTie className="text-blue-400" />,
      label: "Designation",
      value: mentorData.designation,
    },
    {
      icon: <FaCalendarAlt className="text-purple-400" />,
      label: "Experience",
      value: `${mentorData.yearsOfExperience} ${
        mentorData.yearsOfExperience === 1 ? "year" : "years"
      }`,
    },
    {
      icon: <FaMapMarkerAlt className="text-green-400" />,
      label: "State",
      value: mentorData.state,
    },
    {
      icon: <FaBuilding className="text-amber-400" />,
      label: "Industry",
      value: mentorData.industry || "Not specified",
    },
    {
      icon: <FaBuilding className="text-indigo-400" />,
      label: "Company",
      value: mentorData.company || "Not specified",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaUserTie className="mr-2 text-indigo-400" /> Professional Details
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
    </div>
  );
};

export default MentorDetails;
