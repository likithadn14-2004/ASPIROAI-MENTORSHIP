import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import ProfileHeader from "../../components/students/profile/ProfileHeader";
import BadgeSection from "../../components/students/profile/BadgeSection";
import AttendanceStats from "../../components/students/profile/AttendanceStats";
import AttendanceRecords from "../../components/students/profile/AttendanceRecords";
import TasksSection from "../../components/students/profile/TaskSection";
import AccountActions from "../../components/students/profile/AccountActions";
import StudentDetails from "../../components/students/profile/StudentDetails";
import {
  FaQuoteLeft,
  FaUserTie,
  FaCamera,
  FaCheckCircle,
  FaSync,
} from "react-icons/fa";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showFaceAttendanceModal, setShowFaceAttendanceModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [fastApiAttendance, setFastApiAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const getSingleStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData(data);

      const updates = {};
      data.tasks.forEach((task) => {
        updates[task.task._id] = task.status;
      });
      setStatusUpdates(updates);

      checkAndAwardBadge(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFastApiAttendance = async () => {
    if (!studentData) return;

    try {
      setLoadingAttendance(true);
      const response = await axios.get(`http://127.0.0.1:8002/attendance`, {
        params: {
          year: studentData.year,
          department: studentData.department,
          section: studentData.section || "A",
        },
      });

      if (response.data && response.data.records) {
        // Filter records to show only the current student
        const studentRecords = response.data.records.filter(
          (record) => record.student_id === studentData.usn
        );
        setFastApiAttendance(studentRecords);
      }
    } catch (error) {
      console.error("Error fetching attendance from FastAPI:", error);
      // Don't show error toast as it might be expected if no records exist yet
    } finally {
      setLoadingAttendance(false);
    }
  };

  const checkAndAwardBadge = async (studentData) => {
    if (!studentData.tasks || studentData.tasks.length === 0) return;

    const totalTasks = studentData.tasks.length;
    const completedTasks = studentData.tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    let badgeToAward = null;

    if (completedTasks === totalTasks && totalTasks > 0) {
      badgeToAward = "Golden";
    } else if (completedTasks >= totalTasks / 2) {
      badgeToAward = "Silver";
    } else if (completedTasks > 0) {
      badgeToAward = "Bronze";
    }

    if (
      badgeToAward &&
      (!studentData.badge || studentData.badge !== badgeToAward)
    ) {
      try {
        await axios.post(`http://localhost:5000/student/addBadge`, {
          id: id,
          badge: badgeToAward,
        });
        setBadgeEarned(true);
        setTimeout(() => setBadgeEarned(false), 3000);
        toast.success(`Congratulations! You earned a ${badgeToAward} badge!`);
        getSingleStudent();
      } catch (error) {
        console.error("Error awarding badge:", error);
      }
    }
  };

  const updateTaskStatus = async (taskId) => {
    try {
      const newStatus = statusUpdates[taskId];
      await axios.post(`http://localhost:5000/student/update-task-status`, {
        taskId,
        status: newStatus,
        studentId: id,
      });
      toast.success("Task status updated successfully");
      getSingleStudent();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task status");
    }
  };

  const handleStatusChange = (taskId, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const submitAttendance = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/student/addAttendance",
        {
          studentId: id,
          status: attendanceStatus,
        }
      );

      if (!data?.success) {
        toast.error("Attendance for this date already marked");
        return;
      }

      toast.success("Attendance marked successfully");
      setShowAttendanceModal(false);
      getSingleStudent();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageDataUrl);

    // Stop the camera after capturing
    stopCamera();
  };

  const retakeImage = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitFaceAttendance = async () => {
    if (!capturedImage) {
      toast.error("Please capture an image first");
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], "face_image.jpg", { type: "image/jpeg" });

      // Create form data
      const formData = new FormData();
      formData.append("year", studentData.year);
      formData.append("department", studentData.department);
      formData.append("section", studentData.section || "A");
      formData.append("group_photo", file);

      // Send to FastAPI
      const result = await axios.post(
        "http://127.0.0.1:8002/take_group_attendance",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAttendanceResult(result.data);

      // If attendance was marked successfully, update the UI
      if (result.data.recognized > 0) {
        toast.success(
          `Attendance marked for ${result.data.recognized} students`
        );
        getSingleStudent(); // Refresh student data to show updated attendance
        fetchFastApiAttendance(); // Refresh FastAPI attendance records
      } else {
        toast.error("No recognized faces in the image");
      }
    } catch (error) {
      console.error("Error submitting face attendance:", error);
      toast.error("Failed to mark attendance with face recognition");
    }
  };

  const handleAccountAction = async (actionType) => {
    try {
      const endpoint = actionType === "deactivate" ? "/deactivate" : "/delete";
      const { data } = await axios.post(
        `http://localhost:5000/student${endpoint}`,
        { userId: id }
      );

      if (data.success) {
        toast.success(
          actionType === "deactivate"
            ? "Account deactivated successfully"
            : "Account deleted successfully"
        );

        if (actionType === "delete") {
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }
      }
    } catch (error) {
      console.error(`Error ${actionType} account:`, error);
      toast.error(`Failed to ${actionType} account`);
    }
  };

  useEffect(() => {
    if (showFaceAttendanceModal) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setAttendanceResult(null);
    }

    return () => {
      stopCamera();
    };
  }, [showFaceAttendanceModal]);

  useEffect(() => {
    getSingleStudent();
  }, []);

  useEffect(() => {
    if (studentData) {
      fetchFastApiAttendance();
    }
  }, [studentData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="text-center py-12 text-gray-300">
          <h2 className="text-2xl font-semibold">Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br p-4 from-gray-900 to-gray-800 text-gray-100 pb-12">
        <div className="container mx-auto px-4 py-8 mt-10">
          {/* Badge Earned Notification */}
          {badgeEarned && studentData?.badge && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${
                studentData.badge === "Golden"
                  ? "bg-gradient-to-r from-yellow-600 to-amber-600"
                  : studentData.badge === "Silver"
                  ? "bg-gradient-to-r from-gray-600 to-slate-600"
                  : "bg-gradient-to-r from-amber-700 to-orange-700"
              } text-white flex items-center space-x-3`}
            >
              <div className="text-2xl">🏆</div>
              <div>
                <h3 className="font-bold">New Achievement!</h3>
                <p>You've earned the {studentData.badge} badge!</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              <ProfileHeader
                studentData={studentData}
                setShowAttendanceModal={setShowAttendanceModal}
                setShowFaceAttendanceModal={setShowFaceAttendanceModal}
              />

              <StudentDetails studentData={studentData} />

              <AccountActions handleAccountAction={handleAccountAction} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              {studentData.badge && <BadgeSection studentData={studentData} />}

              {/* FastAPI Attendance Records */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-indigo-300">
                    Face Recognition Attendance
                  </h2>
                  <button
                    onClick={fetchFastApiAttendance}
                    disabled={loadingAttendance}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors flex items-center"
                    title="Refresh attendance"
                  >
                    <FaSync
                      className={loadingAttendance ? "animate-spin" : ""}
                    />
                  </button>
                </div>

                {loadingAttendance ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400"></div>
                  </div>
                ) : fastApiAttendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Time</th>
                          <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fastApiAttendance.map((record, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-700 hover:bg-gray-700"
                          >
                            <td className="px-4 py-3">
                              {new Date().toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">{record.time}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Present"
                                    ? "bg-green-500/20 text-green-400"
                                    : record.status === "Late"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : record.status === "Absent"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FaCamera className="text-4xl mx-auto mb-3 opacity-50" />
                    <p>No face recognition attendance records found.</p>
                    <p className="text-sm mt-2">
                      Mark your attendance using the face recognition feature.
                    </p>
                  </div>
                )}
              </div>

              <TasksSection
                studentData={studentData}
                statusUpdates={statusUpdates}
                handleStatusChange={handleStatusChange}
                updateTaskStatus={updateTaskStatus}
              />

              {/* Feedback Section */}
              {studentData.feedBack && studentData.feedBack.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-indigo-300">
                    Mentor Feedbacks ({studentData.feedBack.length})
                  </h2>

                  <div className="space-y-4">
                    {studentData.feedBack.map((feedback, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500"
                      >
                        <div className="flex items-start mb-3">
                          <div className="bg-indigo-600 p-2 rounded-full mr-3">
                            <FaUserTie className="text-white text-sm" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {feedback.by}
                            </h3>
                            <p className="text-sm text-indigo-300">
                              {feedback.mentor}
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <FaQuoteLeft className="text-indigo-400 opacity-20 text-2xl absolute -top-1 -left-1" />
                          <p className="text-gray-200 italic pl-6 relative z-10">
                            {feedback.feedback}
                          </p>
                        </div>

                        <div className="mt-3 text-xs text-gray-400">
                          Received feedback from your mentor
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {studentData.feedBack.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No feedback received yet from mentors
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4 text-white">
                Mark Attendance
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Attendance Status
                </label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAttendance}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Attendance
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Face Recognition Attendance Modal */}
        {showFaceAttendanceModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                <FaCamera className="mr-2" /> Face Recognition Attendance
              </h2>

              {!capturedImage ? (
                <>
                  <div className="mb-4 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                    />
                    {isCapturing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse bg-red-500 rounded-full w-4 h-4"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center space-x-3">
                    {!isCapturing ? (
                      <button
                        onClick={startCamera}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <FaCamera className="mr-2" /> Start Camera
                      </button>
                    ) : (
                      <button
                        onClick={captureImage}
                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <FaCheckCircle className="mr-2" /> Capture Image
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                    />
                  </div>

                  {attendanceResult && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">
                        Attendance Result
                      </h3>
                      <p className="text-sm text-gray-300">
                        Recognized: {attendanceResult.recognized} student(s)
                      </p>
                      <p className="text-sm text-gray-300">
                        Total faces: {attendanceResult.total_faces}
                      </p>
                      <p className="text-sm text-green-400 mt-1">
                        {attendanceResult.message}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={retakeImage}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={submitFaceAttendance}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </>
              )}

              <div className="flex justify-start mt-4">
                <button
                  onClick={() => setShowFaceAttendanceModal(false)}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Close
                </button>
              </div>

              {/* Hidden canvas for capturing images */}
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          </div>
        )}
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
    </>
  );
};

export default Profile;
