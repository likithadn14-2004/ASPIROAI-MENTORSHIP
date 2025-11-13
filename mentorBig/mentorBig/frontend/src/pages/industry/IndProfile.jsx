import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import MentorProfileHeader from "../../components/industry/MentorProfileHeader";
import MentorDetails from "../../components/industry/MentorDetails";
import FeedbackSection from "../../components/industry/FeedbackSection";
import ExpertiseSection from "../../components/industry/ExpertiseSection";
import StatsSection from "../../components/industry/StatsSection";
import {
  FaUserGraduate,
  FaPlus,
  FaTimes,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

const IndProfile = () => {
  const mentor = JSON.parse(localStorage.getItem("user"));
  const mentorId = mentor?._id;
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    feedback: "",
    rating: 0,
  });

  const getSingleMentor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/industryMentor/${mentorId}`
      );
      setMentorData(data);
    } catch (error) {
      console.error("Error fetching mentor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleMentor();
  }, []);

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
        by: "Industry Mentor",
        mentor: mentorData.name,
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
        getSingleMentor();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="text-center py-12 text-gray-300">
          <h2 className="text-2xl font-semibold">Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 pb-12">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <MentorProfileHeader mentorData={mentorData} />
            <StatsSection mentorData={mentorData} />

            {/* Accepted Students Section */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-300">
                My Students ({mentorData.accepted?.length || 0})
              </h2>

              {mentorData.accepted?.length === 0 ? (
                <p className="text-gray-400">No students yet</p>
              ) : (
                <div className="space-y-3">
                  {mentorData.accepted.map((student, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaUserGraduate className="text-indigo-400 mr-2" />
                          <span className="font-medium">{student.name}</span>
                        </div>
                        <button
                          onClick={() => openFeedbackForm(student)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaPlus className="text-xs" /> Feedback
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {student.email}
                      </p>
                      <p className="text-xs text-gray-500">{student.usn}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <MentorDetails mentorData={mentorData} />
            <ExpertiseSection mentorData={mentorData} />
            <FeedbackSection mentorData={mentorData} />
          </div>
        </div>
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
  );
};

export default IndProfile;
