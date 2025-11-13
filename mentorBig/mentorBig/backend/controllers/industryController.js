const Mentor = require("../models/industryMentorModel");
const Student = require("../models/studentModel");

// @desc Register a new mentor
// @route POST /api/mentors/register
const registerMentor = async (req, res) => {
  const {
    name,
    email,
    password,
    designation,
    areaOfExpertise,
    yearsOfExperience,
    state,
    industry,
    location,
    company,
    profilePhoto,
  } = req.body;

  try {
    let mentor = await Mentor.findOne({ email });

    if (mentor) {
      return res.status(400).json({ message: "Mentor already exists" });
    }

    mentor = new Mentor({
      name,
      email,
      password,
      designation,
      areaOfExpertise,
      yearsOfExperience,
      state,
      industry,
      location,
      company,
      profilePhoto,
    });
    await mentor.save();

    res.status(201).json({ message: "Mentor registered successfully", mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Login mentor
// @route POST /api/mentors/login
const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.findOne({ email });

    if (!mentor || mentor.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Get a single mentor by ID
// @route GET /api/mentors/:id
const getSingleMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate("requests")
      .populate("accepted");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Get all mentors
// @route GET /api/mentors
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate("requests").populate("accepted");
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const addFeedbackToMentor = async (req, res) => {
  const { mentorId, by, student, feedback } = req.body;

  try {
    // Validate input
    if (!by || !student || !feedback) {
      return res
        .status(400)
        .json({ message: "All feedback fields are required." });
    }

    // Find the mentor
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Add feedback
    mentor.feedBack.push({ by, student, feedback });

    // Save updated mentor
    await mentor.save();

    res.status(200).json({ message: "Feedback added successfully.", mentor });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error. Could not add feedback." });
  }
};

const addRequest = async(req,res)=>{
  try {
    const {studentId , mentorId} = req.body
    const mentor = await Mentor.findById(mentorId);
    mentor.requests.push(studentId)
    await mentor.save();
    return res.status(200).send({
      mentor
    })
  } catch (error) {
     console.error("Error adding req:", error);
     res.status(500).json({ message: "Server error. Could not add feedback." });
  }
}

const addAccepted = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    console.log("Received:", { studentId, mentorId });

    // Find the mentor with populated requests and accepted fields
    const mentor = await Mentor.findById(mentorId)
      .populate("requests")
      .populate("accepted");

    const student = await Student.findById(studentId);
    student.industryMentor.push(mentorId);
    await student.save();

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    console.log("Current requests:", mentor.requests);
    console.log("Current accepted:", mentor.accepted);

    // Convert studentId to string for comparison
    const studentIdStr = studentId.toString();

    // Remove studentId from requests array
    // Since we populated requests, they are full objects
    mentor.requests = mentor.requests.filter((requestObj) => {
      const result = requestObj._id.toString() !== studentIdStr;
      console.log(
        `Comparing ${requestObj._id.toString()} with ${studentIdStr}: ${result}`
      );
      return result;
    });

    console.log("Requests after filter:", mentor.requests);

    // Add studentId to accepted array if not already present
    const isAlreadyAccepted = mentor.accepted.some(
      (acceptedStudent) => acceptedStudent._id.toString() === studentIdStr
    );

    if (!isAlreadyAccepted) {
      // Push just the ObjectId, not the populated object
      mentor.accepted.push(studentId);
      console.log("Added to accepted");
    } else {
      console.log("Already in accepted");
    }

    // Save the updated mentor
    await mentor.save();

    // To see the final state, we need to populate again
    const updatedMentor = await Mentor.findById(mentorId)
      .populate("requests")
      .populate("accepted");

    console.log("Final state - requests:", updatedMentor.requests);
    console.log("Final state - accepted:", updatedMentor.accepted);

    return res.status(200).send({
      success: true,
      mentor: updatedMentor,
    });
  } catch (error) {
    console.error("Error adding req:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not add to accepted." });
  }
};

module.exports = {
  registerMentor,
  loginMentor,
  getSingleMentor,
  getAllMentors,
  addFeedbackToMentor,
  addAccepted,
  addRequest
};
