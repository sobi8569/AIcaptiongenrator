from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict
import openai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class CaptionRequest(BaseModel):
    content: str
    platforms: List[str]
    style: str
    tone: str = "engaging"

@app.get("/")
async def root():
    return {"message": "Welcome to the Caption Generator API"}

@app.post("/api/generate")
async def generate_captions(request: CaptionRequest):
    try:
        prompts = {
            platform: f"Generate a {request.style}, {request.tone} caption for {platform} about: {request.content}"
            for platform in request.platforms
        }
        
        captions = {}
        for platform, prompt in prompts.items():
            try:
                response = await openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a social media expert who creates engaging captions."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.7,
                    store=True
                )
                captions[platform] = response.choices[0].message.content.strip()
            except Exception as e:
                print(f"Error with OpenAI API: {str(e)}")
                captions[platform] = f"Error generating caption: {str(e)}"
        
        return JSONResponse(content={"captions": captions})
    except Exception as e:
        print(f"Server error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/platforms")
async def get_platforms():
    return {
        "platforms": [
            {
                "id": "instagram",
                "name": "Instagram",
                "max_length": 2200,
                "hashtag_limit": 30
            },
            {
                "id": "tiktok",
                "name": "TikTok",
                "max_length": 2200,
                "hashtag_limit": 33
            },
            {
                "id": "twitter",
                "name": "Twitter",
                "max_length": 280,
                "hashtag_limit": 10
            },
            {
                "id": "youtube",
                "name": "YouTube",
                "max_length": 5000,
                "hashtag_limit": 15
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
