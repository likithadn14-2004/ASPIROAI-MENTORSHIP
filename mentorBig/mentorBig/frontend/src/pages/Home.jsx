import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineSchedule,
  AiOutlineCheckCircle,
  AiOutlineNotification,
  AiOutlineTrophy,
  AiOutlineRobot,
  AiOutlineCamera,
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineTeam,
} from "react-icons/ai";

const Home = () => {
  return (
    <>
      <Header />

      <div className="overflow-hidden bg-gray-900">
        {/* Hero Section */}
        <div className="relative h-screen w-full">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Mentorship program hero"
          />
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transformative Mentorship Platform
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Connecting students with mentors for skill development, career
              guidance, and personalized growth tracking in an interactive
              ecosystem.
            </p>
            <div className="flex gap-4">
              <a
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Get Started
              </a>
              <span className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 border border-gray-600">
                Learn More
              </span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-indigo-400">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1: Role-based System */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineTeam className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Four Role System
                </h3>
                <p className="text-gray-300">
                  Dedicated interfaces for Students, Admins, College Mentors,
                  and Industry Mentors with role-specific functionalities.
                </p>
              </div>

              {/* Feature 2: AI Chatbot */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineRobot className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  AI Chatbot Support
                </h3>
                <p className="text-gray-300">
                  Intelligent chatbot provides immediate assistance when mentors
                  are unavailable, ensuring continuous support.
                </p>
              </div>

              {/* Feature 3: Face Recognition */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineCamera className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Face Recognition Attendance
                </h3>
                <p className="text-gray-300">
                  Secure and convenient attendance system using facial
                  recognition technology for mentorship sessions.
                </p>
              </div>

              {/* Feature 4: Skills Tracking */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineCheckCircle className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Skills Recommendation
                </h3>
                <p className="text-gray-300">
                  Personalized skill development recommendations based on career
                  goals and industry requirements.
                </p>
              </div>

              {/* Feature 5: Gamification */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineTrophy className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Gamification & Badges
                </h3>
                <p className="text-gray-300">
                  Earn badges and rewards for completing mentor-assigned tasks,
                  creating an engaging learning experience.
                </p>
              </div>

              {/* Feature 6: Career Guidance */}
              <div className="bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                <div className="bg-indigo-900 p-4 rounded-full mb-4">
                  <AiOutlineSolution className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Career Guidance
                </h3>
                <p className="text-gray-300">
                  Industry mentors provide valuable insights and guidance for
                  career planning and professional development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h3 className="text-5xl font-bold text-indigo-400 mb-2">
                  5,000+
                </h3>
                <p className="text-gray-300 text-lg">Active Students</p>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h3 className="text-5xl font-bold text-indigo-400 mb-2">
                  200+
                </h3>
                <p className="text-gray-300 text-lg">Industry Mentors</p>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h3 className="text-5xl font-bold text-indigo-400 mb-2">
                  10,000+
                </h3>
                <p className="text-gray-300 text-lg">Completed Sessions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-indigo-400">
              Comprehensive Mentorship Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600">
                <div className="flex items-center mb-4">
                  <AiOutlineDashboard className="text-3xl text-indigo-400 mr-4" />
                  <h3 className="text-2xl font-semibold text-white">
                    Role-specific Dashboards
                  </h3>
                </div>
                <p className="text-gray-300">
                  Customized dashboards for each user role - Students track
                  progress, Mentors manage sessions, and Admins oversee the
                  entire ecosystem.
                </p>
              </div>

              <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600">
                <div className="flex items-center mb-4">
                  <AiOutlineSchedule className="text-3xl text-indigo-400 mr-4" />
                  <h3 className="text-2xl font-semibold text-white">
                    Mentor Appointment System
                  </h3>
                </div>
                <p className="text-gray-300">
                  Easy scheduling system for students to book 1:1 sessions with
                  mentors based on availability and area of expertise.
                </p>
              </div>

              <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600">
                <div className="flex items-center mb-4">
                  <AiOutlineNotification className="text-3xl text-indigo-400 mr-4" />
                  <h3 className="text-2xl font-semibold text-white">
                    Real-time Notifications
                  </h3>
                </div>
                <p className="text-gray-300">
                  Stay updated with instant alerts for session reminders, task
                  deadlines, mentor feedback, and important announcements.
                </p>
              </div>

              <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600">
                <div className="flex items-center mb-4">
                  <AiOutlineFileText className="text-3xl text-indigo-400 mr-4" />
                  <h3 className="text-2xl font-semibold text-white">
                    ATS Resume Analysis
                  </h3>
                </div>
                <p className="text-gray-300">
                  Get your resume scored by Applicant Tracking System standards
                  with detailed feedback to improve your job application
                  success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-900 to-indigo-700">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Join Our Mentorship Community
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Whether you're seeking guidance or looking to share your
              expertise, our platform connects you with the right people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                I'm a Student
              </a>
              <a
                href="/register"
                className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                I'm a College Mentor
              </a>
              <a
                href="/register"
                className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                I'm an Industry Mentor
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
