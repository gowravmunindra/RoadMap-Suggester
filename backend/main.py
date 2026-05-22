from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
import PyPDF2
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Student Career Roadmap API - Block 1")

# Configure CORS
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [url.strip() for url in FRONTEND_URL.split(",") if url.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")
try:
    client = MistralClient(api_key=MISTRAL_API_KEY)
except Exception:
    client = None

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]

class ChatResponse(BaseModel):
    reply: str
    context: Dict[str, Any]
    is_complete: bool

SYSTEM_PROMPT = """You are Block 1 of a 3-block AI workflow system designed to build a complete AI-powered student career roadmap platform.
Your ONLY job is to understand the student, collect structured context, and prepare clean workflow data.

You must collect the following information from the user:
- degree
- current year
- target role/domain
- current skills
- interests
- learning availability
- roadmap duration preference (weekly, monthly, 6-month, yearly, milestone-based - default to milestone-based if missing)
- experience level (if a resume is provided, ask whether to auto-detect level from resume OR manually choose: beginner, intermediate, advanced)

Rules:
1. Ask questions ONE BY ONE in simple English.
2. Keep responses concise.
3. If the user provides a resume text or pdf, use it ONLY for skill understanding, project understanding, experience detection, and learning direction. Do NOT perform ATS scoring, rewrite resumes, analyze formatting, or criticize resumes.
4. Do not generate roadmap here. Do not generate projects here. Do not suggest careers here.
5. When ALL required information is collected, your response must be EXACTLY and ONLY the following JSON structure (do not include any conversational text with it):

{
 "workflow_stage":"student_context_completed",
 "degree":"...",
 "year":"...",
 "target_role":"...",
 "skills":["..."],
 "interests":["..."],
 "learning_time":"...",
 "roadmap_type":"...",
 "experience_level":"...",
 "resume_context":{
   "projects":["..."],
   "strengths":["..."]
 }
}

Wait for the user to provide information. Acknowledge what they provide and ask the next missing piece of information.
"""

