import pickle
import os

# Paths
OLD_ENCODING_PATH = "face_database/encodings/encodings.pkl"
NEW_ENCODING_PATH = "face_database/encodings/encodingsnew.pkl"  # overwrite old one

# Load old data
with open(OLD_ENCODING_PATH, "rb") as f:
    old_face_db = pickle.load(f)

new_face_db = {}

for student_id, data in old_face_db.items():
    print(f"\nStudent ID: {student_id}")
    print(f"Name: {data.get('name', 'Unknown')}")

    # Ask for missing information
    year = input("Enter year (e.g., 1st, 2nd, 3rd, 4th): ").strip()
    department = input("Enter department (e.g., CSE, ECE, MECH): ").strip()
    section = input("Enter section (e.g., A, B, C): ").strip()

    # Create new entry
    new_face_db[student_id] = {
        "name": data.get("name", "Unknown"),
        "year": year,
        "department": department,
        "section": section,
        "encoding": data["encoding"],
        "image_path": data.get("image_path", "")
    }

# Save the new fixed pickle file
with open(NEW_ENCODING_PATH, "wb") as f:
    pickle.dump(new_face_db, f)

print("\n✅ Recreated 'encodings.pkl' successfully!")