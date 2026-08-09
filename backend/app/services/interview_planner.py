"""
Interview Planner Service for InterviewOS.
Contains ONLY deterministic business logic for creating structured InterviewPlan objects
from CandidateAnalyzer AnalysisResult metrics.
"""

from dataclasses import dataclass, field
from typing import Dict, Any, List, Union, Optional
from app.services.candidate_analyzer import AnalysisResult


@dataclass
class InterviewPlan:
    """Dataclass holding structured interview assessment parameters."""
    difficulty: str
    duration_minutes: int
    total_questions: int
    curriculum_days: List[int] = field(default_factory=list)
    focus_topics: List[str] = field(default_factory=list)
    opening_prompt: str = ""
    followup_strategy: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Converts interview plan to a dictionary representation."""
        return {
            "difficulty": self.difficulty,
            "duration_minutes": self.duration_minutes,
            "total_questions": self.total_questions,
            "curriculum_days": self.curriculum_days,
            "focus_topics": self.focus_topics,
            "opening_prompt": self.opening_prompt,
            "followup_strategy": self.followup_strategy,
        }


class InterviewPlanner:
    """
    Deterministic service for generating an InterviewPlan based on Candidate Analysis signals.
    """

    # Curriculum Day to Readable Interview Topic Mapping
    DAY_TOPIC_MAP: Dict[int, str] = {
        1: "Environment Setup",
        2: "Local LLM Setup",
        3: "React & FastAPI Integration",
        4: "Structured Data",
        5: "Unstructured Data & OCR",
        6: "Knowledge Base",
        7: "Embeddings",
        8: "Vector Databases",
        9: "Vector Database Population",
        10: "Retrieval",
        11: "RAG End-to-End",
        12: "Prompt Engineering",
        13: "Function Calling",
        14: "Fine-Tuning Strategy",
        15: "LoRA & QLoRA",
        16: "Chatbot Backend API",
        17: "Chatbot Frontend",
        18: "Streaming Responses",
        19: "Response Formatting",
        20: "Conversation Memory",
        21: "LangChain Agents",
        22: "Multi-Agent",
        23: "MCP",
        24: "Agentic Pipeline",
        25: "Evaluation & Benchmarking",
        26: "Performance Optimization",
        27: "Guardrails",
        28: "Docker",
        29: "Monitoring",
        30: "Production Readiness",
        31: "Capstone",
    }

    # Difficulty Rules: (Duration Mins, Question Count) - Guaranteed Minimum 8 Questions
    DIFFICULTY_RULES: Dict[str, tuple[int, int]] = {
        "Beginner": (15, 8),
        "Intermediate": (20, 8),
        "Advanced": (25, 8),
        "Expert": (30, 8),
    }

    def create_plan(
        self,
        analysis: Union[AnalysisResult, Dict[str, Any]],
    ) -> InterviewPlan:
        """
        Generates an InterviewPlan from an AnalysisResult object or dictionary.

        :param analysis: AnalysisResult instance or dictionary from CandidateAnalyzer.
        :return: InterviewPlan object containing assessment parameters.
        """
        if isinstance(analysis, AnalysisResult):
            analysis_dict = analysis.to_dict()
        else:
            analysis_dict = analysis

        difficulty = analysis_dict.get("difficulty", "Advanced")
        confidence = float(analysis_dict.get("confidence", 0.75))
        curriculum_days = list(analysis_dict.get("recommended_days", [7, 8, 10, 12, 22]))

        # 1. Map Difficulty -> Duration & Question Count
        duration_minutes, total_questions = self.DIFFICULTY_RULES.get(
            difficulty, (25, 6)
        )

        # 2. Map Curriculum Days -> Focus Topics
        focus_topics = self._generate_focus_topics(curriculum_days)

        # 3. Generate Opening Prompt
        opening_prompt = self._generate_opening_prompt(focus_topics)

        # 4. Generate Follow-up Strategy
        followup_strategy = self._generate_followup_strategy(confidence)

        return InterviewPlan(
            difficulty=difficulty,
            duration_minutes=duration_minutes,
            total_questions=total_questions,
            curriculum_days=curriculum_days,
            focus_topics=focus_topics,
            opening_prompt=opening_prompt,
            followup_strategy=followup_strategy,
        )

    def _generate_focus_topics(self, curriculum_days: List[int]) -> List[str]:
        """
        Maps curriculum day IDs into human-readable focus topics.
        """
        topics: List[str] = []
        for day in curriculum_days:
            topic = self.DAY_TOPIC_MAP.get(day, f"Day {day} Systems")
            if topic not in topics:
                topics.append(topic)
        return topics

    def _generate_opening_prompt(self, focus_topics: List[str]) -> str:
        """
        Generates a human-friendly opening prompt summarizing the interview focus.
        """
        if not focus_topics:
            return "Today we'll evaluate your technical knowledge across core AI systems and software architecture."

        if len(focus_topics) == 1:
            return f"Today we'll evaluate your technical knowledge in {focus_topics[0]}."

        if len(focus_topics) == 2:
            return f"Today we'll evaluate your knowledge in {focus_topics[0]} and {focus_topics[1]}."

        # 3+ topics
        main_topics = ", ".join(focus_topics[:2])
        last_topic = focus_topics[2]
        return f"Today we'll evaluate your knowledge in {main_topics} and {last_topic}."

    def _generate_followup_strategy(self, confidence: float) -> str:
        """
        Determines followup strategy based on candidate confidence score.
        """
        if confidence > 0.85:
            return "Deep architectural probing"
        elif 0.65 <= confidence <= 0.85:
            return "Mixed conceptual and implementation questions"
        else:
            return "Foundational guidance with increasing difficulty"
