# Aspiro AI

### AI-Powered College Mentorship and Career Guidance System

Aspiro AI is an AI-powered mentorship and career guidance platform that connects students with academic and industry mentors. It provides personalized mentor matching, AI career guidance, resume analysis, career path planning, chatbot assistance, progress tracking, and mentor interaction.

## Features

- 🤝 AI-based academic and industry mentor matching
- 🤖 AI-powered career guidance chatbot
- 📄 Resume scoring and job description analysis
- 🧭 Personalized career path planning
- 📊 Student and mentor dashboards
- 📅 Mentor appointment and feedback management
- 🎯 Skill gap and career recommendations
- 💬 Student-mentor communication and feedback

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

### AI / Machine Learning

- Python
- FastAPI
- Scikit-learn
- NumPy
- Pandas
- Natural Language Processing (NLP)
- Cosine Similarity
- Google Gemini

## AI/ML Components

| Component | Purpose |
|---|---|
| Mentor Matching | Recommends suitable mentors based on student and mentor profiles |
| Resume Analysis | Evaluates resumes against job descriptions |
| AI Chatbot | Provides personalized career guidance |
| Skill Gap Analysis | Identifies areas for improvement |
| Career Recommendation | Suggests suitable career paths |

## System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                           │
│                                                              │
│  Students  │  College Mentors  │  Industry Mentors          │
│                                                              │
│  AI Chat │ Resume Upload │ Goal Tracking │ Dashboards        │
│  Notifications │ Mentor Interaction │ Progress Tracking      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                           │
│                                                              │
│  Authentication │ Role-Based Portals │ Dashboards            │
│  Task Management │ Resume Evaluation │ Mentor Interaction     │
│  Progress Tracking │ Notifications                           │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    REST APIs / HTTP
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                             │
│                                                              │
│  Authentication & Authorization                              │
│  Role-Based Access Control                                   │
│  Business Logic                                              │
│  Mentor-Student Matching                                     │
│  API Request Processing                                      │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
┌──────────────────────────────┐   ┌───────────────────────────┐
│       AI SERVICES LAYER      │   │      DATABASE LAYER       │
│                              │   │                           │
│  Google Gemini               │   │        MongoDB            │
│  NLP                         │   │                           │
│  Resume Analysis             │   │  User Profiles            │
│  Mentor Matching             │   │  Mentor Mappings          │
│  Skill Gap Detection         │   │  Chat Logs                │
│  Career Recommendations      │   │  Performance Metrics      │
└──────────────────────────────┘   │  Activity Records         │
                                   └───────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                    FILE STORAGE SYSTEM                        │
│                                                              │
│  Resumes │ Feedback Forms │ Supporting Files                │
└──────────────────────────────────────────────────────────────┘
````

## Project Structure

```text
ASPIROAI-MENTORSHIP/
├── frontend/
├── backend/
├── ml/
├── .gitignore
└── README.md
```

## How Aspiro AI Works

```text
Student Registration
        ↓
Student Profile Creation
        ↓
Academic & Career Information
        ↓
AI-Based Analysis
        ↓
┌───────────────────────────────┐
│                               │
▼                               ▼
Academic Mentor            Industry Mentor
Guidance                   AI Matching
│                               │
└──────────────┬────────────────┘
               ↓
       Personalized Guidance
               ↓
     Tasks + Feedback + Chat
               ↓
      Career & Skill Analysis
               ↓
      Career Path Recommendations
```

## Key AI Capabilities

### AI Mentor Matching

The system analyzes relevant student and mentor information to recommend suitable mentors based on skills, interests, expertise, and career goals.

### Resume Analysis

Students can upload their resume and a job description. The system analyzes the content and provides a resume score based on its relevance to the selected job.

### AI Career Guidance

The AI chatbot provides personalized guidance related to:

* Career options
* Skill development
* Projects
* Certifications
* Internships
* Placement preparation
* Higher education

### Career Path Planning

The system uses student skills, interests, and career goals to provide personalized career direction and learning recommendations.

## Future Enhancements

* Advanced predictive analytics
* Improved mentor recommendation models
* Voice-based AI interaction
* Advanced student analytics
* More personalized career recommendations
* Cloud deployment and scalability

## Project

**Aspiro AI: AI-Powered College Mentorship and Career Guidance System**

**Computer Science and Engineering - Artificial Intelligence & Machine Learning**

## Author

**Likitha**
