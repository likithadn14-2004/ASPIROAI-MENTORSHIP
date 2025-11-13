import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCamera,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";

// Import components
import RoleSelector from "../components/register/RoleSelector";
import PhotoUpload from "../components/register/PhotoUpload";
import CommonFields from "../components/register/CommonFields";
import StudentFields from "../components/register/StudentFields";
import IndustryMentorFields from "../components/register/IndustryMentorFields";
import CollegeMentorFields from "../components/register/CollegeMentorFields";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Student fields
  const [usn, setUsn] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");

  // Industry Mentor fields
  const [designation, setDesignation] = useState("");
  const [areaOfExpertise, setAreaOfExpertise] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [state, setState] = useState("");

  // College Mentor fields
  const [collegeMentorCollegeName, setCollegeMentorCollegeName] = useState("");
  const [collegeMentorAreaOfExpertise, setCollegeMentorAreaOfExpertise] =
    useState("");
  const [collegeMentorYearsOfExperience, setCollegeMentorYearsOfExperience] =
    useState("");

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setProfilePhoto(file);

    // Upload to Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hg73yvrn");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/didyxuyd5/image/upload",
        formData
      );
      setProfilePhoto(response.data.secure_url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const sendToAdditionalAPI = async (role, data) => {
    try {
      if (role === "IndustryMentor") {
        await axios.post(
          "http://127.0.0.1:8001/api/store-industry-mentor",
          {
            name: data.name,
            email: data.email,
            designation: data.designation,
            area_of_expertise: data.areaOfExpertise,
            years_of_experience: parseInt(data.yearsOfExperience),
            state: data.state,
          },
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
      } else if (role === "CollegeMentor") {
        await axios.post(
          "http://127.0.0.1:8001/api/store-college-mentor",
          {
            name: data.name,
            email: data.email,
            college_name: data.collegeName,
            area_of_expertise: data.areaOfExpertise,
            years_of_experience: parseInt(data.yearsOfExperience),
          },
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error sending data to additional API:", error);
      // We don't throw an error here as this is a secondary operation
    }
  };

  const sendToFastAPI = async (role, data, faceImageFile) => {
    if (role !== "Student") return; // Only send student data to FastAPI

    try {
      const formData = new FormData();
      formData.append("student_id", data.usn); // Assuming USN is the student ID
      formData.append("name", data.name);
      formData.append("year", data.year);
      formData.append("department", data.department);
      formData.append("section", data.section || "A"); // Add section if you have it, or default
      formData.append("face_image", faceImageFile);

      await axios.post("http://127.0.0.1:8002/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error sending data to FastAPI:", error);
      // You might want to handle this error differently
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    if (role === "Admin") {
      setError("Admin registration is not allowed.");
      return;
    }

    // Role-specific validation
    if (
      role === "Student" &&
      (!usn ||
        !collegeName ||
        !phone ||
        !semester ||
        !year ||
        !course ||
        !department)
    ) {
      setError("Please fill in all required student fields.");
      return;
    }

    if (
      role === "IndustryMentor" &&
      (!designation || !areaOfExpertise || !yearsOfExperience || !state)
    ) {
      setError("Please fill in all required industry mentor fields.");
      return;
    }

    if (
      role === "CollegeMentor" &&
      (!collegeMentorCollegeName ||
        !collegeMentorAreaOfExpertise ||
        !collegeMentorYearsOfExperience)
    ) {
      setError("Please fill in all required college mentor fields.");
      return;
    }

    setLoading(true);

    try {
      let registerUrl = "";
      const data = {
        name,
        email,
        password,
        profilePhoto,
      };

      if (role === "Student") {
        registerUrl = "http://localhost:5000/student/register";
        data.usn = usn;
        data.collegeName = collegeName;
        data.phone = phone;
        data.semester = semester;
        data.year = year;
        data.course = course;
        data.department = department;
        data.branch = branch;
        data.cgpa = cgpa;
      } else if (role === "CollegeMentor") {
        registerUrl = "http://localhost:5000/collegeMentor/register";
        data.collegeName = collegeMentorCollegeName;
        data.areaOfExpertise = collegeMentorAreaOfExpertise;
        data.yearsOfExperience = collegeMentorYearsOfExperience;

        // Send to additional API
        await sendToAdditionalAPI(role, {
          name,
          email,
          collegeName: collegeMentorCollegeName,
          areaOfExpertise: collegeMentorAreaOfExpertise,
          yearsOfExperience: collegeMentorYearsOfExperience,
        });
      } else if (role === "IndustryMentor") {
        registerUrl = "http://localhost:5000/industryMentor/register";
        data.designation = designation;
        data.areaOfExpertise = areaOfExpertise;
        data.yearsOfExperience = yearsOfExperience;
        data.state = state;

        // Send to additional API
        await sendToAdditionalAPI(role, {
          name,
          email,
          designation,
          areaOfExpertise,
          yearsOfExperience,
          state,
        });
      }

      const registerResponse = await axios.post(registerUrl, data);

      // Then send to FastAPI for face registration (only for students)
      if (role === "Student" && profilePhoto) {
        // Convert profilePhoto URL to file if it's a URL, or use the file directly
        let faceImageFile;
        if (typeof profilePhoto === "string") {
          // If profilePhoto is a URL, fetch and convert to file
          const response = await fetch(profilePhoto);
          const blob = await response.blob();
          faceImageFile = new File([blob], "face_image.jpg", {
            type: "image/jpeg",
          });
        } else {
          // If profilePhoto is already a file
          faceImageFile = profilePhoto;
        }

        await sendToFastAPI(role, data, faceImageFile);
      }

      if (registerResponse?.data) {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Learning Community
              </h2>
              <p className="mb-8">
                Register as a student, industry mentor, or college mentor to
                access exclusive resources and opportunities.
              </p>
              <img
                src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg"
                alt="Education Illustration"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Select your role and provide your information
            </p>

            <RoleSelector role={role} setRole={setRole} />

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-red-500 text-center bg-red-50 py-2 px-4 rounded-lg">
                  {error}
                </p>
              )}

              <PhotoUpload
                previewUrl={previewUrl}
                uploading={uploading}
                triggerFileInput={triggerFileInput}
                fileInputRef={fileInputRef}
                handlePhotoUpload={handlePhotoUpload}
              />

              <CommonFields
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />

              {role === "Student" && (
                <StudentFields
                  usn={usn}
                  setUsn={setUsn}
                  collegeName={collegeName}
                  setCollegeName={setCollegeName}
                  phone={phone}
                  setPhone={setPhone}
                  semester={semester}
                  setSemester={setSemester}
                  year={year}
                  setYear={setYear}
                  course={course}
                  setCourse={setCourse}
                  department={department}
                  setDepartment={setDepartment}
                  branch={branch}
                  setBranch={setBranch}
                  cgpa={cgpa}
                  setCgpa={setCgpa}
                />
              )}

              {role === "IndustryMentor" && (
                <IndustryMentorFields
                  designation={designation}
                  setDesignation={setDesignation}
                  areaOfExpertise={areaOfExpertise}
                  setAreaOfExpertise={setAreaOfExpertise}
                  yearsOfExperience={yearsOfExperience}
                  setYearsOfExperience={setYearsOfExperience}
                  state={state}
                  setState={setState}
                />
              )}

              {role === "CollegeMentor" && (
                <CollegeMentorFields
                  collegeMentorCollegeName={collegeMentorCollegeName}
                  setCollegeMentorCollegeName={setCollegeMentorCollegeName}
                  collegeMentorAreaOfExpertise={collegeMentorAreaOfExpertise}
                  setCollegeMentorAreaOfExpertise={
                    setCollegeMentorAreaOfExpertise
                  }
                  collegeMentorYearsOfExperience={
                    collegeMentorYearsOfExperience
                  }
                  setCollegeMentorYearsOfExperience={
                    setCollegeMentorYearsOfExperience
                  }
                />
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-70"
                  disabled={loading || uploading}
                >
                  {loading ? (
                    "Creating Account..."
                  ) : uploading ? (
                    "Uploading Image..."
                  ) : (
                    <>
                      <FaCamera className="mr-2" /> Register Now
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:text-indigo-500 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
