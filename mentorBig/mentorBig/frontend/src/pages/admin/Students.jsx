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
  FiPhone,
  FiBook,
  FiAward,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import Header from "../../components/Header";

const Students = () => {
  const [students, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    course: "",
    badge: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [collegeMentors, setCollegeMentors] = useState([]);
  const [industryMentors, setIndustryMentors] = useState([]);
  const [mentorAction, setMentorAction] = useState({ type: "", mentor: null });

  const getAllStudents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/student/");
      setAllStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMentors = async () => {
    try {
      const [collegeRes, industryRes] = await Promise.all([
        axios.get("http://localhost:5000/collegeMentor/"),
        axios.get("http://localhost:5000/industryMentor/"),
      ]);
      setCollegeMentors(collegeRes.data);
      setIndustryMentors(industryRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStudents();
    getAllMentors();
  }, []);

  useEffect(() => {
    let result = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.usn.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (filters.department === "" ||
          student.department === filters.department) &&
        (filters.semester === "" ||
          student.semester.toString() === filters.semester) &&
        (filters.course === "" || student.course === filters.course) &&
        (filters.badge === "" || student.badge === filters.badge);

      return matchesSearch && matchesFilters;
    });

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

    setFilteredStudents(result);
  }, [students, searchTerm, filters, sortConfig]);

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
      department: "",
      semester: "",
      course: "",
      badge: "",
    });
    setSearchTerm("");
  };

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const openMentorManagement = (student, action, mentor = null) => {
    setSelectedStudent(student);
    setMentorAction({ type: action, mentor });
    setIsMentorModalOpen(true);
  };

  const handleAddMentor = async (mentorId, mentorType) => {
    try {
      await axios.post("http://localhost:5000/student/assign-mentor", {
        studentId: selectedStudent._id,
        mentorId,
        mentorType,
      });

      getAllStudents();
      setIsMentorModalOpen(false);
      alert(`${mentorType} mentor assigned successfully!`);
    } catch (error) {
      console.error("Error adding mentor:", error);
      alert("Failed to assign mentor. Please try again.");
    }
  };

  const handleRemoveMentor = async (mentorId, mentorType) => {
    try {
      await axios.post("http://localhost:5000/student/remove-mentor", {
        studentId: selectedStudent._id,
        mentorId,
        mentorType,
      });

      getAllStudents();
      setIsMentorModalOpen(false);
      alert(`${mentorType} mentor removed successfully!`);
    } catch (error) {
      console.error("Error removing mentor:", error);
      alert("Failed to remove mentor. Please try again.");
    }
  };

  const departments = [
    ...new Set(students.map((student) => student.department)),
  ];
  const semesters = [...new Set(students.map((student) => student.semester))];
  const courses = [...new Set(students.map((student) => student.course))];
  const badges = [...new Set(students.map((student) => student.badge))];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Students Management
        </h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or USN..."
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
                className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.semester}
                    onChange={(e) =>
                      handleFilterChange("semester", e.target.value)
                    }
                  >
                    <option value="">All Semesters</option>
                    {semesters.sort().map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.course}
                    onChange={(e) =>
                      handleFilterChange("course", e.target.value)
                    }
                  >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filters.badge}
                    onChange={(e) =>
                      handleFilterChange("badge", e.target.value)
                    }
                  >
                    <option value="">All Badges</option>
                    {badges.map((badge) => (
                      <option key={badge} value={badge}>
                        {badge}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 flex justify-end">
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
                      Student
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
                    Academic Info
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("cgpa")}
                  >
                    <div className="flex items-center">
                      CGPA
                      {sortConfig.key === "cgpa" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <motion.tr
                      key={student._id}
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
                              src={student.profilePhoto}
                              alt={student.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.usn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.course} - {student.department}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sem {student.semester}, {student.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.cgpa}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.badge} Badge
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openStudentDetails(student)}
                          className="flex items-center text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEye className="mr-1" /> View
                        </button>
                        <button
                          onClick={() =>
                            openMentorManagement(student, "manage")
                          }
                          className="flex items-center text-green-600 hover:text-green-900"
                        >
                          <FiUsers className="mr-1" /> Manage Mentors
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && selectedStudent && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-center justify-center min-h-screen backdrop-blur-sm pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div className="absolute inset-0  opacity-75"></div>
                </motion.div> */}

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
                            Student Details
                          </h3>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiX size={24} />
                          </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="col-span-1">
                            <div className="flex flex-col items-center">
                              <img
                                src={selectedStudent.profilePhoto}
                                alt={selectedStudent.name}
                                className="h-32 w-32 rounded-full object-cover mb-4"
                              />
                              <h4 className="text-xl font-semibold">
                                {selectedStudent.name}
                              </h4>
                              <p className="text-gray-500">
                                {selectedStudent.usn}
                              </p>

                              <div className="mt-4 w-full">
                                <div className="flex items-center mt-2">
                                  <FiMail className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedStudent.email}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <FiPhone className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedStudent.phone}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <FiMapPin className="text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {selectedStudent.collegeName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Academic Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Course</p>
                                <p className="font-medium">
                                  {selectedStudent.course}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Department
                                </p>
                                <p className="font-medium">
                                  {selectedStudent.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Semester
                                </p>
                                <p className="font-medium">
                                  {selectedStudent.semester}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Year</p>
                                <p className="font-medium">
                                  {selectedStudent.year}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">CGPA</p>
                                <p className="font-medium">
                                  {selectedStudent.cgpa}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Badge</p>
                                <p className="font-medium">
                                  {selectedStudent.badge}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Mentors
                            </h4>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">
                                  College Mentors
                                </h5>
                                <button
                                  onClick={() =>
                                    openMentorManagement(
                                      selectedStudent,
                                      "add",
                                      "college"
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                              {selectedStudent.collegeMentor &&
                              selectedStudent.collegeMentor.length > 0 ? (
                                selectedStudent.collegeMentor.map((mentor) => (
                                  <div
                                    key={mentor._id}
                                    className="bg-gray-50 p-3 rounded-lg mb-2 flex justify-between items-center"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={mentor.profilePhoto}
                                        alt={mentor.name}
                                        className="h-8 w-8 rounded-full mr-2"
                                      />
                                      <div>
                                        <p className="text-sm font-medium">
                                          {mentor.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {mentor.areaOfExpertise}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        openMentorManagement(
                                          selectedStudent,
                                          "remove",
                                          mentor
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No college mentors assigned
                                </p>
                              )}
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Industry Mentors
                                </h5>
                                <button
                                  onClick={() =>
                                    openMentorManagement(
                                      selectedStudent,
                                      "add",
                                      "industry"
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                              {selectedStudent.industryMentor &&
                              selectedStudent.industryMentor.length > 0 ? (
                                selectedStudent.industryMentor.map((mentor) => (
                                  <div
                                    key={mentor._id}
                                    className="bg-gray-50 p-3 rounded-lg mb-2 flex justify-between items-center"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={mentor.profilePhoto}
                                        alt={mentor.name}
                                        className="h-8 w-8 rounded-full mr-2"
                                      />
                                      <div>
                                        <p className="text-sm font-medium">
                                          {mentor.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {mentor.designation} at{" "}
                                          {mentor.company}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        openMentorManagement(
                                          selectedStudent,
                                          "remove",
                                          mentor
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No industry mentors assigned
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Tasks
                            </h4>
                            {selectedStudent.tasks &&
                            selectedStudent.tasks.length > 0 ? (
                              <div className="space-y-3">
                                {selectedStudent.tasks.map((task, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 p-3 rounded-lg"
                                  >
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm font-medium">
                                        Task {index + 1}
                                      </p>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          task.status === "Completed"
                                            ? "bg-green-100 text-green-800"
                                            : task.status === "In Progress"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {task.status}
                                      </span>
                                    </div>
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
                            <h4 className="text-lg font-medium mb-4 border-b pb-2">
                              Feedback
                            </h4>
                            {selectedStudent.feedBack &&
                            selectedStudent.feedBack.length > 0 ? (
                              <div className="space-y-3">
                                {selectedStudent.feedBack.map(
                                  (feedback, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-50 p-3 rounded-lg"
                                    >
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium">
                                          {feedback.by}
                                        </p>
                                        {feedback.rating && (
                                          <div className="flex items-center">
                                            <FiStar className="text-yellow-400 mr-1" />
                                            <span className="text-sm">
                                              {feedback.rating}/5
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm mt-1">
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
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMentorModalOpen && selectedStudent && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-center justify-center min-h-screen backdrop-blur-sm pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={() => setIsMentorModalOpen(false)}
                >
                  <div className="absolute inset-0  opacity-75"></div>
                </motion.div> */}

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl leading-6 font-medium text-gray-900">
                            {mentorAction.type === "add"
                              ? "Add Mentor"
                              : mentorAction.type === "remove"
                              ? "Remove Mentor"
                              : "Manage Mentors"}{" "}
                            - {selectedStudent.name}
                          </h3>
                          <button
                            onClick={() => setIsMentorModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiX size={24} />
                          </button>
                        </div>

                        {mentorAction.type === "remove" &&
                          mentorAction.mentor && (
                            <div className="mt-6 p-4 bg-red-50 rounded-lg">
                              <h4 className="text-lg font-medium text-red-800 mb-2">
                                Remove Mentor
                              </h4>
                              <div className="flex items-center mb-4">
                                <img
                                  src={mentorAction.mentor.profilePhoto}
                                  alt={mentorAction.mentor.name}
                                  className="h-12 w-12 rounded-full mr-3"
                                />
                                <div>
                                  <p className="font-medium">
                                    {mentorAction.mentor.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {mentorAction.mentor.designation ||
                                      mentorAction.mentor.areaOfExpertise}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveMentor(
                                    mentorAction.mentor._id,
                                    mentorAction.mentor.designation
                                      ? "industry"
                                      : "college"
                                  )
                                }
                                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm Removal
                              </button>
                            </div>
                          )}

                        {mentorAction.type === "add" && (
                          <div className="mt-6">
                            <h4 className="text-lg font-medium mb-4">
                              Add{" "}
                              {mentorAction.mentor === "college"
                                ? "College"
                                : "Industry"}{" "}
                              Mentor
                            </h4>
                            <div className="grid gap-4 max-h-96 overflow-y-auto">
                              {(mentorAction.mentor === "college"
                                ? collegeMentors
                                : industryMentors
                              )
                                .filter((mentor) =>
                                  mentorAction.mentor === "college"
                                    ? !selectedStudent.collegeMentor?.some(
                                        (m) => m._id === mentor._id
                                      )
                                    : !selectedStudent.industryMentor?.some(
                                        (m) => m._id === mentor._id
                                      )
                                )
                                .map((mentor) => (
                                  <div
                                    key={mentor._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={mentor.profilePhoto}
                                        alt={mentor.name}
                                        className="h-10 w-10 rounded-full mr-3"
                                      />
                                      <div>
                                        <p className="font-medium">
                                          {mentor.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {mentor.designation ||
                                            mentor.areaOfExpertise}
                                          {mentor.company &&
                                            ` at ${mentor.company}`}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleAddMentor(
                                          mentor._id,
                                          mentorAction.mentor
                                        )
                                      }
                                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      Add
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {mentorAction.type === "manage" && (
                          <div className="mt-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div
                                onClick={() =>
                                  openMentorManagement(
                                    selectedStudent,
                                    "add",
                                    "college"
                                  )
                                }
                                className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center cursor-pointer hover:bg-blue-50 transition-colors"
                              >
                                <FiUsers
                                  className="mx-auto text-blue-600 mb-2"
                                  size={24}
                                />
                                <h4 className="font-medium text-blue-800">
                                  Add College Mentor
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Assign academic guidance
                                </p>
                              </div>

                              <div
                                onClick={() =>
                                  openMentorManagement(
                                    selectedStudent,
                                    "add",
                                    "industry"
                                  )
                                }
                                className="p-4 border-2 border-dashed border-green-300 rounded-lg text-center cursor-pointer hover:bg-green-50 transition-colors"
                              >
                                <FiUsers
                                  className="mx-auto text-green-600 mb-2"
                                  size={24}
                                />
                                <h4 className="font-medium text-green-800">
                                  Add Industry Mentor
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Assign professional guidance
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
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

export default Students;
