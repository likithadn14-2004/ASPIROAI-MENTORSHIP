import React from "react";
import { FaStar, FaUsers, FaChartLine, FaThumbsUp } from "react-icons/fa";

const StatsSection = ({ mentorData }) => {
  const stats = [
    {
      icon: <FaUsers className="text-blue-400" />,
      label: "Students Mentored",
      value: "25+",
      description: "Across various programs",
    },
    {
      icon: <FaStar className="text-yellow-400" />,
      label: "Rating",
      value: "4.8/5",
      description: "Based on student feedback",
    },
    {
      icon: <FaChartLine className="text-green-400" />,
      label: "Success Rate",
      value: "92%",
      description: "Student satisfaction score",
    },
    {
      icon: <FaThumbsUp className="text-indigo-400" />,
      label: "Recommendations",
      value: "18",
      description: "From industry peers",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaChartLine className="mr-2 text-indigo-400" /> Mentorship Stats
      </h2>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-lg mr-3">{stat.icon}</div>
                <h3 className="text-sm font-medium text-gray-400">
                  {stat.label}
                </h3>
              </div>
              <span className="text-white font-bold text-lg">{stat.value}</span>
            </div>
            <p className="text-xs text-gray-500 ml-8">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Availability Status */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Current Availability</span>
          <span className="bg-green-700 text-green-200 text-xs px-2 py-1 rounded-full">
            Accepting Students
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
