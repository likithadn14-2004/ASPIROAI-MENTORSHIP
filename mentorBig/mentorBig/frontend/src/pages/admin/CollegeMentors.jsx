import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiUsers,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Header from "../../components/Header";

const CollegeMentors = () => {
  const [mentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    collegeName: "",
    areaOfExpertise: "",
    yearsOfExperience: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showFilters, setShowFilters] = useState(false);

  const getALLMentors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/collegeMentor/");
      setAllMentors(data);
      setFilteredMentors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLMentors();
  }, []);

  // Filter and search mentors
  useEffect(() => {
    let result = mentors.filter((mentor) => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.areaOfExpertise.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (filters.collegeName === "" ||
          mentor.collegeName === filters.collegeName) &&
        (filters.areaOfExpertise === "" ||
          mentor.areaOfExpertise === filters.areaOfExpertise) &&
        (filters.yearsOfExperience === "" ||
          mentor.yearsOfExperience.toString() === filters.yearsOfExperience);

      return matchesSearch && matchesFilters;
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredMentors(result);
  }, [mentors, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      collegeName: "",
      areaOfExpertise: "",
      yearsOfExperience: "",
    });
    setSearchTerm("");
  };

  const openMentorDetails = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  // Get unique values for filter dropdowns
  const collegeNames = [
    ...new Set(mentors.map((mentor) => mentor.collegeName)),
  ];
  const areasOfExpertise = [
    ...new Set(mentors.map((mentor) => mentor.areaOfExpertise)),
  ];
  const yearsOfExperience = [
    ...new Set(mentors.map((mentor) => mentor.yearsOfExperience)),
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          College Mentors Management
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or area of expertise..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FiFilter /> Filters{" "}
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.collegeName}
                    onChange={(e) =>
                      handleFilterChange("collegeName", e.target.value)
                    }
                  >
                    <option value="">All Colleges</option>
                    {collegeNames.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area of Expertise
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.areaOfExpertise}
                    onChange={(e) =>
                      handleFilterChange("areaOfExpertise", e.target.value)
                    }
                  >
                    <option value="">All Areas</option>
                    {areasOfExpertise.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.yearsOfExperience}
                    onChange={(e) =>
                      handleFilterChange("yearsOfExperience", e.target.value)
                    }
                  >
                    <option value="">All Experience Levels</option>
                    {yearsOfExperience.sort().map((year) => (
                      <option key={year} value={year}>
                        {year} years
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mentors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Mentor
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("yearsOfExperience")}
                  >
                    <div className="flex items-center">
                      Experience
                      {sortConfig.key === "yearsOfExperience" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <motion.tr
                      key={mentor._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={mentor.profilePhoto}
                              alt={mentor.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {mentor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {mentor.collegeName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mentor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mentor.areaOfExpertise}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mentor.yearsOfExperience} years
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUsers className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {mentor.accepted.length}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            students
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openMentorDetails(mentor)}
                          className="flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="mr-1" /> View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No mentors found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mentor Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedMentor && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-center justify-center backdrop-blur-sm min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div className="absolute inset-0 opacity-75"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl leading-6 font-medium text-gray-900">
                            Mentor Details
                          </h3>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiX size={24} />
                          </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Basic Info */}
                          <div className="col-span-1">
                            <div className="flex flex-col items-center">
                              <img
                                src={selectedMentor.profilePhoto}
                                alt={selectedMentor.name}
                                className="h-32 w-32 rounded-full object-cover mb-4"
                              />
                              <h4 className="text-xl font-semibold">
                                {selectedMentor.name}
                              </h4>
                              <p className="text-gray-500">
                                {selectedMentor.collegeName}
                              </p>

                              <div className="mt-4 w-full">
                                <div className="flex items-center mt-2">
                                  <FiMail className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedMentor.email}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <FiBook className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedMentor.areaOfExpertise}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <FiAward className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedMentor.yearsOfExperience} years of
                                    experience
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Students Info */}
                          <div className="col-span-1">
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Students
                            </h4>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Assigned Students
                                </h5>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {selectedMentor.accepted.length} students
                                </span>
                              </div>
                              {selectedMentor.accepted &&
                              selectedMentor.accepted.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedMentor.accepted.map(
                                    (studentId, index) => (
                                      <div
                                        key={index}
                                        className="bg-gray-50 p-2 rounded-lg"
                                      >
                                        <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                            <FiUser className="text-gray-600" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">
                                              Student {index + 1}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                             Name: {studentId.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No students assigned yet
                                </p>
                              )}
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Pending Requests
                                </h5>
                                {selectedMentor.requests &&
                                  selectedMentor.requests.length > 0 && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                      {selectedMentor.requests.length} requests
                                    </span>
                                  )}
                              </div>
                              {selectedMentor.requests &&
                              selectedMentor.requests.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedMentor.requests.map(
                                    (requestId, index) => (
                                      <div
                                        key={index}
                                        className="bg-yellow-50 p-2 rounded-lg"
                                      >
                                        <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center mr-2">
                                            <FiClock className="text-yellow-600" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">
                                              Request {index + 1}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              ID: {requestId.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No pending requests
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Tasks and Feedback */}
                          <div className="col-span-1">
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Tasks & Feedback
                            </h4>

                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                Assigned Tasks
                              </h5>
                              {selectedMentor.tasks &&
                              selectedMentor.tasks.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedMentor.tasks.map((task, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-50 p-2 rounded-lg"
                                    >
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium">
                                          {task.title || `Task ${index + 1}`}
                                        </p>
                                        <FiCheckCircle className="text-green-500" />
                                      </div>
                                      {task.description && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          {task.description.substring(0, 50)}...
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No tasks assigned
                                </p>
                              )}
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                Feedback Received
                              </h5>
                              {selectedMentor.feedBack &&
                              selectedMentor.feedBack.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedMentor.feedBack.map(
                                    (feedback, index) => (
                                      <div
                                        key={index}
                                        className="bg-blue-50 p-2 rounded-lg"
                                      >
                                        <div className="flex justify-between items-center">
                                          <p className="text-sm font-medium">
                                            {feedback.by}
                                          </p>
                                          <FiMessageSquare className="text-blue-500" />
                                        </div>
                                        <p className="text-xs text-gray-700 mt-1">
                                          {feedback.feedback}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No feedback yet
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CollegeMentors;
