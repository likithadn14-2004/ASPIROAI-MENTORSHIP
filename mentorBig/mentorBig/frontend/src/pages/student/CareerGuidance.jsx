import React, { useState } from "react";
import Header from "../../components/Header";
import { FiSend, FiX } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const CareerGuidance = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills.trim() || !interests.trim()) {
      setError("Please enter both skills and interests");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/career_guidance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          skills: skills.split(",").map((skill) => skill.trim()),
          interests: interests.split(",").map((interest) => interest.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const data = await response.json();
      setRoadmap(data.roadmap);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRoadmap("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center text-indigo-400 mt-[40px]">
            Career Path Planner
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Enter your skills and interests to get a personalized career roadmap
          </p>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-12 bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Your Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., MERN, JavaScript, Python"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Your Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., website development, AI, mobile apps"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !skills.trim() || !interests.trim()}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                  isLoading || !skills.trim() || !interests.trim()
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <ImSpinner8 className="animate-spin mr-2" /> Generating
                    Roadmap...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Get Career Roadmap
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Example Inputs */}
          {!roadmap && (
            <div className="text-center mt-12">
              <p className="text-gray-500 mb-4">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSkills("MERN, JavaScript");
                    setInterests("web development, full-stack");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  Web Developer
                </button>
                <button
                  onClick={() => {
                    setSkills("Python, SQL");
                    setInterests("data analysis, machine learning");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  Data Scientist
                </button>
              </div>
            </div>
          )}

          {/* Roadmap Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl">
                {/* Modal Header */}
                <div className="border-b border-gray-700 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-indigo-400">
                      Your Career Roadmap
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-white p-1 rounded-full"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <p className="text-gray-400 mt-1">
                    Based on skills: {skills} and interests: {interests}
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300">
                      {roadmap}
                    </pre>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                  <button
                    onClick={closeModal}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Close
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

export default CareerGuidance;
