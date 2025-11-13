import React, { useState } from "react";
import Header from "../../components/Header";
import { FiSearch, FiX, FiCheckCircle } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const RecommendSkills = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend_skills/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ job_name: jobTitle }),
      });

      if (!response.ok) throw new Error("Failed to fetch skills");

      const data = await response.json();
      setSkills(data.skills.split(",").map((skill) => skill.trim()));
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSkills([]);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center text-indigo-400 mt-[40px]">
            Skill Recommendation Engine
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Enter a job title to discover essential skills you should learn
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex shadow-lg rounded-full overflow-hidden bg-gray-800 border border-gray-700 max-w-2xl mx-auto">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title (e.g., MERN developer, Data Scientist)"
                className="flex-1 bg-transparent px-6 py-4 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !jobTitle.trim()}
                className={`px-6 flex items-center justify-center ${
                  isLoading || !jobTitle.trim()
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-indigo-400 hover:text-indigo-300"
                }`}
              >
                {isLoading ? (
                  <ImSpinner8 className="animate-spin" size={20} />
                ) : (
                  <FiSearch size={20} />
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Example Job Titles */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-3">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "MERN Developer",
                "Data Scientist",
                "DevOps Engineer",
                "UI/UX Designer",
              ].map((title) => (
                <button
                  key={title}
                  onClick={() => setJobTitle(title)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm border border-gray-700 transition-colors"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="border-b border-gray-700 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-indigo-400">
                      Recommended Skills for{" "}
                      <span className="text-white">{jobTitle}</span>
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-white p-1 rounded-full"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <p className="text-gray-400 mt-1">
                    {skills.length} essential skills to master
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors"
                      >
                        <div className="flex items-center">
                          <FiCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
                          <span className="font-medium">{skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                  <button
                    onClick={closeModal}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Got it! Let's start learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecommendSkills;
