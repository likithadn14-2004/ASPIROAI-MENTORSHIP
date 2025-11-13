import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CareerGuidance from "./pages/student/CareerGuidance";
import Chatbot from "./pages/student/Chatbot";
import RecommendSkills from "./pages/student/RecommendSkills";
import ResumeScore from "./pages/student/ResumeScore";
import AllCollegeMentors from "./pages/student/AllCollegeMentors";
import AllIndustryMentors from "./pages/student/AllIndustryMentors";
import Chat from "./pages/student/Chat";
import IndChats from "./pages/industry/IndChats";
import CollegeChats from "./pages/college/CollegeChats";
import AddTask from "./pages/college/AddTask";
import Tasks from "./pages/student/Tasks";
import Profile from "./pages/student/Profile";
import AddFace from "./pages/student/AddFace";
import CollegeFeedBack from "./pages/college/CollegeFeedBack";
import IndProfile from "./pages/industry/IndProfile";
import Students from "./pages/admin/Students";
import CollegeMentors from "./pages/admin/CollegeMentors";
import IndustrtMentors from "./pages/admin/IndustrtMentors";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/career" element={<CareerGuidance />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/college-chats" element={<CollegeChats />} />
          <Route path="/ind-chats" element={<IndChats />} />
          <Route path="/recommendSkills" element={<RecommendSkills />} />
          <Route path="/ats" element={<ResumeScore />} />
          <Route path="/allCollegeMentors" element={<AllCollegeMentors />} />
          <Route path="/allIndustryMentors" element={<AllIndustryMentors />} />
          <Route path="/addTask" element={<AddTask />} />
          <Route path="/allTask" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addFace" element={<AddFace />} />
          <Route path="/collegeFeedback" element={<CollegeFeedBack />} />
          <Route path="/indFeedback" element={<IndProfile />} />

          <Route path="/adminStudents" element={<Students />} />
          <Route path="/adminCollege" element={<CollegeMentors />} />
          <Route path="/adminIndustry" element={<IndustrtMentors />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
