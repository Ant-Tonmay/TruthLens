import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API"))

def run_llm(prompt):
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    return response.text