BLOCK2_SYSTEM_PROMPT = """You are the second stage of a connected 3-block AI workflow system for building an AI-powered student career roadmap platform.

Your job is to continue directly from Block 1 workflow output without breaking continuity.
You will receive structured workflow context generated from Block 1.

Do not repeat onboarding questions.
Do not recreate student understanding.
Do not modify workflow structure.

Your responsibility is ONLY:
1. roadmap generation
2. milestone planning
3. skill-gap analysis

Use:
- target role
- current skills
- interests
- experience level
- resume context
- roadmap type

to generate a realistic and easy-to-follow roadmap.

The roadmap must:
- be concise
- practical
- beginner-friendly
- realistic for college students
- medium-sized by default
- optimized for frontend rendering
- optimized for PDF generation

Use hybrid structure:
milestones + timeline guidance

For every milestone include:
- milestone name
- timeline
- skills to learn
- practice goals
- expected outcome

Generate concise skill-gap analysis using compact formatting.

Do NOT:
- generate motivational paragraphs
- generate career theory
- suggest unrelated careers
- generate salary advice
- generate interview prep
- recommend AI tools

Your output MUST be EXACTLY and ONLY the following JSON structure:

{
 "workflow_stage":"roadmap_completed",
 "target_role":"...",
 "experience_level":"...",
 "roadmap":[
   {
     "milestone":"...",
     "timeline":"...",
     "skills":["..."],
     "practice":["..."],
     "outcome":"..."
   }
 ],
 "skill_gap_analysis":{
   "current_strengths":["..."],
   "missing_skills":["..."],
   "priority_skills":["..."]
 }
}

Keep output compact. Keep token usage optimized. Avoid hallucinations. Avoid unrealistic timelines.
"""

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
            
        return {"status": "success", "text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not client:
        return ChatResponse(
            reply="Mistral API key is not configured properly.",
            context=request.context,
            is_complete=False
        )

    # Reconstruct history from context if available
    messages = [
        ChatMessage(role="system", content=SYSTEM_PROMPT)
    ]
    
    history = request.context.get("history", [])
    for msg in history:
        messages.append(ChatMessage(role=msg["role"], content=msg["content"]))
        
    messages.append(ChatMessage(role="user", content=request.message))
    
    try:
        chat_response = client.chat(
            model="mistral-large-latest",
            messages=messages
        )
        reply = chat_response.choices[0].message.content
        
        # Check if the reply is the final JSON
        is_complete = False
        if "workflow_stage" in reply and "student_context_completed" in reply:
            try:
                # Attempt to parse json to confirm
                start_idx = reply.find("{")
                end_idx = reply.rfind("}") + 1
                if start_idx != -1 and end_idx != -1:
                    json_str = reply[start_idx:end_idx]
                    json.loads(json_str)
                    is_complete = True
                    reply = json_str # clean up
            except Exception:
                pass

        new_history = history + [
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": reply}
        ]
        
        new_context = request.context.copy()
        new_context["history"] = new_history
        
        return ChatResponse(
            reply=reply,
            context=new_context,
            is_complete=is_complete
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RoadmapRequest(BaseModel):
    student_context: Dict[str, Any]

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Mistral API key is not configured properly.")

    try:
        context_str = json.dumps(request.student_context)
        
        messages = [
            ChatMessage(role="system", content=BLOCK2_SYSTEM_PROMPT),
            ChatMessage(role="user", content=f"Here is the Block 1 output:\n{context_str}")
        ]
        
        chat_response = client.chat(
            model="mistral-large-latest",
            messages=messages
        )
        
        reply = chat_response.choices[0].message.content
        
        # Clean the reply to ensure it's valid JSON
        start_idx = reply.find("{")
        end_idx = reply.rfind("}") + 1
        if start_idx != -1 and end_idx != -1:
            reply = reply[start_idx:end_idx]
            
        return json.loads(reply)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

BLOCK3_SYSTEM_PROMPT = """You are the final stage of a connected 3-block AI workflow system for building an AI-powered student career roadmap platform.

You will receive roadmap workflow output from Block 2.

Maintain strict continuity with:
- roadmap
- target role
- skill progression
- experience level
- learning sequence

Do not regenerate roadmap.
Do not modify previous workflow context.
Do not introduce unrelated technologies.

Your responsibility is ONLY:
generate progressive portfolio projects.

Generate exactly 4 connected projects.

Project progression rules:
Project 1: simple beginner project
Project 2: upgrade of Project 1
Project 3: advanced version using real-world concepts
Project 4: portfolio-ready production-style system

Every project must:
- continue from previous project
- increase complexity gradually
- match roadmap milestones
- remain achievable
- stay portfolio-oriented

For every project include:
- project name
- difficulty
- objective
- important features
- skills practiced
- upgrade path to next project

Keep descriptions concise and practical.

Avoid:
- disconnected projects
- enterprise-scale complexity
- unrealistic beginner expectations
- unnecessary technologies

Your output MUST be EXACTLY and ONLY the following JSON structure:
{
 "workflow_stage":"project_generation_completed",
 "projects":[
   {
     "name":"...",
     "difficulty":"...",
     "objective":"...",
     "features":["..."],
     "skills":["..."],
     "upgrade_path":"..."
   }
 ]
}

Keep token usage optimized. Keep continuity strict. Avoid hallucinations.
"""

class ProjectsRequest(BaseModel):
    roadmap_context: Dict[str, Any]

@app.post("/api/generate-projects")
async def generate_projects(request: ProjectsRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Mistral API key is not configured properly.")

    try:
        context_str = json.dumps(request.roadmap_context)
        
        messages = [
            ChatMessage(role="system", content=BLOCK3_SYSTEM_PROMPT),
            ChatMessage(role="user", content=f"Here is the Block 2 output:\n{context_str}")
        ]
        
        chat_response = client.chat(
            model="mistral-large-latest",
            messages=messages
        )
        
        reply = chat_response.choices[0].message.content
        
        start_idx = reply.find("{")
        end_idx = reply.rfind("}") + 1
        if start_idx != -1 and end_idx != -1:
            reply = reply[start_idx:end_idx]
            
        return json.loads(reply)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
