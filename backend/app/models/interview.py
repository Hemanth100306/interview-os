from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List


@dataclass
class InterviewSession:
    """Domain model representing an active interview session state."""
    session_id: str
    candidate: Optional[Dict[str, Any]] = None
    messages: List[Dict[str, str]] = field(default_factory=list)
    question_count: int = 0
    done: bool = False
