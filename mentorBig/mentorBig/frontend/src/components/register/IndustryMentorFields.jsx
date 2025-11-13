import React from "react";
import { FaBriefcase } from "react-icons/fa";

const IndustryMentorFields = ({
  designation,
  setDesignation,
  areaOfExpertise,
  setAreaOfExpertise,
  yearsOfExperience,
  setYearsOfExperience,
  state,
  setState,
}) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
        <FaBriefcase className="mr-2" /> Industry Mentor Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Your current position"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area of Expertise *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Your expertise area"
            value={areaOfExpertise}
            onChange={(e) => setAreaOfExpertise(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience *
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Number of years"
            min="0"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Your state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryMentorFields;
