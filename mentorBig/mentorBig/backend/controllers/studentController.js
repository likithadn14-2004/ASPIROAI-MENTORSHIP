const Student = require("../models/studentModel");
const CollegeMentor = require("../models/collegeMentorModel")
const IndustryMentor = require("../models/industryMentorModel");

// Register a student
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profilePhoto,
      usn,
      collegeName,
      phone,
      semester,
      year,
      course,
      department,
      branch,
      cgpa,
    } = req.body;

    // Check if student already exists by email
    const existingStudentByEmail = await Student.findOne({ email });
    if (existingStudentByEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if student already exists by USN
    const existingStudentByUSN = await Student.findOne({ usn });
    if (existingStudentByUSN) {
      return res.status(400).json({ message: "USN already in use" });
    }

    // Check if student already exists by phone
    const existingStudentByPhone = await Student.findOne({ phone });
    if (existingStudentByPhone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    // Create new student with all fields
    const newStudent = new Student({
      name,
      email,
      password,
      profilePhoto,
      usn,
      collegeName,
      phone,
      semester,
      year,
      course,
      department,
      branch: branch || "None",
      cgpa: cgpa || 0,
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully",
      user: newStudent,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists`,
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Login a student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Basic password check (Consider using bcrypt in real apps)
    if (student.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("industryMentor")
      .populate("collegeMentor");;
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate({
        path: "tasks.task",
      })
      .populate("industryMentor")
      .populate("collegeMentor");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res
        .status(400)
        .json({ message: "Student ID and status are required." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for date comparison

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Check if attendance for today already exists
    const alreadyMarked = student.attendance.find((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (alreadyMarked) {
      return res.status(200).json({
        message: "Attendance already marked for today.",
        success: false,
      });
    }

    // Add new attendance
    student.attendance.push({ date: new Date(), status });
    await student.save();

    res.status(200).json({
      message: "Attendance marked successfully",
      attendance: student.attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addFeedbackToStudent = async (req, res) => {
  try {
    const { studentId, by, mentor, feedback, rating } = req.body;

    if (!by || !mentor || !feedback) {
      return res
        .status(400)
        .json({ message: "All feedback fields are required." });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.feedBack.push({ by, mentor, feedback, rating });

    await student.save();

    res.status(200).json({ message: "Feedback added successfully.", student });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { id, uploaded } = req.body;
    const student = await Student.findById(id);
    student.uploaded = uploaded;
    await student.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addBadge = async (req, res) => {
  try {
    const { badge, id } = req.body;
    const student = await Student.findById(id);
    student.badge = badge;
    await student.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminaddMentorControl = async (req, res) => {
  try {
    const { studentId, mentorId, mentorType } = req.body;

    // Validate input
    if (!studentId || !mentorId || !mentorType) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Mentor ID, and Mentor Type are required",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (mentorType === "industry") {
      // Check if industry mentor exists
      const industryMentor = await IndustryMentor.findById(mentorId);
      if (!industryMentor) {
        return res.status(404).json({
          success: false,
          message: "Industry mentor not found",
        });
      }

      // Check if mentor is already assigned
      if (student.industryMentor.includes(mentorId)) {
        return res.status(400).json({
          success: false,
          message: "Industry mentor already assigned to this student",
        });
      }

      // Add mentor to student and student to mentor's accepted array
      await Student.findByIdAndUpdate(studentId, {
        $addToSet: { industryMentor: mentorId },
      });

      await IndustryMentor.findByIdAndUpdate(mentorId, {
        $addToSet: { accepted: studentId },
        $pull: { requests: studentId }, // Remove from requests if exists
      });
    } else if (mentorType === "college") {
      // Check if college mentor exists
      const collegeMentor = await CollegeMentor.findById(mentorId);
      if (!collegeMentor) {
        return res.status(404).json({
          success: false,
          message: "College mentor not found",
        });
      }

      // Check if mentor is already assigned
      if (student.collegeMentor.includes(mentorId)) {
        return res.status(400).json({
          success: false,
          message: "College mentor already assigned to this student",
        });
      }

      // Add mentor to student and student to mentor's accepted array
      await Student.findByIdAndUpdate(studentId, {
        $addToSet: { collegeMentor: mentorId },
      });

      await CollegeMentor.findByIdAndUpdate(mentorId, {
        $addToSet: { accepted: studentId },
        $pull: { requests: studentId }, // Remove from requests if exists
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor type. Must be 'industry' or 'college'",
      });
    }

    res.status(200).json({
      success: true,
      message: `${
        mentorType.charAt(0).toUpperCase() + mentorType.slice(1)
      } mentor assigned successfully`,
    });
  } catch (error) {
    console.error("Error adding mentor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.adminremoveMentorControl = async (req, res) => {
  try {
    const { studentId, mentorId, mentorType } = req.body;

    // Validate input
    if (!studentId || !mentorId || !mentorType) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Mentor ID, and Mentor Type are required",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (mentorType === "industry") {
      // Check if industry mentor exists
      const industryMentor = await IndustryMentor.findById(mentorId);
      if (!industryMentor) {
        return res.status(404).json({
          success: false,
          message: "Industry mentor not found",
        });
      }

      // Check if mentor is actually assigned
      if (!student.industryMentor.includes(mentorId)) {
        return res.status(400).json({
          success: false,
          message: "Industry mentor not assigned to this student",
        });
      }

      // Remove mentor from student and student from mentor's accepted array
      await Student.findByIdAndUpdate(studentId, {
        $pull: { industryMentor: mentorId },
      });

      await IndustryMentor.findByIdAndUpdate(mentorId, {
        $pull: { accepted: studentId },
      });
    } else if (mentorType === "college") {
      // Check if college mentor exists
      const collegeMentor = await CollegeMentor.findById(mentorId);
      if (!collegeMentor) {
        return res.status(404).json({
          success: false,
          message: "College mentor not found",
        });
      }

      // Check if mentor is actually assigned
      if (!student.collegeMentor.includes(mentorId)) {
        return res.status(400).json({
          success: false,
          message: "College mentor not assigned to this student",
        });
      }

      // Remove mentor from student and student from mentor's accepted array
      await Student.findByIdAndUpdate(studentId, {
        $pull: { collegeMentor: mentorId },
      });

      await CollegeMentor.findByIdAndUpdate(mentorId, {
        $pull: { accepted: studentId },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor type. Must be 'industry' or 'college'",
      });
    }

    res.status(200).json({
      success: true,
      message: `${
        mentorType.charAt(0).toUpperCase() + mentorType.slice(1)
      } mentor removed successfully`,
    });
  } catch (error) {
    console.error("Error removing mentor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteAccount = async(req,res)=>{
  try {
    const {studentId} = req.body
    const student = await Student.findByIdAndDelete(studentId)
    return res.status(200).send({message:"Deleted success"})
  } catch (error) {
       console.error("Error removing mentor:", error);
       res.status(500).json({
         success: false,
         message: "Internal server error",
         error: error.message,
       });
  }
}