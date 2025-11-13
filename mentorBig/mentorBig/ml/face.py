# import os
# import shutil
# import pickle
# import numpy as np
# from typing import List
# from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import face_recognition
# import cv2
# import uvicorn
# from pydantic import BaseModel
# import tempfile
# import uuid

# # Create FastAPI app
# app = FastAPI(title="Face Recognition API")

# # Add CORS middleware to allow cross-origin requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Create directories to store face data
# os.makedirs("face_database/images", exist_ok=True)
# os.makedirs("face_database/encodings", exist_ok=True)

# # Path to the face encodings database
# FACE_ENCODINGS_PATH = "face_database/encodings/encodings.pkl"

# # Initialize face encodings database if it doesn't exist
# if not os.path.exists(FACE_ENCODINGS_PATH):
#     # Create an empty dictionary: {name: face_encoding}
#     empty_db = {}
#     with open(FACE_ENCODINGS_PATH, "wb") as f:
#         pickle.dump(empty_db, f)

# def extract_face_encoding(image_path, model="hog"):
#     """Extract face encoding from an image."""
#     try:
#         # Read the image with OpenCV first
#         image = cv2.imread(image_path)
#         if image is None:
#             raise HTTPException(status_code=400, detail="Could not read image file.")
        
#         # Convert BGR to RGB (face_recognition uses RGB)
#         rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
#         # Find all face locations in the image (using HOG by default, CNN is more accurate but slower)
#         face_locations = face_recognition.face_locations(rgb_image, model=model)
        
#         if not face_locations:
#             raise HTTPException(status_code=400, detail="No face detected in the image.")
        
#         if len(face_locations) > 1:
#             raise HTTPException(status_code=400, detail="Multiple faces detected. Please provide an image with only one face.")
        
#         # Compute face encodings
#         face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
#         # Return the first face encoding
#         return face_encodings[0]
    
#     except Exception as e:
#         if isinstance(e, HTTPException):
#             raise e
#         raise HTTPException(status_code=500, detail=f"Error extracting face encoding: {str(e)}")

# def compare_faces(encoding1, encoding2, tolerance=0.6):
#     """Compare two face encodings."""
#     if encoding1 is None or encoding2 is None:
#         return False, 0.0
    
#     # Calculate face distance
#     face_distance = face_recognition.face_distance([encoding1], encoding2)[0]
    
#     # Convert distance to similarity score (1 - distance)
#     similarity = 1.0 - face_distance
    
#     # Check if faces match based on tolerance
#     is_match = face_distance <= tolerance
    
#     return is_match, similarity

# @app.post("/register")
# async def register_face(
#     name: str = Form(...),
#     face_image: UploadFile = File(...)
# ):
#     """Register a new face with associated name."""
#     # Check if the uploaded file is an image
#     if not face_image.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
#     # Save the uploaded image temporarily
#     image_extension = os.path.splitext(face_image.filename)[1]
#     with tempfile.NamedTemporaryFile(delete=False, suffix=image_extension) as temp_file:
#         temp_file_path = temp_file.name
#         content = await face_image.read()
#         temp_file.write(content)
    
#     try:
#         # Extract face encoding
#         face_encoding = extract_face_encoding(temp_file_path)
        
#         # Load existing face database
#         with open(FACE_ENCODINGS_PATH, "rb") as f:
#             face_db = pickle.load(f)
        
#         # Check if the name already exists
#         if name in face_db:
#             os.unlink(temp_file_path)
#             raise HTTPException(status_code=400, detail=f"A face for '{name}' already exists.")
        
#         # Generate unique filename for the face image
#         unique_filename = f"{uuid.uuid4()}{image_extension}"
#         image_path = f"face_database/images/{unique_filename}"
        
#         # Save the face image to the database directory
#         shutil.move(temp_file_path, image_path)
        
#         # Add the new face encoding to the database
#         face_db[name] = {
#             "encoding": face_encoding,
#             "image_path": image_path
#         }
        
#         # Save the updated database
#         with open(FACE_ENCODINGS_PATH, "wb") as f:
#             pickle.dump(face_db, f)
        
#         return JSONResponse(
#             content={"message": f"Face for '{name}' registered successfully."},
#             status_code=201
#         )
    
