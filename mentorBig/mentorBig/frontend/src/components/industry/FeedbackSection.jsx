import React from "react";
import { FaQuoteLeft, FaUserGraduate, FaComments } from "react-icons/fa";

const FeedbackSection = ({ mentorData }) => {
  console.log(mentorData);
  const feedbacks = mentorData.feedBack || [];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaComments className="mr-2 text-indigo-400" /> Student Feedback
        </h2>
        <span className="bg-indigo-700 text-indigo-200 text-sm px-3 py-1 rounded-full">
          {feedbacks.length} {feedbacks.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-8">
          <FaComments className="mx-auto text-4xl text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-400">No feedback yet</h3>
          <p className="text-gray-500">Students will see your feedback here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-gray-750 rounded-xl p-5 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-4 text-white">
                  <FaUserGraduate className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feedback.by}
                  </h3>
                  {feedback.student && (
                    <p className="text-sm text-gray-400">{feedback.student}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <FaQuoteLeft className="text-indigo-400 opacity-20 text-4xl absolute -top-2 -left-2" />
                <p className="text-gray-300 pl-6 relative z-10">
                  {feedback.feedback}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;
