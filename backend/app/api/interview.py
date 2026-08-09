from typing import Dict, Any, List
from fastapi import APIRouter, status
from app.schemas.interview import InterviewRequest, InterviewResponse, Feedback
from app.services.candidate_analyzer import CandidateAnalyzer, AnalysisResult
from app.services.interview_planner import InterviewPlanner, InterviewPlan
from app.services.question_generator import QuestionGenerator, Question
from app.services.answer_evaluator import AnswerEvaluator, EvaluationResult

router = APIRouter(prefix="/api/interview", tags=["Interview"])

# Service instances
analyzer = CandidateAnalyzer()
planner = InterviewPlanner()
question_generator = QuestionGenerator()
evaluator = AnswerEvaluator()

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
    Integrates CandidateAnalyzer, InterviewPlanner, QuestionGenerator, and AnswerEvaluator.

    - Start Interview: { "sessionId": "...", "candidate": {...} }
    - Continue Interview: { "sessionId": "...", "message": "..." }
    """

    # 1. START INTERVIEW
    if payload.candidate is not None:
        # Step 1: Run CandidateAnalyzer
        analysis_result: AnalysisResult = analyzer.analyze(payload.candidate)

        # Step 2: Run InterviewPlanner
        interview_plan: InterviewPlan = planner.create_plan(analysis_result)

        # Step 3: Generate Question 1 using QuestionGenerator
        q1: Question = question_generator.generate(interview_plan, 1)

        # Step 4: Store in in-memory session dictionary
        SESSIONS_DB[payload.sessionId] = {
            "sessionId": payload.sessionId,
            "candidate": payload.candidate,
            "analysis": analysis_result,
            "plan": interview_plan,
            "current_question": 1,
            "total_questions": interview_plan.total_questions,
            "current_q_obj": q1,
            "evaluations": [],
            "history": [{"q1": q1.to_dict()}],
            "done": False,
        }

        # Step 5: Return Question 1 and metadata
        return InterviewResponse(
            reply=q1.question,
            done=False,
            metadata={
                "difficulty": interview_plan.difficulty,
                "duration_minutes": interview_plan.duration_minutes,
                "total_questions": interview_plan.total_questions,
                "current_question": 1,
                "topic": q1.topic,
                "expected_points": q1.expected_points,
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
            q1 = question_generator.generate(default_plan, 1)
            session = {
                "sessionId": payload.sessionId,
                "plan": default_plan,
                "analysis": default_analysis,
                "current_question": 1,
                "total_questions": default_plan.total_questions,
                "current_q_obj": q1,
                "evaluations": [],
                "history": [{"q1": q1.to_dict()}],
                "done": False,
            }
            SESSIONS_DB[payload.sessionId] = session

        plan: InterviewPlan = session["plan"]
        analysis: AnalysisResult = session["analysis"]
        current_q_num = session["current_question"]
        total_q = session["total_questions"]
        current_q_obj: Question = session.get("current_q_obj") or question_generator.generate(plan, current_q_num)

        # Step 1 & 2: Retrieve current question expected_points and evaluate candidate answer
        eval_result: EvaluationResult = evaluator.evaluate(
            payload.message,
            current_q_obj.expected_points,
        )

        # Step 3: Save evaluation in session history
        eval_record = {
            "question": current_q_obj.question,
            "candidate_answer": payload.message,
            "score": eval_result.score,
            "covered_points": eval_result.covered_points,
            "missing_points": eval_result.missing_points,
            "feedback": eval_result.feedback,
            "topic": current_q_obj.topic,
        }
        if "evaluations" not in session:
            session["evaluations"] = []
        session["evaluations"].append(eval_record)
        session["history"].append({"user_message": payload.message, "eval": eval_record})

        eval_metadata = eval_result.to_dict()
        msg_lower = payload.message.lower()
        next_q_num = current_q_num + 1

        # Step 6: Check Finish condition
        if "finish" in msg_lower or "complete" in msg_lower or "done" in msg_lower or next_q_num > total_q:
            session["done"] = True
            all_evals = session["evaluations"]

            # Step 7: Final feedback summary across all stored evaluations
            if all_evals:
                avg_score = round(sum(e["score"] for e in all_evals) / len(all_evals), 1)
                strong_topics = list({e["topic"] for e in all_evals if e["score"] >= 7.0})
                weak_topics = list({e["topic"] for e in all_evals if e["score"] < 7.0})
            else:
                avg_score = 7.5
                strong_topics = [current_q_obj.topic]
                weak_topics = []

            if not strong_topics:
                strong_topics = [current_q_obj.topic]
            if not weak_topics:
                weak_topics = ["No critical weaknesses observed"]

            recommendation = (
                "Strong Candidate - Recommended for Hire"
                if avg_score >= 7.0
                else "Needs Improvement - Additional Technical Review Required"
            )

            summary_text = (
                f"Assessment completed across {len(all_evals)} questions. "
                f"Average Score: {avg_score}/10. "
                f"Recommendation: {recommendation}."
            )

            return InterviewResponse(
                reply="Thank you for completing the InterviewOS adaptive technical assessment.",
                done=True,
                metadata={
                    "difficulty": plan.difficulty,
                    "duration_minutes": plan.duration_minutes,
                    "total_questions": total_q,
                    "current_question": current_q_num,
                    "topic": "Assessment Completed",
                    "expected_points": [],
                    "evaluation": eval_metadata,
                    "summary_metrics": {
                        "average_score": avg_score,
                        "strongest_topics": strong_topics,
                        "weakest_topics": weak_topics,
                        "recommendation": recommendation,
                    },
                },
                feedback=Feedback(
                    summary=summary_text,
                    strengths=strong_topics,
                    gaps=weak_topics,
                    next=[f"Recommendation: {recommendation}"],
                ),
            )

        # Step 5: Generate next question using QuestionGenerator
        q_next: Question = question_generator.generate(plan, next_q_num)

        # Update session state for next round
        session["current_question"] = next_q_num
        session["current_q_obj"] = q_next
        session["history"].append({f"q{next_q_num}": q_next.to_dict()})

        # Step 4: Return next question with evaluation metadata
        return InterviewResponse(
            reply=q_next.question,
            done=False,
            metadata={
                "difficulty": plan.difficulty,
                "duration_minutes": plan.duration_minutes,
                "total_questions": total_q,
                "current_question": next_q_num,
                "topic": q_next.topic,
                "expected_points": q_next.expected_points,
                "evaluation": eval_metadata,
            },
        )

    # 3. FALLBACK
    return InterviewResponse(
        reply="Session active. Please submit your response to proceed.",
        done=False,
    )
