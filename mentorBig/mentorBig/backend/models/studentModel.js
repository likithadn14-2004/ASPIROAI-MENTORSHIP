const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Student" },
    profilePhoto: { type: String, required: true },
    usn: { type: String, required: true, unique: true },
    collegeName: { type: String, required: true },
    phone: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, default: "None" },
    cgpa: { type: Number, default: 0 },
    tasks: [
      {
        task: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
        status: {
          type: String,
          default: "Pending",
        },
      },
    ],
    attendance: [
      {
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true,
        },
      },
    ],
    feedBack: [
      {
        by: {
          type: String,
        },
        mentor: {
          type: String,
        },
        feedback: {
          type: String,
        },
        rating:{
          type:String
        }
      },
    ],
    uploaded: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
    },
    industryMentor: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "IndustryMentor",
        },
     
    ],
    collegeMentor: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CollegeMentor",
        },
     
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
