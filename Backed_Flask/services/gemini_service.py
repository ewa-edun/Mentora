import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash-latest")


def genrate_sumary(text):
    try:
        prompt = f"Summarize the following text:\n\n{text}"
        responce = model.generate_content(prompt)
        return {'Summary':responce.text}
    except Exception as e:
        return {"error": str(e)}
    
def genrate_Quiz(Paragraph):
    try:
        prompt = f"Genrate the Quiz from the following paragraph:\n\n{Paragraph}"
        responce = model.generate_content(prompt)
        return{'Your Quiz':responce.text}
    except Exception as e:
        return {"error": str(e)}

def ask_qustion(Qustions):
    try:
        prompt = f"Answer this question clearly:\n\n{Qustions}"
        responce = model.generate_content(prompt)
        return{'Your answers':responce.text}
    except Exception as e:
        return {"error": str(e)}
    