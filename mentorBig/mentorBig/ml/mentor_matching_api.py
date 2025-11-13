# Mentor-Student Matching API with Database Integration
# pip install fastapi uvicorn google-genai pydantic sqlalchemy

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
import json
import re
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Google Gemini
import google.generativeai as genai
from google.generativeai import types

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./mentor_matching.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class IndustryMentor(Base):
    __tablename__ = "industry_mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    designation = Column(String(200), nullable=False)
    area_of_expertise = Column(String(500), nullable=False)
    years_of_experience = Column(Integer, nullable=False)
    state = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CollegeMentor(Base):
    __tablename__ = "college_mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    college_name = Column(String(200), nullable=False)
    area_of_expertise = Column(String(500), nullable=False)
    years_of_experience = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class MatchingHistory(Base):
    __tablename__ = "matching_history"
    
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(100), nullable=False)
    student_usn = Column(String(50), nullable=False)
    student_college = Column(String(200), nullable=False)
    student_email = Column(String(100), nullable=False)
    student_phone = Column(String(20), nullable=False)
    semester = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    course = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    branch = Column(String(100), nullable=True)
    cgpa = Column(Float, nullable=True)
    mentor_type_selected = Column(String(20), nullable=False)  # 'industry' or 'college'
    matched_mentors_json = Column(Text, nullable=False)  # JSON string of matched mentors
    similarity_scores_json = Column(Text, nullable=False)  # JSON string of similarity scores
    matching_timestamp = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Mentor-Student Matching API",
    description="AI-powered mentor matching system for students",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for API
class IndustryMentorCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    designation: str = Field(..., min_length=1, max_length=200)
    area_of_expertise: str = Field(..., min_length=1, max_length=500)
    years_of_experience: int = Field(..., ge=0, le=50)
    state: str = Field(..., min_length=1, max_length=50)

class CollegeMentorCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    college_name: str = Field(..., min_length=1, max_length=200)
    area_of_expertise: str = Field(..., min_length=1, max_length=500)
    years_of_experience: int = Field(..., ge=0, le=50)

class StudentInput(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    usn: str = Field(..., min_length=1, max_length=50)
    college_name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    phone_number: str = Field(..., min_length=10, max_length=20)
    semester: int = Field(..., ge=1, le=8)
    year: int = Field(..., ge=1, le=4)
    course: str = Field(..., min_length=1, max_length=100)
    department_name: str = Field(..., min_length=1, max_length=100)
    branch: Optional[str] = Field(None, max_length=100)
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    mentor_type: str = Field(..., pattern=r'^(industry|college)$')

class MentorResponse(BaseModel):
    id: int
    name: str
    email: str
    area_of_expertise: str
    years_of_experience: int
    similarity_score: float
    similarity_reasons: List[str]
    # Additional fields based on mentor type
    designation: Optional[str] = None  # For industry mentors
    state: Optional[str] = None  # For industry mentors
    college_name: Optional[str] = None  # For college mentors

class StudentMatchResponse(BaseModel):
    student_details: StudentInput
    matched_mentors: List[MentorResponse]
    total_mentors_in_database: int
    mentor_type_searched: str
    matching_timestamp: datetime

# Initialize Gemini Client
def get_gemini_client():
    """Initialize Google Gemini client"""
    api_key = "AIzaSyDcT4F8MDrWgLBpK2JUvpHQDSDzxUAbWao"
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set")
    return genai.Client(api_key=api_key)

def generate_with_gemini(prompt: str) -> str:
    """Generate content using Google Gemini"""
    try:
        client = get_gemini_client()
        model = "gemini-2.5-flash"
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )
        
        response_chunks = []
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            response_chunks.append(chunk.text)
        
        return "".join(response_chunks)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Gemini: {str(e)}")

