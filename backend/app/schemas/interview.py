from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class InterviewRequest(BaseModel):
    sessionId: str = Field(..., description="Unique session identifier for the interview")
    candidate: Optional[Dict[str, Any]] = Field(
        None, description="Candidate details provided when starting an interview"
    )
    message: Optional[str] = Field(
        None, description="Candidate response message provided when continuing an interview"
    )


class Feedback(BaseModel):
    summary: str = Field(..., description="High-level summary of candidate performance")
    strengths: List[str] = Field(default_factory=list, description="Key candidate technical strengths")
    gaps: List[str] = Field(default_factory=list, description="Identified knowledge or skill gaps")
    next: List[str] = Field(default_factory=list, description="Recommended next steps for candidate growth")


class InterviewResponse(BaseModel):
    reply: str = Field(..., description="AI interviewer response or question text")
    done: bool = Field(False, description="True if the interview session has completed")
    metadata: Optional[Dict[str, Any]] = Field(
        None, description="Interview plan metadata including difficulty, duration, and topics"
    )
    feedback: Optional[Feedback] = Field(
        None, description="Final evaluation report populated when done is True"
    )
