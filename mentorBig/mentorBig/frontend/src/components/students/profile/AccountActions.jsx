import React, { useState } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountActions = ({ studentId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))
  const id = user?._id
console.log(id)
  const handleDeleteAccount = async () => {
    try {
      await axios.post(`http://localhost:5000/student/delete`, {
        studentId: id,
      });
      localStorage.clear()
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const confirmAction = () => {
    handleDeleteAccount();
    setShowConfirm(false);
  };

  const cancelAction = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaExclamationTriangle className="mr-2 text-amber-400" /> Account
        Actions
      </h2>

      <div className="space-y-4">
        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <FaTrash className="mr-2 text-red-400" /> Delete Account
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-amber-400 text-xl mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to permanently delete your account? This
              action cannot be undone and all your data will be lost.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelAction}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountActions;
