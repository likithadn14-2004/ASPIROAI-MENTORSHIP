import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Header";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaPaperPlane,
  FaComments,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [industryMentors, setIndustryMentors] = useState([]);
  const [collegeMentors, setCollegeMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [studentData, setStudentData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchIndustryMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/industryMentor", {
          headers: { Authorization: token },
        });
        setIndustryMentors(res.data);
      } catch (error) {
        toast.error("Error fetching industry mentors");
      }
    };

    const fetchCollegeMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/collegeMentor", {
          headers: { Authorization: token },
        });
        setCollegeMentors(res.data);
      } catch (error) {
        toast.error("Error fetching college mentors");
      }
    };

    fetchCollegeMentors();
    fetchIndustryMentors();

    // Join student's socket room
    socket.emit("joinUser", user?._id);

    // Listen for incoming messages
    socket.on("sendPrivateMessageStudenttoIndustry", (message) => {
      if (
        message.sender === user?._id ||
        message.receiverIndustry === selectedMentor?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("sendPrivateMessageStudenttoIndustry");
    };
  }, [selectedMentor, user?._id]);

  const loadMessages = async (mentorId, mentorRole) => {
    const allMentors = [...industryMentors, ...collegeMentors];
    const mentor = allMentors.find((m) => m._id === mentorId);
    if (!mentor) return;

    setSelectedMentor(mentor);

    try {
      const res = await axios.post(
        "http://localhost:5000/messages/get",
        {
          user1: user._id,
          model1: user.role, // "Student"
          user2: mentor._id,
          model2: mentorRole, // "IndustryMentor" or "CollegeMentor"
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
    if (!newMessage.trim() || !selectedMentor) return;

    const messagePayload = {
      sender: user._id,
      senderModel: user.role, // e.g., "Student"
      receiver: selectedMentor._id,
      receiverModel: selectedMentor.role, // e.g., "IndustryMentor"
      message: newMessage,
    };
    console.log(messagePayload);

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
    }
  };

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("receiveMessage", (message) => {
      if (
        message.sender === selectedMentor?._id ||
        message.receiver === selectedMentor?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedMentor, user?._id]);

  const getStudent = async () => {
    const id = user?._id;
    try {
      const { data } = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    getStudent();
  }, []);

  // Filter mentors to only show those in the student's accepted lists
  const filteredIndustryMentors = industryMentors.filter((mentor) =>
    studentData?.industryMentor?.some(
      (acceptedMentor) => acceptedMentor._id === mentor._id
    )
  );

  const filteredCollegeMentors = collegeMentors.filter((mentor) =>
    studentData?.collegeMentor?.some(
      (acceptedMentor) => acceptedMentor._id === mentor._id
    )
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex">
      <Navbar />
      <ToastContainer />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-1/3 bg-gray-800 p-6 border-r border-gray-700 shadow-lg overflow-y-auto mt-16"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaComments className="text-purple-400" />
          Chat with Mentors
        </h2>

        {/* Two-column layout for mentors */}
        <div className="grid grid-cols-2 gap-4 relative">
          {/* Vertical divider line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600 transform -translate-x-1/2"></div>

          {/* Industry Mentors Column */}
          <div className="col-span-1 pr-2">
            <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
              <FaBriefcase className="text-purple-400" />
              Industry Mentors
            </h3>
            {filteredIndustryMentors.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No industry mentors available.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredIndustryMentors.map((mentor) => (
                  <motion.div
                    key={mentor._id}
                    whileHover={{ scale: 1.03 }}
                    className={`p-3 flex items-center gap-2 rounded-lg cursor-pointer transition-all ${
                      selectedMentor?._id === mentor._id
                        ? "bg-purple-900 bg-opacity-50"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => loadMessages(mentor._id, "IndustryMentor")}
                  >
                    <FaUserCircle className="text-2xl text-purple-400" />
                    <div className="overflow-hidden">
                      <span className="font-semibold text-gray-100 text-sm block truncate">
                        {mentor.name}
                      </span>
                      {mentor.industry && (
                        <p className="text-xs text-gray-400 truncate">
                          {mentor.industry}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* College Mentors Column */}
          <div className="col-span-1 pl-2">
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <FaGraduationCap className="text-emerald-400" />
              College Mentors
            </h3>
            {filteredCollegeMentors.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No college mentors available.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredCollegeMentors.map((mentor) => (
                  <motion.div
                    key={mentor._id}
                    whileHover={{ scale: 1.03 }}
                    className={`p-3 flex items-center gap-2 rounded-lg cursor-pointer transition-all ${
                      selectedMentor?._id === mentor._id
                        ? "bg-emerald-900 bg-opacity-50"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => loadMessages(mentor._id, "CollegeMentor")}
                  >
                    <FaUserCircle className="text-2xl text-emerald-400" />
                    <div className="overflow-hidden">
                      <span className="font-semibold text-gray-100 text-sm block truncate">
                        {mentor.name}
                      </span>
                      {mentor.department && (
                        <p className="text-xs text-gray-400 truncate">
                          {mentor.department}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-gray-800 p-6 shadow-lg"
      >
        {selectedMentor ? (
          <>
            <div className="flex items-center border-b border-gray-700 pb-4 mb-4 mt-[50px]">
              <FaUserCircle className="text-4xl text-purple-400" />
              <div className="ml-3">
                <h2 className="text-2xl font-bold text-gray-100">
                  {selectedMentor.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {selectedMentor.role === "IndustryMentor"
                    ? "Industry Mentor"
                    : "College Mentor"}
                  {selectedMentor.industry && ` • ${selectedMentor.industry}`}
                  {selectedMentor.department &&
                    ` • ${selectedMentor.department}`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 max-w-xs rounded-lg ${
                      msg.sender === user._id
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    {msg.message}
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg.sender === user._id && (
                        <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
                      )}
                    </p>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-gray-700 pt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
              >
                <FaPaperPlane /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FaComments className="text-5xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300">
                Select a mentor to chat with
              </h3>
              <p className="text-gray-500 mt-2">
                Choose from the sidebar to start your conversation
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
