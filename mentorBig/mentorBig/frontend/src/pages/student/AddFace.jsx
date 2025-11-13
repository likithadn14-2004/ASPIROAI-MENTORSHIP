import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaUpload, FaCheck, FaSpinner } from "react-icons/fa";

const AddFace = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getSingleStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const submitFaceImage = async () => {
    if (!capturedImage) {
      toast.error("Please capture an image first");
      return;
    }

    try {
      setUploadLoading(true);

      // Convert data URL to blob
      const blob = await fetch(capturedImage).then((res) => res.blob());
      const file = new File([blob], "face.jpg", { type: "image/jpeg" });

      // Send to face recognition API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("student_name", studentData?.name);
      console.log(studentData?.name);

      const recognitionResponse = await axios.post(
        "http://127.0.0.1:8000/add_face/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update backend with uploaded status
      await axios.post("http://localhost:5000/student/addface", {
        studentId: id,
        uploaded: true,
      });

      toast.success("Face image uploaded successfully");
      setShowCameraModal(false);
      setCapturedImage(null);
      getSingleStudent(); // Refresh data
    } catch (error) {
      console.error("Error uploading face image:", error);
      toast.error("Failed to upload face image");
    } finally {
      setUploadLoading(false);
    }
  };

  const closeModal = () => {
    stopCamera();
    setShowCameraModal(false);
    setCapturedImage(null);
  };

  useEffect(() => {
    getSingleStudent();
    return () => {
      stopCamera();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 border border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Face Registration
            </h1>

            {studentData?.uploaded ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-400 text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Face Already Registered
                </h2>
                <p className="text-gray-400">
                  You have successfully uploaded your face image.
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCamera className="text-indigo-400 text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Register Your Face
                </h2>
                <p className="text-gray-400 mb-6">
                  Click below to capture your face image for attendance system
                </p>
                <button
                  onClick={startCamera}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md flex items-center mx-auto"
                >
                  <FaUpload className="mr-2" /> Upload Face Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {showCameraModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Capture Face Image</h2>

              {!capturedImage ? (
                <>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                    <canvas
                      ref={canvasRef}
                      width="640"
                      height="480"
                      className="hidden"
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={captureImage}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FaCamera className="mr-2" /> Capture Image
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Retake
                    </button>
                    <button
                      onClick={submitFaceImage}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />{" "}
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="mr-2" /> Submit Face Image
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddFace;
