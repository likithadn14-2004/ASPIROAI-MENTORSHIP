import React, { useState, useCallback } from "react";
import Header from "../../components/Header";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX, FiCheck, FiAward } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const ResumeScore = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDropResume = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setResumeFile(acceptedFiles[0]);
    }
  }, []);

  const onDropJobDesc = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setJobDescFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getResumeRootProps,
    getInputProps: getResumeInputProps,
    isDragActive: isResumeDragActive,
  } = useDropzone({
    onDrop: onDropResume,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getJobDescRootProps,
    getInputProps: getJobDescInputProps,
    isDragActive: isJobDescDragActive,
  } = useDropzone({
    onDrop: onDropJobDesc,
    accept: {
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const removeResume = () => {
    setResumeFile(null);
  };

  const removeJobDesc = () => {
    setJobDescFile(null);
  };

  const submitFiles = async () => {
    if (!resumeFile || !jobDescFile) {
      alert("Please upload both files");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_desc", jobDescFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/score_resume/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your files");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400 mt-[50px]">
            Resume Scoring System
          </h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Upload your resume and job description to get a compatibility score
            and improve your chances of landing the job.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Resume Upload */}
            <div
              {...getResumeRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isResumeDragActive
                  ? "border-indigo-500 bg-gray-800"
                  : "border-gray-700 hover:border-indigo-400 hover:bg-gray-800"
              }`}
            >
              <input {...getResumeInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <FiUpload className="text-4xl text-indigo-400" />
                <h3 className="text-xl font-semibold">Upload Resume</h3>
                <p className="text-gray-400">
                  {isResumeDragActive
                    ? "Drop your resume here"
                    : "Drag & drop your resume (PDF/DOC) or click to browse"}
                </p>
                <p className="text-sm text-gray-500">PDF or DOC/DOCX only</p>
              </div>
            </div>

            {/* Job Description Upload */}
            <div
              {...getJobDescRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isJobDescDragActive
                  ? "border-indigo-500 bg-gray-800"
                  : "border-gray-700 hover:border-indigo-400 hover:bg-gray-800"
              }`}
            >
              <input {...getJobDescInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <FiUpload className="text-4xl text-indigo-400" />
                <h3 className="text-xl font-semibold">
                  Upload Job Description
                </h3>
                <p className="text-gray-400">
                  {isJobDescDragActive
                    ? "Drop the job description here"
                    : "Drag & drop job description (DOC/TXT) or click to browse"}
                </p>
                <p className="text-sm text-gray-500">DOC/DOCX or TXT only</p>
              </div>
            </div>
          </div>

          {/* Selected Files Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiFile className="mr-2 text-indigo-400" /> Resume
              </h3>
              {resumeFile ? (
                <div className="flex items-center justify-between bg-gray-700 rounded px-4 py-3">
                  <span className="truncate">{resumeFile.name}</span>
                  <button
                    onClick={removeResume}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 italic">No resume uploaded</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiFile className="mr-2 text-indigo-400" /> Job Description
              </h3>
              {jobDescFile ? (
                <div className="flex items-center justify-between bg-gray-700 rounded px-4 py-3">
                  <span className="truncate">{jobDescFile.name}</span>
                  <button
                    onClick={removeJobDesc}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No job description uploaded
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={submitFiles}
              disabled={isLoading || !resumeFile || !jobDescFile}
              className={`px-8 py-3 rounded-full font-bold text-lg flex items-center mx-auto ${
                isLoading || !resumeFile || !jobDescFile
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" /> Processing...
                </>
              ) : (
                <>
                  <FiAward className="mr-2" /> Get Resume Score
                </>
              )}
            </button>
          </div>

          {/* Result Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 border border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-indigo-400 flex items-center">
                    <FiAward className="mr-2" /> Resume Score
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
                      <span className="text-4xl font-bold">{result.score}</span>
                    </div>
                    <p className="text-gray-400 mt-2">Compatibility Score</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={closeModal}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                    >
                      <FiCheck className="mr-2" /> Got it!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeScore;