#     except Exception as e:
#         # Clean up the temporary file
#         if os.path.exists(temp_file_path):
#             os.unlink(temp_file_path)
        
#         if isinstance(e, HTTPException):
#             raise e
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/detect")
# async def detect_face(face_image: UploadFile = File(...)):
#     """Detect and match a face against registered faces."""
#     # Check if the uploaded file is an image
#     if not face_image.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
#     # Save the uploaded image temporarily
#     image_extension = os.path.splitext(face_image.filename)[1]
#     with tempfile.NamedTemporaryFile(delete=False, suffix=image_extension) as temp_file:
#         temp_file_path = temp_file.name
#         content = await face_image.read()
#         temp_file.write(content)
    
#     try:
#         # Extract face encoding
#         face_encoding = extract_face_encoding(temp_file_path)
        
#         # Load face database
#         with open(FACE_ENCODINGS_PATH, "rb") as f:
#             face_db = pickle.load(f)
        
#         if not face_db:
#             os.unlink(temp_file_path)
#             raise HTTPException(status_code=404, detail="No registered faces found.")
        
#         # Compare with registered faces
#         matches = []
#         for name, data in face_db.items():
#             registered_encoding = data["encoding"]
#             is_match, similarity = compare_faces(registered_encoding, face_encoding)
#             if is_match:
#                 matches.append({"name": name, "similarity": similarity})
        
#         # Clean up the temporary file
#         os.unlink(temp_file_path)
        
#         if matches:
#             # Sort matches by similarity (descending)
#             matches.sort(key=lambda x: x["similarity"], reverse=True)
#             best_match = matches[0]
            
#             return JSONResponse(
#                 content={
#                     "matched": True,
#                     "name": best_match["name"],
#                     "similarity": float(best_match["similarity"]),  # Convert numpy float to Python float
#                     "message": f"Face matched with '{best_match['name']}' (similarity: {best_match['similarity']:.2f})"
#                 }
#             )
#         else:
#             return JSONResponse(
#                 content={
#                     "matched": False,
#                     "message": "No matching face found."
#                 }
#             )
    
#     except Exception as e:
#         # Clean up the temporary file
#         if os.path.exists(temp_file_path):
#             os.unlink(temp_file_path)
        
#         if isinstance(e, HTTPException):
#             raise e
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/faces")
# async def list_faces():
#     """List all registered faces."""
#     try:
#         # Load the face database
#         with open(FACE_ENCODINGS_PATH, "rb") as f:
#             face_db = pickle.load(f)
        
#         return JSONResponse(
#             content={"faces": list(face_db.keys())}
#         )
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.delete("/face/{name}")
# async def delete_face(name: str):
#     """Delete a registered face."""
#     try:
#         # Load the face database
#         with open(FACE_ENCODINGS_PATH, "rb") as f:
#             face_db = pickle.load(f)
        
#         # Check if the name exists
#         if name not in face_db:
#             raise HTTPException(status_code=404, detail=f"No face registered for '{name}'.")
        
#         # Get the image path
#         image_path = face_db[name]["image_path"]
        
#         # Delete the image file if it exists
#         if os.path.exists(image_path):
#             os.remove(image_path)
        
#         # Delete the face from the database
#         del face_db[name]
        
#         # Save the updated database
#         with open(FACE_ENCODINGS_PATH, "wb") as f:
#             pickle.dump(face_db, f)
        
#         return JSONResponse(
#             content={"message": f"Face for '{name}' deleted successfully."}
#         )
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     uvicorn.run("face_recognition_app:app", host="0.0.0.0", port=8000, reload=True)

