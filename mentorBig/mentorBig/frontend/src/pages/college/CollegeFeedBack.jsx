import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserGraduate,
  FaQuoteLeft,
  FaStar,
  FaRegStar,
  FaUniversity,
  FaLaptopCode,
  FaBusinessTime,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const CollegeFeedBack = () => {
  const mentor = JSON.parse(localStorage.getItem("user"));
  const mentorId = mentor?._id;
  const [mentorData, setMentorData] = useState(null);
  const [feedbacks, setAllFeedbacks] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    feedback: "",
    rating: 0,
  });

  const getSingleMentor = async () => {
    const id = mentorId;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/collegeMentor/${id}`
      );
      setMentorData(data);
      setAllFeedbacks(data?.feedBack || []);
      setAcceptedStudents(data?.accepted || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleMentor();
  }, []);

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 inline" />
        ) : (
          <FaRegStar key={i} className="text-gray-400 inline" />
        )
      );
    }
    return stars;
  };

  const handleStarClick = (rating) => {
    setFeedbackForm({ ...feedbackForm, rating });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.feedback.trim() || feedbackForm.rating === 0) {
      toast.error("Please provide both feedback and rating");
      return;
    }

    try {
      const feedbackData = {
        studentId: selectedStudent._id,
        by: "College Mentor", 
        mentor: mentorData.name, // College mentor's name
        feedback: feedbackForm.feedback,
        rating: feedbackForm.rating,
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/student/addFeedback",
        feedbackData,
        {
          headers: { Authorization: token },
        }
      );

      if (res.data) {
        toast.success("Feedback submitted successfully");
        setFeedbackForm({ feedback: "", rating: 0 });
        setShowFeedbackForm(false);
        setSelectedStudent(null);
        getSingleMentor(); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const openFeedbackForm = (student) => {
    setSelectedStudent(student);
    setShowFeedbackForm(true);
  };

  const closeFeedbackForm = () => {
    setShowFeedbackForm(false);
    setSelectedStudent(null);
    setFeedbackForm({ feedback: "", rating: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {mentorData && (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 mt-[40px]">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                {mentorData.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{mentorData.name}</h1>

                {/* College Name */}
                <div className="flex items-center mt-2 text-indigo-300">
                  <FaUniversity className="mr-2" />
                  <span>{mentorData.collegeName}</span>
                </div>

                {/* Email */}
                <div className="flex items-center mt-1 text-indigo-300">
                  <MdEmail className="mr-2" />
                  <span>{mentorData.email}</span>
                </div>

                {/* Area of Expertise */}
                <div className="flex items-center mt-1 text-indigo-300">
                  <FaLaptopCode className="mr-2" />
                  <span>Expertise: {mentorData.areaOfExpertise}</span>
                </div>

                {/* Years of Experience */}
                <div className="flex items-center mt-1 text-indigo-300">
                  <FaBusinessTime className="mr-2" />
                  <span>
                    {mentorData.yearsOfExperience} years of experience
                  </span>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="mt-4 md:mt-0">
                <img
                  src={mentorData.profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Accepted Students Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-300 border-b border-indigo-600 pb-2">
            My Students ({acceptedStudents.length})
          </h2>

          {acceptedStudents.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-xl text-gray-400">No students yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedStudents.map((student, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-indigo-500/20 hover:border-indigo-500 border border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                      <FaUserGraduate className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{student.name}</h3>
                      <p className="text-sm text-indigo-300">{student.email}</p>
                      <p className="text-sm text-gray-400">{student.usn}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">
                        {student.department} • Semester {student.semester}
                      </p>
                      <p className="text-sm text-gray-400">
                        CGPA: {student.cgpa}
                      </p>
                    </div>
                    <button
                      onClick={() => openFeedbackForm(student)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                    >
                      <FaPlus className="text-xs" /> Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedbacks Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-indigo-300 border-b border-indigo-600 pb-2">
            Student Feedbacks ({feedbacks.length})
          </h2>

          {feedbacks.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-xl text-gray-400">No feedbacks yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-indigo-500/20 hover:border-indigo-500 border border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                      <FaUserGraduate className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{feedback.by}</h3>
                      {feedback.rating && (
                        <div className="mt-1">
                          {renderRating(feedback.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <FaQuoteLeft className="text-indigo-400 opacity-20 text-4xl absolute -top-2 -left-2" />
                    <p className="text-gray-300 italic pl-6 relative z-10">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-300">
                  Give Feedback to {selectedStudent?.name}
                </h3>
                <button
                  onClick={closeFeedbackForm}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= feedbackForm.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={feedbackForm.feedback}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        feedback: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    placeholder="Write your feedback here..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeFeedbackForm}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeFeedBack;
