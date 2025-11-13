import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineSolution,
  AiOutlineContacts,
  AiOutlineMessage,
  AiOutlineRobot,
  AiOutlineBulb,
  AiOutlineFileText,
  AiOutlineLogout,
  AiOutlineUserSwitch,
  AiOutlineSchedule,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { FiBriefcase } from "react-icons/fi";
import { RiUserStarLine } from "react-icons/ri";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderStudentLinks = () => (
    <>
      <Link
        to="/allIndustryMentors"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <FiBriefcase className="mr-1" /> Industry Mentors
      </Link>
      <Link
        to="/allCollegeMentors"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <RiUserStarLine className="mr-1" /> College Mentors
      </Link>
      <Link
        to="/chat"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineMessage className="mr-1" /> Chat
      </Link>
      <Link
        to="/chatbot"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineRobot className="mr-1" /> Chatbot
      </Link>
      <Link
        to="/career"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineBulb className="mr-1" /> Career Guidance
      </Link>
      <Link
        to="/recommendSkills"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineFileText className="mr-1" /> Recommend Skills
      </Link>
      <Link
        to="/ats"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSolution className="mr-1" /> ATS
      </Link>
      <Link
        to="/allTask"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSolution className="mr-1" /> All Tasks
      </Link>
      <Link
        to="/profile"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSolution className="mr-1" /> Profile
      </Link>
    </>
  );

  const renderIndustryMentorLinks = () => (
    <>
      <Link
        to="/ind-chats"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineMessage className="mr-1" /> Chat
      </Link>
      <Link
        to="/indFeedback"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSchedule className="mr-1" /> Profile
      </Link>
    </>
  );

  const renderCollegeMentorLinks = () => (
    <>
      <Link
        to="/addTask"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSchedule className="mr-1" /> Add Task
      </Link>

      <Link
        to="/college-chats"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineMessage className="mr-1" /> Chat
      </Link>
      <Link
        to="/collegeFeedback"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineSchedule className="mr-1" /> Profile
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link
        to="/adminStudents"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineUsergroupAdd className="mr-1" /> Students
      </Link>
      <Link
        to="/adminCollege"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <RiUserStarLine className="mr-1" /> College Mentors
      </Link>
      <Link
        to="/adminIndustry"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <FiBriefcase className="mr-1" /> Industry Mentors
      </Link>
    </>
  );

  const renderAuthLinks = () => {
    if (role) {
      return (
        <>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <AiOutlineLogout className="mr-1" /> Logout
          </button>
        </>
      );
    }
    return (
      <Link
        to="/login"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <AiOutlineUser className="mr-1" /> Login
      </Link>
    );
  };

  const renderRoleLinks = () => {
    switch (role) {
      case "Student":
        return renderStudentLinks();
      case "Industry Mentor":
        return renderIndustryMentorLinks();
      case "College Mentor":
        return renderCollegeMentorLinks();
      case "Admin":
        return renderAdminLinks();
      default:
        return <></>;
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 fixed w-full z-50">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                Aspiro AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {renderRoleLinks()}
              <div className="ml-4 relative">{renderAuthLinks()}</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {renderAuthLinks()}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none ml-4"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          {renderRoleLinks()}
        </div>
      </div>
    </header>
  );
};

export default Header;
