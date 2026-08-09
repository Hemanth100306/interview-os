"""
Candidate Analyzer Service for InterviewOS.
Contains ONLY deterministic business logic for parsing candidate learning signals,
computing difficulty levels, confidence scores, strengths, weaknesses, and recommended curriculum days.
"""

from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional


@dataclass
class AnalysisResult:
    """Dataclass holding candidate analysis metrics."""
    difficulty: str
    confidence: float
    strengths: List[str] = field(default_factory=list)
    weaknesses: List[str] = field(default_factory=list)
    recommended_days: List[int] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Converts analysis result to a dictionary representation."""
        return {
            "difficulty": self.difficulty,
            "confidence": self.confidence,
            "strengths": self.strengths,
            "weaknesses": self.weaknesses,
            "recommended_days": self.recommended_days,
        }


class CandidateAnalyzer:
    """
    Service containing deterministic logic to analyze a candidate profile.
    Accepts candidate dictionary data from candidates.json and optional curriculum.json data.
    """

    # Curriculum Day Title Mapping for Human-Readable Strengths & Weaknesses
    DAY_TOPIC_MAP: Dict[int, str] = {
        1: "VS Code & Python Environment Setup",
        2: "Local LLM & AI Assistant Setup",
        3: "React Frontend & FastAPI Integration",
        4: "Structured Healthcare Data Processing",
        5: "Unstructured Document Extraction & OCR",
        6: "Unified Knowledge Base Construction",
        7: "Embeddings & Vector Search",
        8: "Vector Databases Overview",
        9: "Vector Database Population",
        10: "Retrieval & Matching Engine",
        11: "RAG End-to-End & LLM API Integration",
        12: "Prompt Engineering Fundamentals",
        13: "Function Calling & Structured Outputs",
        14: "Fine-Tuning Concepts & Strategy",
        15: "Fine-Tuning with LoRA & QLoRA",
        16: "Chatbot Backend & API Integration",
        17: "Chatbot Frontend Development",
        18: "Streaming Responses & SSE",
        19: "Response Formatting & Citations",
        20: "Conversation Memory & Context Management",
        21: "LangChain ReAct Agents",
        22: "Multi-Agent Orchestration",
        23: "Model Context Protocol (MCP)",
        24: "Agentic Pipeline Integration",
        25: "Chatbot Evaluation & Benchmarking",
        26: "Performance & Cost Optimization",
        27: "Security, Guardrails & Privacy",
        28: "Docker & Kubernetes Deployment",
        29: "Monitoring, Logging & Observability",
        30: "Production Readiness & Final Testing",
        31: "Capstone Project & Final Demo",
    }

    # Module Group Strengths Mapping
    MODULE_STRENGTH_MAP: Dict[str, List[int]] = {
        "Vector Search & Retrieval": [7, 8, 9, 10],
        "RAG & Prompt Engineering": [11, 12, 13],
        "Agentic AI & Model Context Protocol": [21, 22, 23, 24],
        "Fine-Tuning & Model Adaptation": [14, 15],
        "Cloud & Container Orchestration": [28],
        "System Observability & Reliability": [29, 30],
        "Security & Guardrails": [27],
        "Full-Stack Chatbot Architecture": [16, 17, 18, 19, 20],
    }

    def analyze(
        self,
        candidate: Dict[str, Any],
        curriculum: Optional[Dict[str, Any]] = None,
    ) -> AnalysisResult:
        """
        Main analysis method for a single candidate profile.

        :param candidate: Candidate dictionary from candidates.json containing 'member', 'missions', 'signals'.
        :param curriculum: Optional curriculum dictionary from curriculum.json.
        :return: AnalysisResult object containing difficulty, confidence, strengths, weaknesses, recommended_days.
        """
        member = candidate.get("member", {})
        missions = candidate.get("missions", [])
        signals = candidate.get("signals", {})

        years_exp = float(member.get("yearsExperience", 0))
        completed = int(signals.get("missionsCompleted", len([m for m in missions if m.get("passed")])))
        first_try = int(signals.get("missionsFirstTry", 0))
        commit_days = int(signals.get("commitDays", 0))

        # 1. Compute difficulty
        difficulty = self._compute_difficulty(years_exp, completed, first_try, commit_days)

        # 2. Compute confidence score
        confidence = self._compute_confidence(completed, first_try, commit_days)

        # 3. Detect strengths
        strengths = self._detect_strengths(missions, years_exp)

        # 4. Detect weaknesses
        weaknesses = self._detect_weaknesses(missions)

        # 5. Recommend curriculum days
        recommended_days = self._recommend_curriculum_days(missions)

        return AnalysisResult(
            difficulty=difficulty,
            confidence=confidence,
            strengths=strengths,
            weaknesses=weaknesses,
            recommended_days=recommended_days,
        )

    def _compute_difficulty(
        self,
        years_exp: float,
        completed: int,
        first_try: int,
        commit_days: int,
    ) -> str:
        """
        Computes candidate difficulty deterministically using a 100-point composite score.
        """
        total_missions = 31.0
        first_try_ratio = first_try / completed if completed > 0 else 0.0

        # Score components
        exp_score = min(30.0, years_exp * 3.0)  # Max 30 pts (10+ yrs = 30)
        completion_score = (min(31, completed) / total_missions) * 35.0  # Max 35 pts
        accuracy_score = first_try_ratio * 25.0  # Max 25 pts
        commit_score = min(10.0, (commit_days / total_missions) * 10.0)  # Max 10 pts

        total_score = exp_score + completion_score + accuracy_score + commit_score

        if total_score >= 80.0:
            return "Expert"
        elif total_score >= 62.0:
            return "Advanced"
        elif total_score >= 42.0:
            return "Intermediate"
        else:
            return "Beginner"

    def _compute_confidence(
        self,
        completed: int,
        first_try: int,
        commit_days: int,
    ) -> float:
        """
        Computes normalized confidence score between 0.00 and 1.00 based on data signal reliability.
        """
        total_missions = 31.0
        completion_factor = min(1.0, completed / total_missions)
        commit_factor = min(1.0, commit_days / total_missions)
        accuracy_factor = first_try / completed if completed > 0 else 0.0

        confidence = (0.4 * completion_factor) + (0.3 * commit_factor) + (0.3 * accuracy_factor)
        return max(0.10, min(0.99, round(confidence, 2)))

    def _detect_strengths(self, missions: List[Dict[str, Any]], years_exp: float) -> List[str]:
        """
        Identifies key technical strengths by matching passed missions against module groups.
        """
        passed_days = {
            m.get("day")
            for m in missions
            if m.get("passed") is True or ("skipped" not in m and "passed" in m and m.get("passed"))
        }

        strengths: List[str] = []

        # Check domain module coverage
        for module_name, days in self.MODULE_STRENGTH_MAP.items():
            matched_count = sum(1 for d in days if d in passed_days)
            if matched_count >= max(1, len(days) // 2):
                strengths.append(module_name)

        # High first try success bonus strength
        first_try_count = sum(1 for m in missions if m.get("attempts") == 1)
        if first_try_count >= 18:
            strengths.append("High First-Try Problem Solving")

        if years_exp >= 10:
            strengths.append("Senior Systems Architecture")

        # Fallback strength if none matched
        if not strengths:
            strengths.append("Core Software Development")

        return strengths[:4]

    def _detect_weaknesses(self, missions: List[Dict[str, Any]]) -> List[str]:
        """
        Identifies human-readable weaknesses from skipped missions, failed attempts, or high attempt counts.
        """
        weaknesses: List[str] = []

        for m in missions:
            day_num = m.get("day", 0)
            topic_title = m.get("title", self.DAY_TOPIC_MAP.get(day_num, f"Day {day_num} Topic"))

            # Skipped topic
            if m.get("skipped") is True:
                weaknesses.append(f"Skipped Day {day_num}: {topic_title}")

            # Failed topic
            elif m.get("passed") is False:
                weaknesses.append(f"Failed Day {day_num}: {topic_title}")

            # High attempt count (> 2 attempts)
            elif m.get("attempts", 0) >= 3:
                attempts = m.get("attempts")
                weaknesses.append(f"Multi-attempt ({attempts}x) on Day {day_num}: {topic_title}")

        # Fallback if no weaknesses detected
        if not weaknesses:
            weaknesses.append("No critical gap areas detected in cohort history")

        return weaknesses[:5]

    def _recommend_curriculum_days(self, missions: List[Dict[str, Any]]) -> List[int]:
        """
        Recommends ordered curriculum day IDs.
        Priority:
        1. Skipped days
        2. Failed or high attempt (> 2) days
        3. Core advanced completed days (e.g. Days 31, 28, 23, 22, 10, 7)
        """
        skipped_days: List[int] = []
        weak_days: List[int] = []
        passed_days: List[int] = []

        for m in missions:
            day_num = m.get("day", 0)
            if not day_num:
                continue

            if m.get("skipped") is True:
                skipped_days.append(day_num)
            elif m.get("passed") is False or m.get("attempts", 0) >= 3:
                weak_days.append(day_num)
            elif m.get("passed") is True:
                passed_days.append(day_num)

        # Prioritize core capstone & advanced days in passed
        core_advanced_pool = [31, 28, 23, 22, 13, 10, 7]
        advanced_days = [d for d in core_advanced_pool if d in passed_days]

        # Combine in priority order: Skipped -> Weak -> Advanced Completed
        ordered: List[int] = []
        for day in skipped_days + weak_days + advanced_days:
            if day not in ordered:
                ordered.append(day)

        # Fallback to standard core days if fewer than 3
        fallback_defaults = [29, 28, 23, 22, 10, 7]
        for day in fallback_defaults:
            if len(ordered) >= 5:
                break
            if day not in ordered:
                ordered.append(day)

        return ordered[:5]
