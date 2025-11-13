import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          className={`px-4 py-2 rounded-md flex items-center transition-all ${
            role === "Student"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRole("Student")}
        >
          <FaUserGraduate className="mr-2" /> Student
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md flex items-center transition-all ${
            role === "IndustryMentor"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRole("IndustryMentor")}
        >
          <FaBriefcase className="mr-2" /> Industry
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md flex items-center transition-all ${
            role === "CollegeMentor"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRole("CollegeMentor")}
        >
          <FaChalkboardTeacher className="mr-2" /> College
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
