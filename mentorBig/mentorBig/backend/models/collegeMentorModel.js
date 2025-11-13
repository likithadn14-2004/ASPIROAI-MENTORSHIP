const mongoose = require("mongoose");

const CollegeMentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    collegeName: { type: String, required: true },
    areaOfExpertise: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    role: { type: String, default: "CollegeMentor" },
    profilePhoto: {
      type: String,
      required: true,
    },
    feedBack: [
      {
        by: {
          type: String,
        },
        student: {
          type: String,
        },
        feedback: {
          type: String,
        },
      },
    ],
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    accepted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollegeMentor", CollegeMentorSchema);
