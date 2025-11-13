import React from "react";
import { FaMedal } from "react-icons/fa";

const BadgeSection = ({ studentData }) => {
  const getBadgeImage = () => {
    if (!studentData?.badge) return null;

    switch (studentData.badge.toLowerCase()) {
      case "golden":
        return "🥇";
      case "silver":
        return "🥈";
      case "bronze":
        return "🥉";
      default:
        return "🏆";
    }
  };

  const getBadgeDescription = () => {
    switch (studentData.badge) {
      case "Golden":
        return "Congratulations! You've completed all your tasks with excellence.";
      case "Silver":
        return "Great job! You've completed more than half of your tasks.";
      case "Bronze":
        return "Good start! Keep completing more tasks to upgrade your badge.";
      default:
        return "You've earned this badge for your achievements.";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <FaMedal className="text-indigo-400 text-xl mr-2" />
        <h2 className="text-xl font-semibold text-white">Your Achievement</h2>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="text-6xl mb-2">{getBadgeImage()}</div>
          <div className="absolute inset-0 rounded-full shadow-lg bg-gradient-to-br from-yellow-400 to-amber-500 animate-pulse opacity-25 blur-md"></div>
        </div>

        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-1">
          {studentData.badge} Badge
        </h3>

        <p className="text-gray-300 max-w-md mb-4">{getBadgeDescription()}</p>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${
              studentData.badge === "Golden"
                ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                : studentData.badge === "Silver"
                ? "bg-gradient-to-r from-gray-400 to-slate-400"
                : "bg-gradient-to-r from-amber-700 to-orange-700"
            }`}
            style={{
              width:
                studentData.badge === "Golden"
                  ? "100%"
                  : studentData.badge === "Silver"
                  ? "75%"
                  : "50%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BadgeSection;
