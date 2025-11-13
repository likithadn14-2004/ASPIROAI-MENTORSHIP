const {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  addAttendance,
  addImage,
  addBadge,
  addFeedbackToStudent,
  adminaddMentorControl,
  adminremoveMentorControl,
  deleteAccount,
} = require("../controllers/studentController");
const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/studentModel"); // Adjust path if needed

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/addAttendance", addAttendance);
router.post("/addBadge", addBadge);
router.post("/addImage", addImage);
router.post("/addFeedback", addFeedbackToStudent);
router.post("/add-task", async (req, res) => {
  try {
    const { studentId, taskId } = req.body;

    if (!studentId || !taskId) {
      return res
        .status(400)
        .json({ message: "studentId and taskId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const alreadyExists = student.tasks.find(
      (t) => t.task.toString() === taskId
    );
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Task already assigned to student" });
    }

    student.tasks.push({
      task: taskId,
    });

    await student.save();

    res.status(200).json({ message: "Task added successfully", student });
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔁 Update task status for a specific student using req.body
router.post("/update-task-status", async (req, res) => {
  try {
    const { studentId, taskId, status } = req.body;

    if (!studentId || !taskId || !status) {
      return res
        .status(400)
        .json({ message: "studentId, taskId and status are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const taskItem = student.tasks.find((t) => t.task.toString() === taskId);
    if (!taskItem) {
      return res
        .status(404)
        .json({ message: "Task not found for this student" });
    }

    taskItem.status = status;

    await student.save();

    res
      .status(200)
      .json({ message: "Task status updated successfully", student });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to assign a mentor to a student
router.post("/assign-mentor", adminaddMentorControl);

// Route to remove a mentor from a student
router.post("/remove-mentor", adminremoveMentorControl);

router.post("/delete", deleteAccount);
module.exports = router;