import os
import shutil
import pickle
import numpy as np
import csv
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import cv2
import uvicorn
import tempfile
import uuid
from typing import Optional
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(title="College Face Recognition Attendance System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("face_database/images", exist_ok=True)
os.makedirs("face_database/encodings", exist_ok=True)
os.makedirs("attendance_records", exist_ok=True)

# Path to the face encodings database
FACE_ENCODINGS_PATH = "face_database/encodings/encodingsnew.pkl"

# Initialize database if it doesn't exist
if not os.path.exists(FACE_ENCODINGS_PATH):
    with open(FACE_ENCODINGS_PATH, "wb") as f:
        pickle.dump({}, f)

class StudentInfo(BaseModel):
    year: str
    department: str
    section: str

def extract_face_encodings(image_path):
    """Extract all face encodings from an image."""
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise HTTPException(status_code=400, detail="Could not read image file.")
        
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        return face_encodings, face_locations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

def compare_faces(encoding1, encoding2, tolerance=0.6):
    """Compare two face encodings."""
    face_distance = face_recognition.face_distance([encoding1], encoding2)[0]
    similarity = 1.0 - face_distance
    is_match = face_distance <= tolerance
    return is_match, similarity

def get_attendance_file_path(year: str, department: str, section: str):
    """Generate file path for attendance CSV."""
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"attendance_{year}_{department}_{section}_{today}.csv"
    return os.path.join("attendance_records", filename)

def initialize_attendance_file(year: str, department: str, section: str):
    """Initialize attendance file if it doesn't exist."""
    file_path = get_attendance_file_path(year, department, section)
    if not os.path.exists(file_path):
        with open(file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Student ID', 'Name', 'Time', 'Status'])
    return file_path

def mark_attendance(student_id: str, name: str, year: str, department: str, section: str):
    """Mark attendance for a student."""
    file_path = initialize_attendance_file(year, department, section)
    
    current_time = datetime.now().strftime("%H:%M:%S")
    student_already_marked = False
    
    # Check if student already marked
    with open(file_path, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        rows = list(reader)
    
    for row in rows[1:]:  # Skip header
        if row and row[0] == student_id:
            student_already_marked = True
            break
    
    if not student_already_marked:
        with open(file_path, 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([student_id, name, current_time, "Present"])
        return True
    return False

@app.post("/register")
async def register_student(
    student_id: str = Form(...),
    name: str = Form(...),
    year: str = Form(...),
    department: str = Form(...),
    section: str = Form(...),
    face_image: UploadFile = File(...)
):
    """Register a new student with academic details."""
    if not face_image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        content = await face_image.read()
        temp_file.write(content)
        temp_file_path = temp_file.name
    
    try:
        face_encodings, _ = extract_face_encodings(temp_file_path)
        if not face_encodings:
            os.unlink(temp_file_path)
            raise HTTPException(status_code=400, detail="No face detected in the image.")
        
        face_encoding = face_encodings[0]
        
        with open(FACE_ENCODINGS_PATH, "rb") as f:
            face_db = pickle.load(f)
        
        if student_id in face_db:
            os.unlink(temp_file_path)
            raise HTTPException(status_code=400, detail=f"Student ID '{student_id}' already exists.")
        
        unique_filename = f"{student_id}_{uuid.uuid4()}.jpg"
        image_path = f"face_database/images/{unique_filename}"
        shutil.move(temp_file_path, image_path)
        
        face_db[student_id] = {
            "name": name,
            "year": year,
            "department": department,
            "section": section,
            "encoding": face_encoding,
            "image_path": image_path
        }
        
        with open(FACE_ENCODINGS_PATH, "wb") as f:
            pickle.dump(face_db, f)
        
        return JSONResponse(
            content={"message": f"Student {name} registered successfully."},
            status_code=201
        )
    
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/take_group_attendance")
async def take_group_attendance(
    year: str = Form(...),
    department: str = Form(...),
    section: str = Form(...),
    group_photo: UploadFile = File(...)
):
    """Take attendance from a group photo filtered by academic details."""
    if not group_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        content = await group_photo.read()
        temp_file.write(content)
        temp_file_path = temp_file.name
    
    try:
        group_encodings, group_locations = extract_face_encodings(temp_file_path)
        if not group_encodings:
            os.unlink(temp_file_path)
            raise HTTPException(status_code=400, detail="No faces detected in the photo.")
        
        with open(FACE_ENCODINGS_PATH, "rb") as f:
            face_db = pickle.load(f)
        
        # Filter students by academic details
        filtered_students = {
            sid: data for sid, data in face_db.items() 
            if data.get("year") == year and 
            data.get("department") == department and 
            data.get("section") == section
        }
        
        if not filtered_students:
            os.unlink(temp_file_path)
            raise HTTPException(
                status_code=404,
                detail=f"No students found for {year} {department} {section}"
            )
        
        attendance_results = []
        marked_students = set()
        
        # For each face in group photo, find best match among filtered students
        for group_encoding in group_encodings:
            best_match = None
            best_similarity = 0
            
            for student_id, student_data in filtered_students.items():
                if student_id in marked_students:
                    continue
                
                is_match, similarity = compare_faces(
                    student_data["encoding"], 
                    group_encoding
                )
                
                if is_match and similarity > best_similarity:
                    best_similarity = similarity
                    best_match = {
                        "student_id": student_id,
                        "name": student_data["name"],
                        "similarity": similarity
                    }
            
            if best_match and best_similarity > 0.6:
                marked = mark_attendance(
                    best_match["student_id"],
                    best_match["name"],
                    year,
                    department,
                    section
                )
                marked_students.add(best_match["student_id"])
                attendance_results.append({
                    **best_match,
                    "status": "Present (new)" if marked else "Present (duplicate)"
                })
        
        os.unlink(temp_file_path)
        
        return JSONResponse(
            content={
                "total_faces": len(group_encodings),
                "recognized": len(attendance_results),
                "attendance": attendance_results,
                "message": f"Attendance marked for {len(attendance_results)} students."
            }
        )
    
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance")
async def get_attendance(
    year: str,
    department: str,
    section: str,
    date: Optional[str] = None
):
    """Get attendance records filtered by academic details and date."""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    
    file_path = get_attendance_file_path(year, department, section)
    if not os.path.exists(file_path):
        return JSONResponse(
            content={"message": "No attendance records found."},
            status_code=404
        )
    
    try:
        attendance_records = []
        with open(file_path, 'r', newline='') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader)
            for row in reader:
                if len(row) >= 4:
                    attendance_records.append({
                        "student_id": row[0],
                        "name": row[1],
                        "time": row[2],
                        "status": row[3]
                    })
        
        return JSONResponse(
            content={
                "year": year,
                "department": department,
                "section": section,
                "date": date,
                "records": attendance_records
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students")
async def list_students(
    year: Optional[str] = None,
    department: Optional[str] = None,
    section: Optional[str] = None
):
    """List students with optional academic filters."""
    try:
        with open(FACE_ENCODINGS_PATH, "rb") as f:
            face_db = pickle.load(f)
        
        students = []
        for student_id, data in face_db.items():
            if ((year is None or data["year"] == year) and
                (department is None or data["department"] == department) and
                (section is None or data["section"] == section)):
                students.append({
                    "student_id": student_id,
                    "name": data["name"],
                    "year": data["year"],
                    "department": data["department"],
                    "section": data["section"]
                })
        
        return JSONResponse(content={"students": students})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/students/{student_id}")
async def delete_student(student_id: str):
    """Delete a student record from the database."""
    try:
        # Load the face database
        with open(FACE_ENCODINGS_PATH, "rb") as f:
            face_db = pickle.load(f)
        
        # Check if student exists
        if student_id not in face_db:
            raise HTTPException(
                status_code=404,
                detail=f"Student with ID '{student_id}' not found."
            )
        
        # Get student data before deletion
        student_data = face_db[student_id]
        
        # Remove the student's image file if it exists
        image_path = student_data.get("image_path")
        if image_path and os.path.exists(image_path):
            try:
                os.unlink(image_path)
            except Exception as e:
                print(f"Warning: Could not delete image file {image_path}: {str(e)}")
        
        # Remove the student from the database
        del face_db[student_id]
        
        # Save the updated database
        with open(FACE_ENCODINGS_PATH, "wb") as f:
            pickle.dump(face_db, f)
        
        return JSONResponse(
            content={
                "message": f"Student {student_data['name']} (ID: {student_id}) deleted successfully.",
                "deleted_student": {
                    "student_id": student_id,
                    "name": student_data["name"],
                    "year": student_data["year"],
                    "department": student_data["department"],
                    "section": student_data["section"]
                }
            },
            status_code=200
        )
    
    except HTTPException:
        raise  # Re-raise HTTPException as is
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting student: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)