def analyze_student_mentor_similarity(student: StudentInput, mentors: List, mentor_type: str) -> List[MentorResponse]:
    """Analyze similarity between student and mentors using AI"""
    
    if not mentors:
        return []
    
    # Prepare mentor data
    mentors_data = []
    for mentor in mentors:
        mentor_data = {
            "id": mentor.id,
            "name": mentor.name,
            "email": mentor.email,
            "area_of_expertise": mentor.area_of_expertise,
            "years_of_experience": mentor.years_of_experience
        }
        if mentor_type == "industry":
            mentor_data["designation"] = mentor.designation
            mentor_data["state"] = mentor.state
        else:
            mentor_data["college_name"] = mentor.college_name
        
        mentors_data.append(mentor_data)
    
    # Create AI prompt
    prompt = f"""
Analyze the compatibility between a student and mentors for a mentoring relationship.

Student Profile:
- Name: {student.name}
- Course: {student.course}
- Department: {student.department_name}
- Branch: {student.branch or 'Not specified'}
- Semester: {student.semester}
- Year: {student.year}
- CGPA: {student.cgpa or 'Not provided'}
- College: {student.college_name}

Mentors to Match ({mentor_type} mentors):
{json.dumps(mentors_data, indent=2)}

For each mentor, calculate a compatibility score (0.0 to 1.0) based on:
1. Relevance of mentor's expertise to student's field of study
2. Appropriate experience level for student's academic stage
3. Geographic proximity (if applicable for industry mentors)
4. Overall mentoring potential

Only include mentors with compatibility score >= 0.4

For each compatible mentor, provide:
1. Mentor ID
2. Compatibility Score (decimal between 0.0 and 1.0)
3. Reasons for compatibility (2-4 specific reasons)

Format response as JSON:
{{
  "compatible_mentors": [
    {{
      "mentor_id": 1,
      "compatibility_score": 0.85,
      "reasons": ["Expertise in student's field", "Appropriate experience level", "Good mentoring potential"]
    }}
  ]
}}

Only return valid JSON. No explanatory text outside JSON.
"""
    
    # Get AI analysis
    try:
        ai_response = generate_with_gemini(prompt)
        
        # Parse JSON response
        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            analysis_result = json.loads(json_str)
        else:
            raise ValueError("No valid JSON in AI response")
        
        # Convert to MentorResponse objects
        compatible_mentors = []
        
        for result in analysis_result.get("compatible_mentors", []):
            mentor_id = result.get("mentor_id")
            score = float(result.get("compatibility_score", 0.0))
            reasons = result.get("reasons", [])
            
            # Find original mentor
            original_mentor = None
            for mentor in mentors:
                if mentor.id == mentor_id:
                    original_mentor = mentor
                    break
            
            if original_mentor and score >= 0.4:
                mentor_response = MentorResponse(
                    id=original_mentor.id,
                    name=original_mentor.name,
                    email=original_mentor.email,
                    area_of_expertise=original_mentor.area_of_expertise,
                    years_of_experience=original_mentor.years_of_experience,
                    similarity_score=score,
                    similarity_reasons=reasons
                )
                
                # Add type-specific fields
                if mentor_type == "industry":
                    mentor_response.designation = original_mentor.designation
                    mentor_response.state = original_mentor.state
                else:
                    mentor_response.college_name = original_mentor.college_name
                
                compatible_mentors.append(mentor_response)
        
        # Sort by score and return top 3
        compatible_mentors.sort(key=lambda x: x.similarity_score, reverse=True)
        return compatible_mentors[:3]
        
    except Exception as e:
        print(f"AI analysis failed, using fallback: {e}")
        return fallback_mentor_matching(student, mentors, mentor_type)

def fallback_mentor_matching(student: StudentInput, mentors: List, mentor_type: str) -> List[MentorResponse]:
    """Fallback matching using keyword similarity"""
    compatible_mentors = []
    
    student_keywords = set((student.course + " " + student.department_name + " " + (student.branch or "")).lower().split())
    
    for mentor in mentors:
        mentor_keywords = set(mentor.area_of_expertise.lower().split())
        
        # Calculate keyword overlap
        overlap = len(student_keywords.intersection(mentor_keywords))
        total_keywords = len(student_keywords.union(mentor_keywords))
        
        if total_keywords > 0:
            score = overlap / total_keywords
            
            if score >= 0.3:  # Lower threshold for fallback
                mentor_response = MentorResponse(
                    id=mentor.id,
                    name=mentor.name,
                    email=mentor.email,
                    area_of_expertise=mentor.area_of_expertise,
                    years_of_experience=mentor.years_of_experience,
                    similarity_score=score,
                    similarity_reasons=[f"Keyword overlap in expertise area"]
                )
                
                if mentor_type == "industry":
                    mentor_response.designation = mentor.designation
                    mentor_response.state = mentor.state
                else:
                    mentor_response.college_name = mentor.college_name
                
                compatible_mentors.append(mentor_response)
    
    compatible_mentors.sort(key=lambda x: x.similarity_score, reverse=True)
    return compatible_mentors[:3]

# API Endpoints

