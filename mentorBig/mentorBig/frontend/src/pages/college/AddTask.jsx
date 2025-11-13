import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const mentor = JSON.parse(localStorage.getItem("user"));
  const mentorId = mentor?._id;
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    mentorId: mentorId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/collegeMentor/tasks",
        taskData
      );

      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        setTaskData({
          title: "",
          description: "",
          mentorId: mentorId,
        });
        setRefresh(!refresh); // Trigger refresh of task list
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
      console.error("Error adding task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllMentors = async () => {
    const id = mentorId;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/collegeMentor/${id}`
      );
      setAllTasks(data?.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/collegeMentor/tasks/${taskId}`);
      setRefresh(!refresh); // Refresh the task list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    getAllMentors();
  }, [refresh]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8 mt-[60px]">
            <h1 className="text-2xl font-bold">Your Tasks</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Task
            </button>
          </div>

          {/* Tasks Grid */}
          {allTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                    {/* <button
                      onClick={() => deleteTask(task._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button> */}
                  </div>
                  <p className="text-gray-300 mb-4">{task.description}</p>
                  <div className="text-sm text-gray-400">
                    <span className="block">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                No tasks found
              </h3>
              <p className="mt-1 text-gray-500">
                Get started by creating a new task
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Create Task
              </button>
            </div>
          )}

          {/* Add Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add New Task</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white"
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

                {error && (
                  <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-2"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={taskData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={taskData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition duration-200 flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddTask;
