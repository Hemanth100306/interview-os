# 🤖 InterviewOS - AI Usage Log

This log details the design philosophy, prompt engineering strategies, and AI agent collaboration log for the development of **InterviewOS** during the ABTalks Vibe Coding Hackathon.

---

## 💡 AI Design Philosophy

The core architectural objective for **InterviewOS** was building an **Adaptive Technical Interviewer** that provides:
1. **Deterministic Execution**: Guaranteeing 100% uptime, 0 API latency, and 0 rate-limit failures during live hackathon demos.
2. **Context-Aware Adaptability**: Scaling interview difficulty, duration, and question depth based on candidate signals.
3. **Transparent Evaluation**: Providing instant human-readable rubric feedback (`covered_points`, `missing_points`, 0-10 score) on every submission.

---

## 🛠️ AI Pipeline Services

| Service | Architecture | Purpose |
| :--- | :--- | :--- |
| **`CandidateAnalyzer`** | Deterministic Signal Analysis | Evaluates candidate experience, first-try accuracy, and commit days into 100-pt score mapped to difficulty tiers (*Beginner*, *Intermediate*, *Advanced*, *Expert*). |
| **`InterviewPlanner`** | Dynamic Strategy Matrix | Determines total questions, duration limits (15m-30m), topic focus areas, and follow-up strategy (*Deep architectural probing*, *Mixed conceptual*, *Foundational guidance*). |
| **`QuestionGenerator`** | Rubric Question Repository | Generates structured questions covering Embeddings, Vector DBs, RAG, Multi-Agent, MCP, Docker, and Observability with expected evaluation points. |
| **`AnswerEvaluator`** | Token & Subphrase Normalizer | Performs string normalization, regex punctuation stripping, and token match ratio scoring against expected rubric points. |

---

## 📝 Prompt & Rule Specifications

### 1. Opening Prompt Template Strategy
```text
"Today we'll evaluate your knowledge in {Topic 1}, {Topic 2} and {Topic 3}."
```

### 2. Follow-up Strategy Rules
- **Confidence > 0.85**: `"Deep architectural probing"`
- **Confidence 0.65 - 0.85**: `"Mixed conceptual and implementation questions"`
- **Confidence < 0.65**: `"Foundational guidance with increasing difficulty"`

### 3. Evaluation Feedback Ranges
- **Score 9.0 - 10.0**: *"You covered most of the expected concepts with good technical depth."*
- **Score 7.0 - 8.9**: *"You explained several important concepts but missed some critical implementation details."*
- **Score 4.0 - 6.9**: *"Your answer shows partial understanding but important concepts are missing."*
- **Score 0.0 - 3.9**: *"The answer lacks most expected concepts."*

---

## 🧪 Testing & Verification Verification Log

- **Candidate 1 (Sarah Johnson - Expert)**:
  - Difficulty: `Expert` (30 mins, 8 questions)
  - Strategy: *Deep architectural probing*
  - Focus Topics: *Monitoring, Prompt Engineering, Docker, Capstone, MCP*
- **Candidate 4 (David Miller - Advanced)**:
  - Difficulty: `Advanced` (25 mins, 6 questions)
  - Strategy: *Foundational guidance with increasing difficulty*
  - Focus Topics: *Docker, Embeddings, Vector Databases, Retrieval, Prompt Engineering*
- **Candidate 7 (Alex Chen - Intermediate)**:
  - Difficulty: `Intermediate` (20 mins, 5 questions)
  - Strategy: *Mixed conceptual and implementation questions*
  - Focus Topics: *Guardrails, Docker, Capstone, Multi-Agent, Embeddings*
