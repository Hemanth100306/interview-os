from typing import Dict, Any
from fastapi import APIRouter, status
from app.schemas.interview import InterviewRequest, InterviewResponse, Feedback
from app.services.candidate_analyzer import CandidateAnalyzer, AnalysisResult
from app.services.interview_planner import InterviewPlanner, InterviewPlan

router = APIRouter(prefix="/api/interview", tags=["Interview"])

# Service instances
analyzer = CandidateAnalyzer()
planner = InterviewPlanner()

# In-memory session store keyed by sessionId
SESSIONS_DB: Dict[str, Dict[str, Any]] = {}


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
    Integrates CandidateAnalyzer and InterviewPlanner into session execution.

    - Start Interview: { "sessionId": "...", "candidate": {...} }
    - Continue Interview: { "sessionId": "...", "message": "..." }
    """

    # 1. START INTERVIEW
    if payload.candidate is not None:
        # Step 1: Run CandidateAnalyzer
        analysis_result: AnalysisResult = analyzer.analyze(payload.candidate)

        # Step 2: Run InterviewPlanner
        interview_plan: InterviewPlan = planner.create_plan(analysis_result)

        # Step 3: Store in in-memory session dictionary
        SESSIONS_DB[payload.sessionId] = {
            "sessionId": payload.sessionId,
            "candidate": payload.candidate,
            "analysis": analysis_result,
            "plan": interview_plan,
            "current_question_index": 0,
            "history": [],
            "done": False,
        }

        # Step 4: Return opening prompt & plan metadata
        return InterviewResponse(
            reply=interview_plan.opening_prompt,
            done=False,
            metadata={
                "difficulty": interview_plan.difficulty,
                "duration_minutes": interview_plan.duration_minutes,
                "total_questions": interview_plan.total_questions,
                "focus_topics": interview_plan.focus_topics,
            },
        )

    # 2. CONTINUE INTERVIEW
    if payload.message is not None:
        session = SESSIONS_DB.get(payload.sessionId)

        # Fallback if session is uninitialized/restarted
        if not session:
            default_analysis = analyzer.analyze(
                {"member": {"name": "Candidate", "yearsExperience": 5}, "missions": [], "signals": {}}
            )
            default_plan = planner.create_plan(default_analysis)
            session = {
                "sessionId": payload.sessionId,
                "plan": default_plan,
                "analysis": default_analysis,
                "current_question_index": 0,
                "history": [],
                "done": False,
            }
            SESSIONS_DB[payload.sessionId] = session

        plan: InterviewPlan = session["plan"]
        analysis: AnalysisResult = session["analysis"]
        current_idx = session["current_question_index"]
        session["history"].append({"user": payload.message})

        msg_lower = payload.message.lower()

        # Check Finish condition
        if "finish" in msg_lower or "complete" in msg_lower or "done" in msg_lower or current_idx >= plan.total_questions - 1:
            session["done"] = True
            return InterviewResponse(
                reply="Thank you for completing the InterviewOS adaptive technical assessment.",
                done=True,
                metadata={
                    "difficulty": plan.difficulty,
                    "duration_minutes": plan.duration_minutes,
                    "total_questions": plan.total_questions,
                    "focus_topics": plan.focus_topics,
                },
                feedback=Feedback(
                    summary=f"Assessment complete. Evaluated across {len(plan.focus_topics)} focus areas with strategy: '{plan.followup_strategy}'.",
                    strengths=analysis.strengths if analysis.strengths else ["Core Software Engineering"],
                    gaps=analysis.weaknesses if analysis.weaknesses else ["Monitoring & Observability"],
                    next=[f"Review focus topic: {plan.focus_topics[0] if plan.focus_topics else 'RAG Architecture'}"],
                ),
            )

        # Advance question index for next follow-up
        session["current_question_index"] = current_idx + 1
        topic = plan.focus_topics[min(current_idx, len(plan.focus_topics) - 1)]

        followup_reply = (
            f"Thank you for your response. Strategy [{plan.followup_strategy}]: "
            f"Moving to Question {current_idx + 2} of {plan.total_questions} focusing on {topic}. "
            f"How does your solution handle edge cases, latency, and fault tolerance?"
        )

        return InterviewResponse(
            reply=followup_reply,
            done=False,
            metadata={
                "difficulty": plan.difficulty,
                "duration_minutes": plan.duration_minutes,
                "total_questions": plan.total_questions,
                "current_question": current_idx + 2,
                "focus_topics": plan.focus_topics,
            },
        )

    # 3. FALLBACK
    return InterviewResponse(
        reply="Session active. Please submit your response to proceed.",
        done=False,
    )
