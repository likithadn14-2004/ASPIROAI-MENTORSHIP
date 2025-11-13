import React from "react";
import { FaTasks, FaEdit, FaExclamationTriangle } from "react-icons/fa";

const TasksSection = ({
  studentData,
  statusUpdates,
  handleStatusChange,
  updateTaskStatus,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <FaTasks className="text-indigo-400 text-xl mr-2" />
        <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
      </div>

      {studentData.tasks.length > 0 ? (
        <div className="space-y-4">
          {studentData.tasks.map((taskItem) => (
            <div
              key={taskItem._id}
              className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-all bg-gray-750 hover:border-indigo-500/30"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">
                  {taskItem.task.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    taskItem.status === "Completed"
                      ? "bg-green-900 text-green-300"
                      : taskItem.status === "In Progress"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {taskItem.status}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{taskItem.task.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                  Assigned:{" "}
                  {new Date(taskItem.task.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center space-x-2">
                  <select
                    value={statusUpdates[taskItem.task._id] || taskItem.status}
                    onChange={(e) =>
                      handleStatusChange(taskItem.task._id, e.target.value)
                    }
                    className="border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                  >
                    <option value="Pending" className="bg-gray-800">
                      Pending
                    </option>
                    <option value="In Progress" className="bg-gray-800">
                      In Progress
                    </option>
                    <option value="Completed" className="bg-gray-800">
                      Completed
                    </option>
                  </select>

                  <button
                    onClick={() => updateTaskStatus(taskItem.task._id)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center transition-colors"
                  >
                    <FaEdit className="mr-1" /> Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaExclamationTriangle className="mx-auto text-4xl text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-400">
            No tasks assigned yet
          </h3>
          <p className="text-gray-500">Your mentor will assign tasks here</p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;
