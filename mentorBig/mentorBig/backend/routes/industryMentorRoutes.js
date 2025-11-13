const express = require("express");
const {
  registerMentor,
  loginMentor,
  getSingleMentor,
  getAllMentors,
  addFeedbackToMentor,
  addRequest,
  addAccepted,
} = require("../controllers/industryController");
const router = express.Router();

router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.get("/:id", getSingleMentor);
router.get("/", getAllMentors);
router.post("/addFeedback", addFeedbackToMentor);
router.post("/addRequests", addRequest);
router.post("/addAccepted", addAccepted);

module.exports = router;
