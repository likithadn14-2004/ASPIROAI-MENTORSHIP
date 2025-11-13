import React from "react";
import { MdEmail, MdWork, MdLocationOn } from "react-icons/md";
import { FaUserTie, FaAward } from "react-icons/fa";

const MentorProfileHeader = ({ mentorData }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex flex-col items-center">
        {/* Profile Photo */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-4 border-indigo-500/30 overflow-hidden">
            {mentorData.profilePhoto ? (
              <img
                src={mentorData.profilePhoto}
                alt={mentorData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUserTie className="text-indigo-200 text-5xl" />
            )}
          </div>

          {/* Verified Badge */}
          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full border-2 border-gray-900">
            <FaAward className="text-sm" />
          </div>
        </div>

        {/* Name and Role */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">
            {mentorData.name}
          </h1>
          <div className="inline-block bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-200 text-sm px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
            {mentorData.role}
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-full space-y-3">
          <div className="flex items-center p-3 bg-gray-750 rounded-lg border border-gray-700">
            <MdEmail className="text-indigo-400 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white text-sm font-medium">
                {mentorData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-750 rounded-lg border border-gray-700">
            <MdWork className="text-indigo-400 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-400">Designation</p>
              <p className="text-white text-sm font-medium">
                {mentorData.designation}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-750 rounded-lg border border-gray-700">
            <MdLocationOn className="text-indigo-400 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white text-sm font-medium">
                {mentorData.state}
              </p>
            </div>
          </div>
        </div>

        {/* Join Date */}
        <div className="w-full mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Member since</span>
            <span className="text-white">
              {new Date(mentorData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileHeader;
