from fastapi import APIRouter, status
from app.schemas.interview import InterviewRequest, InterviewResponse, Feedback

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Start or Continue an Adaptive AI Interview Session",
)
@router.post(
    "/",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def handle_interview(payload: InterviewRequest) -> InterviewResponse:
    """
    POST /api/interview endpoint.
    Accepts:
    1. Start Interview: { "sessionId": "...", "candidate": {} }
    2. Continue Interview: { "sessionId": "...", "message": "..." }

    Returns mock responses matching the hackathon API specification.
    """
    # 1. Start Interview Request
    if payload.candidate is not None:
        candidate_name = payload.candidate.get("name", "Candidate")
        return InterviewResponse(
            reply=(
                f"Welcome to your InterviewOS assessment, {candidate_name}. "
                "Let's begin with Day 7 Embeddings: How do vector embeddings represent "
                "semantic concepts in high-dimensional vector space?"
            ),
            done=False,
        )

    # 2. Continue Interview Request
    if payload.message is not None:
        msg_lower = payload.message.lower()

        # Mock Finish condition if candidate message contains finish or complete triggers
        if "finish" in msg_lower or "complete" in msg_lower or "done" in msg_lower:
            return InterviewResponse(
                reply="Thank you for completing the InterviewOS adaptive technical assessment.",
                done=True,
                feedback=Feedback(
                    summary="Demonstrated strong understanding of vector search, RAG pipelines, and multi-agent orchestration.",
                    strengths=[
                        "Vector Search & Embeddings",
                        "Multi-Agent System Design",
                        "Prompt Engineering & Function Calling",
                    ],
                    gaps=[
                        "Monitoring, Logging & Observability (Day 29)",
                        "Fine-Tuning LoRA Parameter Selection",
                    ],
                    next=[
                        "Review Grafana dashboard metrics setup for RAG pipelines",
                        "Explore quantization trade-offs in QLoRA fine-tuning",
                    ],
                ),
            )

        # Standard Continue response
        return InterviewResponse(
            reply=(
                "Thank you for your response. Moving on to Day 10 Retrieval & Matching: "
                "How does your query router decide between structured SQL lookup and vector search?"
            ),
            done=False,
        )

    # 3. Default Fallback
    return InterviewResponse(
        reply="Session active. Please submit your answer to proceed.",
        done=False,
    )
