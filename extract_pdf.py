import sys
import subprocess

try:
    import pypdf
except ImportError:
    print("Installing pypdf...")
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pypdf', '--quiet'])
    import pypdf

try:
    reader = pypdf.PdfReader("BHARATHI_RESUME.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    with open("resume_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted resume text.")
except Exception as e:
    print(f"Error: {e}")
