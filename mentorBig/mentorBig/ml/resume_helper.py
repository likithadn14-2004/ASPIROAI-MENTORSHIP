import nltk
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
import string
import pdfplumber
import docx
import os

def extract_text_from_path(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        with pdfplumber.open(path) as pdf:
            return "\n".join(x.extract_text() for x in pdf.pages if x.extract_text())
    if ext == ".docx":
        d = docx.Document(path)
        return "\n".join(p.text for p in d.paragraphs)
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def process_tokens(txt):
    tk = word_tokenize(txt)
    tk = [w.lower() for w in tk if w.isalpha()]
    s = set(stopwords.words("english"))
    tk = [w for w in tk if w not in s]
    return tk

def calculate_score(job_tokens, resume_tokens):
    freq = FreqDist(job_tokens)
    ln = len(job_tokens)
    unique_resume_tokens = list(set(resume_tokens))
    sc = sum(freq[w] for w in unique_resume_tokens)
    return round(sc * 100 / ln, 2) if ln else 0