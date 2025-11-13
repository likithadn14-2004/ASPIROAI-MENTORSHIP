import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTasks, FaSpinner, FaPlus, FaCheck } from "react-icons/fa";

const Tasks = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const fetchMentorsWithTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/collegeMentor/");
      setMentors(data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast.error("Failed to fetch mentors");
    } finally {
      setIsLoading(false);
    }
  };

  const getSingleStudent = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/student/${studentId}`
      );
      setStudentData(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load student data");
    }
  };

  const assignTaskToStudent = async (taskId) => {
    try {
      await axios.post("http://localhost:5000/student/add-task", {
        taskId,
        studentId,
      });
      toast.success("Task assigned successfully");
      getSingleStudent(); // Refresh student data to update the assigned tasks
    } catch (error) {
      toast.error("Failed to assign task");
      console.error(error);
    }
  };

  // Check if task is already assigned to the student
  const isTaskAssigned = (taskId) => {
    if (!studentData || !studentData.tasks) return false;
    return studentData.tasks.some((task) => task.task._id === taskId);
  };

  useEffect(() => {
    fetchMentorsWithTasks();
    getSingleStudent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaTasks className="text-indigo-400" />
            Mentor Tasks
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-indigo-400" />
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{mentor.name}</h3>
                </div>

                {mentor.tasks && mentor.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {mentor.tasks.map((task) => {
                      const isAssigned = isTaskAssigned(task._id);
                      return (
                        <div
                          key={task._id}
                          className="bg-gray-700 p-4 rounded-lg relative"
                        >
                          {isAssigned && (
                            <div className="absolute top-2 right-2 flex items-center text-green-400 text-xs">
                              <FaCheck className="mr-1" /> Added
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{task.title}</h4>
                            <button
                              onClick={() =>
                                !isAssigned && assignTaskToStudent(task._id)
                              }
                              className={`text-gray-400 transition-colors ${
                                isAssigned
                                  ? "cursor-not-allowed opacity-50"
                                  : "hover:text-green-500"
                              }`}
                              title={
                                isAssigned
                                  ? "Already added"
                                  : "Assign to Student"
                              }
                              disabled={isAssigned}
                            >
                              {isAssigned ? null : <FaPlus />}
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">
                            {task.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created:{" "}
                            {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No tasks available
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <FaTasks className="mx-auto text-5xl text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">
              No mentors found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
