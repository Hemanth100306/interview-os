"""
Answer Evaluator Service for InterviewOS.
Contains ONLY deterministic business logic for matching candidate text responses
against expected rubric points, computing a 0-10 score, tracking covered/missing points,
and returning human-readable evaluation feedback.
"""

import re
import string
from dataclasses import dataclass, field
from typing import Dict, Any, List


@dataclass
class EvaluationResult:
    """Dataclass holding candidate answer evaluation metrics."""
    score: float
    covered_points: List[str] = field(default_factory=list)
    missing_points: List[str] = field(default_factory=list)
    feedback: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Converts EvaluationResult to a dictionary representation."""
        return {
            "score": self.score,
            "covered_points": self.covered_points,
            "missing_points": self.missing_points,
            "feedback": self.feedback,
        }


class AnswerEvaluator:
    """
    Deterministic Answer Evaluator service.
    Evaluates candidate text against expected rubric points.
    """

    def evaluate(self, answer: str, expected_points: List[str]) -> EvaluationResult:
        """
        Evaluates a candidate text answer against a list of expected rubric points.

        :param answer: Candidate response string.
        :param expected_points: List of expected rubric concept strings.
        :return: EvaluationResult containing score (0-10), covered_points, missing_points, feedback.
        """
        if not expected_points:
            return EvaluationResult(
                score=10.0,
                covered_points=[],
                missing_points=[],
                feedback="You covered most of the expected concepts with good technical depth.",
            )

        if not answer or not answer.strip():
            return EvaluationResult(
                score=0.0,
                covered_points=[],
                missing_points=list(expected_points),
                feedback="The answer lacks most expected concepts.",
            )

        # 1. Clean and normalize candidate answer text
        normalized_answer = self._normalize_text(answer)

        covered_points: List[str] = []
        missing_points: List[str] = []

        # 2. Match each expected point against the normalized answer
        for point in expected_points:
            if self._is_point_covered(point, normalized_answer):
                covered_points.append(point)
            else:
                missing_points.append(point)

        # 3. Calculate score between 0.0 and 10.0
        coverage_ratio = len(covered_points) / len(expected_points)
        score = round(coverage_ratio * 10.0, 1)

        # 4. Generate feedback string
        feedback = self._generate_feedback(score)

        return EvaluationResult(
            score=score,
            covered_points=covered_points,
            missing_points=missing_points,
            feedback=feedback,
        )

    def _normalize_text(self, text: str) -> str:
        """
        Converts text to lowercase and strips punctuation.
        """
        cleaned = text.lower()
        cleaned = re.sub(f"[{re.escape(string.punctuation)}]", " ", cleaned)
        return re.sub(r"\s+", " ", cleaned).strip()

    def _is_point_covered(self, expected_point: str, normalized_answer: str) -> bool:
        """
        Determines whether an expected point is covered in the candidate's normalized answer.
        Supports phrase matching and keyword token overlap.
        """
        normalized_point = self._normalize_text(expected_point)

        # Direct phrase match or substring match
        if normalized_point in normalized_answer:
            return True

        # Extract non-stopword tokens from the expected point
        stopwords = {
            "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with",
            "by", "from", "of", "vs", "is", "are", "was", "were", "be", "been", "using",
        }
        point_tokens = [
            token for token in normalized_point.split() if token not in stopwords and len(token) > 2
        ]

        if not point_tokens:
            return False

        # Count matched tokens or partial token matches in answer
        answer_tokens = set(normalized_answer.split())
        matched_tokens = 0

        for p_token in point_tokens:
            for a_token in answer_tokens:
                if p_token == a_token:
                    matched_tokens += 1
                    break
                elif len(p_token) >= 4 and p_token in a_token:
                    matched_tokens += 1
                    break
                elif len(a_token) >= 4 and a_token in p_token:
                    matched_tokens += 1
                    break

        match_ratio = matched_tokens / len(point_tokens)
        return match_ratio >= 0.50

    def _generate_feedback(self, score: float) -> str:
        """
        Returns human-readable feedback based on the 0-10 score range:
        - 9-10: Excellent
        - 7-8: Good
        - 4-6: Fair
        - 0-3: Poor
        """
        if score >= 9.0:
            return "You covered most of the expected concepts with good technical depth."
        elif score >= 7.0:
            return "You explained several important concepts but missed some critical implementation details."
        elif score >= 4.0:
            return "Your answer shows partial understanding but important concepts are missing."
        else:
            return "The answer lacks most expected concepts."
