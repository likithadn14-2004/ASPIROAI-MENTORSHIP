import cv2
import numpy as np
from deepface import DeepFace
from retinaface import RetinaFace
import json
import streamlit as st
import os

DATABASE_FILE = "database/embeddings.json"

def load_embeddings():
    if os.path.exists(DATABASE_FILE):
        with open(DATABASE_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_embeddings(embeddings):
    with open(DATABASE_FILE, 'w') as f:
        json.dump(embeddings, f)

def detect_faces(img):
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    elif img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    try:
        faces = RetinaFace.detect_faces(img)
        face_list = []
        if isinstance(faces, dict):
            for key in faces:
                identity = faces[key]
                facial_area = identity["facial_area"]
                x1, y1, x2, y2 = facial_area
                face_img = img[y1:y2, x1:x2]
                face_list.append((face_img, facial_area))
        return face_list
    except Exception as e:
        st.error(f"Error in face detection: {e}")
        return []

def extract_embeddings(face_img):
    try:
        embedding = DeepFace.represent(face_img, model_name="Facenet512", enforce_detection=False)[0]
        return embedding
    except Exception as e:
        st.error(f"Error extracting embeddings: {e}")
        return None

def recognize_face(embedding, database, threshold=0.5):
    if not database:
        return "Unknown", 1.0
    min_distance = float('inf')
    identity = "Unknown"
    for name, stored_embeddings in database.items():
        for stored_emb in stored_embeddings:
            vector_a = np.array(embedding['embedding'])
            vector_b = np.array(stored_emb['embedding'])     
            vector_a = vector_a / np.linalg.norm(vector_a)
            vector_b = vector_b / np.linalg.norm(vector_b)  
            similarity = np.dot(vector_a, vector_b)
            distance = 1 - similarity
            if distance < min_distance:
                min_distance = distance
                identity = name
    return (identity, min_distance) if min_distance < threshold else ("Unknown", min_distance)