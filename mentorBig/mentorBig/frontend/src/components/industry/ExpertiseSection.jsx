import React from "react";
import { FaCode, FaLightbulb } from "react-icons/fa";

const ExpertiseSection = ({ mentorData }) => {
  const expertiseAreas = mentorData.areaOfExpertise
    ? mentorData.areaOfExpertise.split(",").map((item) => item.trim())
    : [];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaCode className="mr-2 text-indigo-400" /> Areas of Expertise
      </h2>

      {expertiseAreas.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {expertiseAreas.map((expertise, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-200 px-4 py-2 rounded-full text-sm font-medium flex items-center"
            >
              <FaLightbulb className="mr-2 text-yellow-300" />
              {expertise}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <FaCode className="mx-auto text-4xl text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-400">
            No expertise areas listed
          </h3>
          <p className="text-gray-500">
            Update your profile to add your areas of expertise
          </p>
        </div>
      )}

      {/* Experience Progress */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Years of Experience</span>
          <span>{mentorData.yearsOfExperience} years</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{
              width: `${Math.min(mentorData.yearsOfExperience * 10, 100)}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>10+</span>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseSection;
