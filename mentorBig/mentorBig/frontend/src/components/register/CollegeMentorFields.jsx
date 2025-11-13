import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";

const CollegeMentorFields = ({
  collegeMentorCollegeName,
  setCollegeMentorCollegeName,
  collegeMentorAreaOfExpertise,
  setCollegeMentorAreaOfExpertise,
  collegeMentorYearsOfExperience,
  setCollegeMentorYearsOfExperience,
}) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
        <FaChalkboardTeacher className="mr-2" /> College Mentor Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Enter college name"
            value={collegeMentorCollegeName}
            onChange={(e) => setCollegeMentorCollegeName(e.target.value)}
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
            value={collegeMentorAreaOfExpertise}
            onChange={(e) => setCollegeMentorAreaOfExpertise(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Number of years"
          min="0"
          value={collegeMentorYearsOfExperience}
          onChange={(e) => setCollegeMentorYearsOfExperience(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default CollegeMentorFields;
