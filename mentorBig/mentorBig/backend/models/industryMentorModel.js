const mongoose = require("mongoose");

const IndustryMentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, required: true },
    areaOfExpertise: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    state: { type: String, required: true },
    industry: { type: String },
    role: { type: String, default: "IndustryMentor" },
    location: { type: String },
    company: { type: String },
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

module.exports = mongoose.model("IndustryMentor", IndustryMentorSchema);
