import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserShield,
  FaQuestionCircle,
  FaUsers,
  FaUniversity,
  FaRegCalendarAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <FaGraduationCap className="text-indigo-400 mr-3 text-xl" />
              <h3 className="text-lg font-bold">Aspiro AI</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bridging the gap between mentors and students through innovative
              education technology and personalized learning experiences.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <FaUniversity className="text-indigo-400" />
              <span>Established 2023</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center mb-4">
              <FaChalkboardTeacher className="text-indigo-400 mr-3 text-xl" />
              <h3 className="text-lg font-bold">For Students</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="/find-mentors"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Find Mentors
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Browse Courses
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Learning Resources
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Upcoming Events
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center mb-4">
              <FaBookOpen className="text-indigo-400 mr-3 text-xl" />
              <h3 className="text-lg font-bold">Resources</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="/blog"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Blog & Articles
                </a>
              </li>
              <li>
                <a
                  href="/research"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Research Papers
                </a>
              </li>
              <li>
                <a
                  href="/webinars"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Webinar Archive
                </a>
              </li>
              <li>
                <a
                  href="/career-guides"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Career Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <div className="flex items-center mb-4">
              <FaUserShield className="text-indigo-400 mr-3 text-xl" />
              <h3 className="text-lg font-bold">Support</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-300 transition-colors"></span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 mb-6"></div>

        {/* Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <p className="text-gray-500 text-sm mb-2 md:mb-0 md:mr-4">
              &copy; {new Date().getFullYear()} EduMentor Platform. All rights
              reserved.
            </p>
            <div className="flex items-center text-gray-500 text-sm">
              <FaRegCalendarAlt className="mr-1" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex space-x-5">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-300 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