@app.post("/api/store-industry-mentor")
async def store_industry_mentor(mentor: IndustryMentorCreate, db: Session = Depends(get_db)):
    """Store a new industry mentor"""
    try:
        # Check if email already exists
        existing_mentor = db.query(IndustryMentor).filter(IndustryMentor.email == mentor.email).first()
        if existing_mentor:
            raise HTTPException(status_code=400, detail="Mentor with this email already exists")
        
        # Create new mentor
        db_mentor = IndustryMentor(
            name=mentor.name,
            email=mentor.email,
            designation=mentor.designation,
            area_of_expertise=mentor.area_of_expertise,
            years_of_experience=mentor.years_of_experience,
            state=mentor.state
        )
        
        db.add(db_mentor)
        db.commit()
        db.refresh(db_mentor)
        
        return {
            "message": "Industry mentor stored successfully",
            "mentor_id": db_mentor.id,
            "mentor_name": db_mentor.name,
            "stored_at": db_mentor.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error storing mentor: {str(e)}")

@app.post("/api/store-college-mentor")
async def store_college_mentor(mentor: CollegeMentorCreate, db: Session = Depends(get_db)):
    """Store a new college mentor"""
    try:
        # Check if email already exists
        existing_mentor = db.query(CollegeMentor).filter(CollegeMentor.email == mentor.email).first()
        if existing_mentor:
            raise HTTPException(status_code=400, detail="Mentor with this email already exists")
        
        # Create new mentor
        db_mentor = CollegeMentor(
            name=mentor.name,
            email=mentor.email,
            college_name=mentor.college_name,
            area_of_expertise=mentor.area_of_expertise,
            years_of_experience=mentor.years_of_experience
        )
        
        db.add(db_mentor)
        db.commit()
        db.refresh(db_mentor)
        
        return {
            "message": "College mentor stored successfully",
            "mentor_id": db_mentor.id,
            "mentor_name": db_mentor.name,
            "stored_at": db_mentor.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error storing mentor: {str(e)}")

@app.post("/api/match-student", response_model=StudentMatchResponse)
async def match_student(student: StudentInput, db: Session = Depends(get_db)):
    """Match student with mentors and store matching history"""
    try:
        # Get mentors based on type
        if student.mentor_type == "industry":
            mentors = db.query(IndustryMentor).all()
        else:
            mentors = db.query(CollegeMentor).all()
        
        if not mentors:
            raise HTTPException(status_code=404, detail=f"No {student.mentor_type} mentors found in database")
        
        # Analyze similarity
        matched_mentors = analyze_student_mentor_similarity(student, mentors, student.mentor_type)
        
        # Prepare data for history storage
        matched_mentors_data = []
        similarity_scores = []
        
        for mentor in matched_mentors:
            mentor_data = {
                "id": mentor.id,
                "name": mentor.name,
                "email": mentor.email,
                "area_of_expertise": mentor.area_of_expertise,
                "years_of_experience": mentor.years_of_experience,
                "designation": mentor.designation if student.mentor_type == "industry" else None,
                "state": mentor.state if student.mentor_type == "industry" else None,
                "college_name": mentor.college_name if student.mentor_type == "college" else None
            }
            matched_mentors_data.append(mentor_data)
            
            similarity_scores.append({
                "mentor_id": mentor.id,
                "score": mentor.similarity_score,
                "reasons": mentor.similarity_reasons
            })
        
        # Store in matching history
        history_record = MatchingHistory(
            student_name=student.name,
            student_usn=student.usn,
            student_college=student.college_name,
            student_email=student.email,
            student_phone=student.phone_number,
            semester=student.semester,
            year=student.year,
            course=student.course,
            department=student.department_name,
            branch=student.branch,
            cgpa=student.cgpa,
            mentor_type_selected=student.mentor_type,
            matched_mentors_json=json.dumps(matched_mentors_data),
            similarity_scores_json=json.dumps(similarity_scores)
        )
        
        db.add(history_record)
        db.commit()
        
        # Return response
        return StudentMatchResponse(
            student_details=student,
            matched_mentors=matched_mentors,
            total_mentors_in_database=len(mentors),
            mentor_type_searched=student.mentor_type,
            matching_timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error in student matching: {str(e)}")

@app.get("/api/matching-history")
async def get_all_matching_history(db: Session = Depends(get_db)):
    """Get all matching history"""
    try:
        history = db.query(MatchingHistory).order_by(MatchingHistory.matching_timestamp.desc()).all()
        
        result = []
        for record in history:
            result.append({
                "id": record.id,
                "student_name": record.student_name,
                "student_usn": record.student_usn,
                "student_college": record.student_college,
                "course": record.course,
                "department": record.department,
                "mentor_type_selected": record.mentor_type_selected,
                "matched_mentors_count": len(json.loads(record.matched_mentors_json)),
                "matching_timestamp": record.matching_timestamp
            })
        
        return {
            "total_matches": len(result),
            "matching_history": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.get("/api/matching-history/{student_usn}")
async def get_student_matching_history(student_usn: str, db: Session = Depends(get_db)):
    """Get matching history for specific student"""
    try:
        history = db.query(MatchingHistory).filter(
            MatchingHistory.student_usn == student_usn
        ).order_by(MatchingHistory.matching_timestamp.desc()).all()
        
        if not history:
            raise HTTPException(status_code=404, detail="No matching history found for this student")
        
        result = []
        for record in history:
            matched_mentors = json.loads(record.matched_mentors_json)
            similarity_scores = json.loads(record.similarity_scores_json)
            
            result.append({
                "matching_id": record.id,
                "student_details": {
                    "name": record.student_name,
                    "usn": record.student_usn,
                    "college": record.student_college,
                    "email": record.student_email,
                    "course": record.course,
                    "department": record.department,
                    "semester": record.semester,
                    "cgpa": record.cgpa
                },
                "mentor_type_searched": record.mentor_type_selected,
                "matched_mentors": matched_mentors,
                "similarity_scores": similarity_scores,
                "matching_timestamp": record.matching_timestamp
            })
        
        return {
            "student_usn": student_usn,
            "total_matches": len(result),
            "matching_history": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student history: {str(e)}")

@app.get("/api/mentors/industry")
async def get_industry_mentors(db: Session = Depends(get_db)):
    """Get all industry mentors"""
    try:
        mentors = db.query(IndustryMentor).order_by(IndustryMentor.created_at.desc()).all()
        
        result = []
        for mentor in mentors:
            result.append({
                "id": mentor.id,
                "name": mentor.name,
                "email": mentor.email,
                "designation": mentor.designation,
                "area_of_expertise": mentor.area_of_expertise,
                "years_of_experience": mentor.years_of_experience,
                "state": mentor.state,
                "created_at": mentor.created_at
            })
        
        return {
            "total_industry_mentors": len(result),
            "mentors": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching industry mentors: {str(e)}")

@app.get("/api/mentors/college")
async def get_college_mentors(db: Session = Depends(get_db)):
    """Get all college mentors"""
    try:
        mentors = db.query(CollegeMentor).order_by(CollegeMentor.created_at.desc()).all()
        
        result = []
        for mentor in mentors:
            result.append({
                "id": mentor.id,
                "name": mentor.name,
                "email": mentor.email,
                "college_name": mentor.college_name,
                "area_of_expertise": mentor.area_of_expertise,
                "years_of_experience": mentor.years_of_experience,
                "created_at": mentor.created_at
            })
        
        return {
            "total_college_mentors": len(result),
            "mentors": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching college mentors: {str(e)}")

@app.get("/api/database-stats")
async def get_database_stats(db: Session = Depends(get_db)):
    """Get database statistics"""
    try:
        industry_count = db.query(IndustryMentor).count()
        college_count = db.query(CollegeMentor).count()
        matching_count = db.query(MatchingHistory).count()
        
        return {
            "database_statistics": {
                "total_industry_mentors": industry_count,
                "total_college_mentors": college_count,
                "total_matching_records": matching_count,
                "total_mentors": industry_count + college_count
            },
            "last_updated": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching database stats: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        db_status = "connected"
        
        # Test Gemini connection
        try:
            client = get_gemini_client()
            gemini_status = "available"
        except:
            gemini_status = "unavailable"
        
        return {
            "status": "healthy",
            "service": "Mentor-Student Matching API",
            "version": "2.0.0",
            "timestamp": datetime.now(),
            "database": {
                "status": db_status,
                "type": "SQLite",
                "file": "mentor_matching.db"
            },
            "external_services": {
                "google_gemini": gemini_status
            },
            "features": [
                "Industry mentor storage",
                "College mentor storage", 
                "AI-powered student-mentor matching",
                "Matching history tracking",
                "Database statistics"
            ]
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now()
        }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Mentor-Student Matching API",
        "version": "2.0.0",
        "description": "AI-powered mentor matching system with database storage",
        "features": [
            "🏭 Store Industry Mentors (name, email, designation, expertise, experience, state)",
            "🎓 Store College Mentors (name, email, college, expertise, experience)",
            "👨‍🎓 Student Matching with AI analysis",
            "📊 Matching History Storage & Retrieval",
            "🔍 View All Mentors by Type",
            "📈 Database Statistics"
        ],
        "api_endpoints": {
            "store_industry_mentor": "/api/store-industry-mentor",
            "store_college_mentor": "/api/store-college-mentor",
            "match_student": "/api/match-student",
            "matching_history": "/api/matching-history",
            "student_history": "/api/matching-history/{student_usn}",
            "industry_mentors": "/api/mentors/industry",
            "college_mentors": "/api/mentors/college",
            "database_stats": "/api/database-stats"
        },
        "database": {
            "type": "SQLite",
            "file": "mentor_matching.db",
            "tables": ["industry_mentors", "college_mentors", "matching_history"]
        },
        "usage_flow": [
            "1. Store industry/college mentors using respective endpoints",
            "2. Submit student details with mentor type preference",
            "3. Get top 3 matching mentors with AI similarity scores",
            "4. View matching history and database statistics"
        ],
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)