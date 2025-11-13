import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Header";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaPaperPlane,
  FaComments,
  FaBriefcase,
  FaGraduationCap,
  FaSearch,
  FaUserGraduate,
  FaBuilding,
  FaCheck,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";

const socket = io("http://localhost:5000");

const IndChats = () => {
  const [students, setStudents] = useState([]);
  const [industryMentors, setIndustryMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/student", {
          headers: { Authorization: token },
        });
        setStudents(res.data);
      } catch (error) {
        toast.error("Error fetching students");
      }
    };

    const fetchIndustryMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/industryMentor", {
          headers: { Authorization: token },
        });
        setIndustryMentors(res.data);

        // If user is an industry mentor, get their requests and accepted students
        if (user?.role === "IndustryMentor") {
          const currentMentor = res.data.find(
            (mentor) => mentor._id === user._id
          );
          if (currentMentor) {
            setRequests(currentMentor.requests || []);
            setAcceptedStudents(currentMentor.accepted || []);
          }
        }
      } catch (error) {
        toast.error("Error fetching industry mentors");
      }
    };

    fetchStudents();
    fetchIndustryMentors();

    // Join mentor's socket room
    socket.emit("joinUser", user?._id);

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      if (
        message.sender === selectedUser?._id ||
        message.receiver === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser, user?._id, user?.role]);

  const loadMessages = async (userId, userRole) => {
    const allUsers = [...students, ...industryMentors];
    const nuser = allUsers.find((u) => u._id === userId);
    if (!user) return;

    setSelectedUser(nuser);

    try {
      const res = await axios.post(
        "http://localhost:5000/messages/get",
        {
          user1: user._id,
          model1: user.role,
          user2: nuser._id,
          model2: nuser.role,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setMessages(res.data);
    } catch (error) {
      toast.error("Failed to load chat history");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messagePayload = {
      sender: user._id,
      senderModel: user.role,
      receiver: selectedUser._id,
      receiverModel: selectedUser.role,
      message: newMessage,
    };

    // Optimistic UI update
    const tempMsg = {
      ...messagePayload,
      _id: Date.now(),
      createdAt: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    socket.emit("sendMessage", messagePayload);

    try {
      await axios.post("http://localhost:5000/messages/send", messagePayload, {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (error) {
      toast.error("Failed to send message");
      // Rollback optimistic update
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
    }
  };

  const handleAcceptRequest = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/industryMentor/addAccepted",
        {
          mentorId: user._id,
          studentId: studentId,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (res.data.success) {
        // Update local state
        setRequests(requests.filter((req) => req._id !== studentId));
        setAcceptedStudents([
          ...acceptedStudents,
          students.find((s) => s._id === studentId),
        ]);

        // Update industry mentors list
        const updatedMentors = industryMentors.map((mentor) => {
          if (mentor._id === user._id) {
            return {
              ...mentor,
              requests: mentor.requests.filter((req) => req._id !== studentId),
              accepted: [
                ...mentor.accepted,
                students.find((s) => s._id === studentId),
              ],
            };
          }
          return mentor;
        });

        setIndustryMentors(updatedMentors);
        toast.success("Request accepted successfully");
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
  };

  const handleRejectRequest = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/industryMentor/reject",
        {
          mentorId: user._id,
          studentId: studentId,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (res.data.success) {
        // Update local state
        setRequests(requests.filter((req) => req._id !== studentId));

        // Update industry mentors list
        const updatedMentors = industryMentors.map((mentor) => {
          if (mentor._id === user._id) {
            return {
              ...mentor,
              requests: mentor.requests.filter((req) => req._id !== studentId),
            };
          }
          return mentor;
        });

        setIndustryMentors(updatedMentors);
        toast.success("Request rejected");
      }
    } catch (error) {
      toast.error("Error rejecting request");
    }
  };

  // Filter users based on search term
  const filteredStudents = students
    .filter((student) => acceptedStudents.some((s) => s._id === student._id))
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredIndustryMentors = industryMentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserIcon = (role) => {
    switch (role) {
      case "Student":
        return <FaUserGraduate className="text-blue-400" />;
      case "IndustryMentor":
        return <FaBriefcase className="text-purple-400" />;
      default:
        return <FaUserCircle className="text-gray-400" />;
    }
  };

  const getUserTitle = (role) => {
    switch (role) {
      case "Student":
        return "Student";
      case "IndustryMentor":
        return "Industry Mentor";
      default:
        return "User";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex">
      <Navbar />
      <ToastContainer />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-1/3 bg-gray-800 p-6 border-r border-gray-700 shadow-lg overflow-y-auto"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <RiMessage2Fill className="text-green-400" />
            My Conversations
          </h2>

          {/* Search bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-4">
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "requests"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <FaUserPlus />
              Requests ({requests.length})
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "students"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("students")}
            >
              <FaUserGraduate />
              Students ({acceptedStudents.length})
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "mentors"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("mentors")}
            >
              <FaBriefcase />
              Industry Mentors
            </button>
          </div>
        </div>

        {/* Requests List */}
        <AnimatePresence>
          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredRequests.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No pending requests
                </p>
              ) : (
                filteredRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 flex items-center gap-3 rounded-lg bg-gray-700"
                  >
                    {getUserIcon("Student")}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">
                        {request.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {request.collegeName || "Student"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAcceptRequest(request._id)}
                        className="p-2 bg-green-600 rounded-full hover:bg-green-700"
                      >
                        <FaCheck className="text-white text-sm" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRejectRequest(request._id)}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-700"
                      >
                        <FaTimes className="text-white text-sm" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Students List */}
        <AnimatePresence>
          {activeTab === "students" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredStudents.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No students found
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <motion.div
                    key={student._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 flex items-center gap-3 rounded-lg cursor-pointer transition-all ${
                      selectedUser?._id === student._id
                        ? "bg-blue-900 bg-opacity-50"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => loadMessages(student._id, "Student")}
                  >
                    {getUserIcon("Student")}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {student.collegeName || "Student"}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Industry Mentors List */}
        <AnimatePresence>
          {activeTab === "mentors" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredIndustryMentors.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No industry mentors found
                </p>
              ) : (
                filteredIndustryMentors.map((mentor) => (
                  <motion.div
                    key={mentor._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 flex items-center gap-3 rounded-lg cursor-pointer transition-all ${
                      selectedUser?._id === mentor._id
                        ? "bg-purple-900 bg-opacity-50"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => loadMessages(mentor._id, "IndustryMentor")}
                  >
                    {getUserIcon("IndustryMentor")}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">
                        {mentor.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {mentor.industry || "Industry Mentor"}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-gray-800 p-6 shadow-lg mt-14"
      >
        {selectedUser ? (
          <>
            <div className="flex items-center border-b border-gray-700 pb-4 mb-4">
              {getUserIcon(selectedUser.role)}
              <div className="ml-3">
                <h2 className="text-2xl font-bold text-gray-100">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {getUserTitle(selectedUser.role)}
                  {selectedUser.collegeName && ` • ${selectedUser.collegeName}`}
                  {selectedUser.industry && ` • ${selectedUser.industry}`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <FaComments className="text-5xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 max-w-xs lg:max-w-md rounded-lg ${
                        msg.sender === user._id
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.sender === user._id && (
                          <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-700 pt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane /> Send
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center">
              <FaComments className="text-5xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300">
                {activeTab === "requests"
                  ? "Connection Requests"
                  : "Select a conversation"}
              </h3>
              <p className="text-gray-500 mt-2">
                {activeTab === "requests"
                  ? "Accept or reject connection requests from students"
                  : "Choose a student or industry mentor to start chatting"}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IndChats;
