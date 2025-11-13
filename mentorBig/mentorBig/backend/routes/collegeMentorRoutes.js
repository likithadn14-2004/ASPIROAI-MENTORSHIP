const express = require("express");
const {
  registerMentor,
  assignTask,
  getSingleMentor,
  getAllMentors,
  loginMentor,
  getAllTasks,
  addFeedbackToMentor,
  addRequest,
  addAccepted,
} = require("../controllers/collegeMentorController");
const router = express.Router();

router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.post("/tasks", assignTask);
router.get("/:id", getSingleMentor);
router.get("/", getAllMentors);
router.get("/task", getAllTasks);
router.post("/addFeedback", addFeedbackToMentor);
router.post("/addRequests", addRequest);
router.post("/addAccepted", addAccepted);

module.exports = router;
