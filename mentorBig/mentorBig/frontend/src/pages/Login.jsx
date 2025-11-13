import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
  FaUserShield,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "Admin") {
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("role","Admin")
        navigate("/adminStudents");
      } else {
        setErrorMessage("Invalid Admin Credentials");
        return;
      }
    }

    // Determine the backend URL based on the role
    let registerUrl = "";
    if (role === "Student") {
      registerUrl = "http://localhost:5000/student/login";
    } else if (role === "College Mentor") {
      registerUrl = "http://localhost:5000/collegeMentor/login";
    } else if (role === "Industry Mentor") {
      registerUrl = "http://localhost:5000/industryMentor/login";
    }

    try {
      // Send login request to backend
      const response = await axios.post(registerUrl, {
        email,
        password,
      });

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", role);

      // Navigate based on the role
      if (role === "Student") {
        navigate("/ats");
      } else if (role === "College Mentor") {
        navigate("/college-chats");
      } else if (role === "Industry Mentor") {
        navigate("/ind-chats");
      }
    } catch (error) {
      // Handle login error
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-3xl font-bold mb-4">
                Welcome Back to Our Learning Community
              </h2>
              <p className="mb-8">
                Sign in to continue your journey with personalized resources and
                mentorship opportunities.
              </p>
              <img
                src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?t=st=1743744820~exp=1743748420~hmac=5e55e42055b39a3225095390702bef58ce208a30d0443f3fce0bb417953a8b25&w=1380"
                alt="Login Illustration"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Sign in to your account to continue
            </p>

            {/* Role Selection */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap justify-center gap-2 bg-gray-100 p-2 rounded-lg">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md flex items-center transition-all ${
                    role === "Admin"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setRole("Admin")}
                >
                  <FaUserShield className="mr-2" /> Admin
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md flex items-center transition-all ${
                    role === "Student"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setRole("Student")}
                >
                  <FaUserGraduate className="mr-2" /> Student
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md flex items-center transition-all ${
                    role === "College Mentor"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setRole("College Mentor")}
                >
                  <FaChalkboardTeacher className="mr-2" /> College
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md flex items-center transition-all ${
                    role === "Industry Mentor"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setRole("Industry Mentor")}
                >
                  <FaBriefcase className="mr-2" /> Industry
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <p className="text-red-500 text-center bg-red-50 py-2 px-4 rounded-lg">
                  {errorMessage}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300"
                >
                  Sign In
                </button>
              </div>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account?
              <Link
                to="/register"
                className="text-indigo-600 font-medium hover:text-indigo-500 ml-1"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
