"""
Question Generator Service for InterviewOS.
Contains ONLY deterministic business logic for generating structured Question objects
with technical questions and expected rubric points based on an InterviewPlan.
"""

from dataclasses import dataclass, field
from typing import Dict, Any, List, Union, Optional
from app.services.interview_planner import InterviewPlan


@dataclass
class Question:
    """Dataclass holding structured question data and evaluation rubric points."""
    id: int
    topic: str
    difficulty: str
    question: str
    expected_points: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Converts Question to a dictionary representation."""
        return {
            "id": self.id,
            "topic": self.topic,
            "difficulty": self.difficulty,
            "question": self.question,
            "expected_points": self.expected_points,
        }


class QuestionGenerator:
    """
    Deterministic Question Generator service.
    Generates structured Question objects using candidate interview plan parameters.
    """

    # Comprehensive Question Bank indexed by Topic -> Stage ("intro" | "deep") -> Difficulty
    QUESTION_BANK: Dict[str, Dict[str, Dict[str, Dict[str, Any]]]] = {
        "Embeddings": {
            "intro": {
                "Beginner": {
                    "question": "What is a vector embedding, and how does it convert human text into numerical values?",
                    "expected_points": ["numerical representation", "vector dimensions", "semantic similarity"],
                },
                "Intermediate": {
                    "question": "How do sentence-transformer embedding models capture semantic relationships compared to traditional bag-of-words?",
                    "expected_points": ["dense vectors", "contextual representation", "cosine similarity", "dimensionality"],
                },
                "Advanced": {
                    "question": "Explain how high-dimensional embedding spaces preserve semantic distance using distance metrics like Cosine Similarity and Dot Product.",
                    "expected_points": ["cosine similarity formula", "dot product vs Euclidean distance", "vector normalization", "embedding dimensions"],
                },
                "Expert": {
                    "question": "How do contrastive learning loss functions (like InfoNCE) optimize embedding models for domain-specific technical retrieval?",
                    "expected_points": ["contrastive loss", "positive and negative pairs", "fine-tuning embeddings", "embedding space topology"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "Why is text chunking important before generating vector embeddings for large documents?",
                    "expected_points": ["token limits", "context preservation", "chunk overlap"],
                },
                "Intermediate": {
                    "question": "What trade-offs exist between fixed-size character chunking vs semantic sentence chunking when generating embeddings?",
                    "expected_points": ["semantic boundary preservation", "chunk size selection", "overlap impact on retrieval accuracy"],
                },
                "Advanced": {
                    "question": "How do embedding quantization techniques (e.g. Matryoshka embeddings or binary quantization) impact vector storage efficiency and retrieval recall?",
                    "expected_points": ["Matryoshka representations", "int8/binary quantization", "RAM memory reduction", "recall accuracy trade-off"],
                },
                "Expert": {
                    "question": "In multi-lingual or multi-modal vector search, how do you mitigate domain shift and embedding misalignment across regional datasets?",
                    "expected_points": ["multilingual alignment", "cross-encoder re-ranking", "domain adaptation", "vector space normalization"],
                },
            },
        },
        "Vector Databases": {
            "intro": {
                "Beginner": {
                    "question": "What is the primary role of a vector database like ChromaDB or Pinecone in AI applications?",
                    "expected_points": ["storing vector embeddings", "fast similarity search", "indexing documents"],
                },
                "Intermediate": {
                    "question": "How does a vector database indexing algorithm like HNSW (Hierarchical Navigable Small World) enable sub-linear retrieval speed?",
                    "expected_points": ["approximate nearest neighbor (ANN)", "graph-based indexing", "multi-layer graph traversal", "latency reduction"],
                },
                "Advanced": {
                    "question": "Compare HNSW graph indexing with IVF (Inverted File Index) in terms of indexing speed, query latency, and memory overhead.",
                    "expected_points": ["HNSW memory overhead", "IVF clustering & inverted lists", "recall vs latency trade-offs", "build time comparison"],
                },
                "Expert": {
                    "question": "How would you architect a distributed vector database cluster to handle 100 million 1536-dimensional vectors with sub-50ms P99 query latency?",
                    "expected_points": ["vector partitioning & sharding", "in-memory caching strategy", "GPU-accelerated index execution", "metadata filtering optimization"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "How does metadata filtering work inside a vector database query?",
                    "expected_points": ["filtering attributes", "pre-filtering vs post-filtering", "search narrowing"],
                },
                "Intermediate": {
                    "question": "What is the difference between pre-filtering and post-filtering in vector database queries, and why does pre-filtering maintain better recall?",
                    "expected_points": ["pre-filtering vs post-filtering", "index traversal impact", "relevance recall accuracy"],
                },
                "Advanced": {
                    "question": "Explain how hybrid indexing in ChromaDB/Pinecone handles sparse keyword filtering combined with dense vector retrieval.",
                    "expected_points": ["sparse-dense hybrid vectors", "BM25 keyword scores", "reciprocal rank fusion (RRF)", "index merging"],
                },
                "Expert": {
                    "question": "Describe how to handle real-time vector index updates and dynamic deletions without causing index degradation or locking readers.",
                    "expected_points": ["LSM-tree style vector logs", "background compaction", "tombstone garbage collection", "read-write lock avoidance"],
                },
            },
        },
        "Retrieval": {
            "intro": {
                "Beginner": {
                    "question": "What is the goal of retrieval in a Retrieval-Augmented Generation (RAG) system?",
                    "expected_points": ["fetching relevant context", "reducing hallucinations", "providing accurate facts"],
                },
                "Intermediate": {
                    "question": "How does hybrid retrieval combine BM25 keyword search with dense vector similarity search?",
                    "expected_points": ["lexical retrieval (BM25)", "dense vector retrieval", "re-ranking", "trade-offs"],
                },
                "Advanced": {
                    "question": "Explain the architecture of a multi-stage retrieval engine incorporating query expansion, hybrid search, and cross-encoder re-ranking.",
                    "expected_points": ["query rewriting / expansion", "hybrid retrieval (sparse + dense)", "Reciprocal Rank Fusion (RRF)", "Cross-Encoder re-ranker"],
                },
                "Expert": {
                    "question": "How do you evaluate retrieval precision, recall, and Mean Reciprocal Rank (MRR) using automated benchmark datasets?",
                    "expected_points": ["MRR formula", "Normalized Discounted Cumulative Gain (NDCG)", "Hit Rate @ K", "RAG Triad evaluation metrics"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "Why might a vector search alone fail to retrieve exact part numbers or acronyms?",
                    "expected_points": ["exact keyword matching", "out-of-vocabulary terms", "sparse search necessity"],
                },
                "Intermediate": {
                    "question": "What role does a Cross-Encoder re-ranker play after initial candidate retrieval from a vector database?",
                    "expected_points": ["joint query-document attention", "scoring precision", "latency cost vs recall gain"],
                },
                "Advanced": {
                    "question": "How do you optimize retrieval latency when combining semantic search with real-time SQL join constraints?",
                    "expected_points": ["query routing logic", "parallel async retrieval", "context window truncation", "result deduplication"],
                },
                "Expert": {
                    "question": "How would you design a self-correcting agentic retrieval system that reformulates queries when initial retrieval confidence is low?",
                    "expected_points": ["retrieval confidence scoring", "query transformation loops", "multi-query generation", "early exit criteria"],
                },
            },
        },
        "Prompt Engineering": {
            "intro": {
                "Beginner": {
                    "question": "What is a system prompt, and how does it guide the behavior of an LLM?",
                    "expected_points": ["setting persona and instructions", "formatting constraints", "guiding model tone"],
                },
                "Intermediate": {
                    "question": "Explain the difference between Few-Shot prompting and Chain-of-Thought (CoT) prompting.",
                    "expected_points": ["few-shot input-output examples", "step-by-step reasoning", "accuracy improvement"],
                },
                "Advanced": {
                    "question": "How do you structure prompt templates to enforce strict JSON output formatting while minimizing hallucinations?",
                    "expected_points": ["JSON schema definition", "system instruction clarity", "negative constraints", "few-shot structured examples"],
                },
                "Expert": {
                    "question": "How do you systematically evaluate prompt robustness against edge cases and prompt injection using automated LLM-as-a-Judge frameworks?",
                    "expected_points": ["LLM-as-a-Judge grading", "synthetic test generation", "adversarial prompt suites", "pass/fail criteria"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "Why is it important to provide clear negative constraints in prompt instructions?",
                    "expected_points": ["preventing unwanted output", "bounding scope", "reducing hallucinations"],
                },
                "Intermediate": {
                    "question": "How do you manage prompt context window limits when passing large retrieved documents to an LLM?",
                    "expected_points": ["context window budgeting", "document summarization", "token counting via tiktoken"],
                },
                "Advanced": {
                    "question": "Explain the 'Lost in the Middle' phenomenon in long-context prompts and how you mitigate context ordering bias.",
                    "expected_points": ["attention bias at start/end", "optimal context ordering", "re-ranking key context to edges"],
                },
                "Expert": {
                    "question": "How do you design dynamic meta-prompts that auto-generate specialized sub-prompts for multi-agent execution graphs?",
                    "expected_points": ["meta-prompt generation", "agent role specialization", "task-specific schema injection", "context isolation"],
                },
            },
        },
        "RAG": {
            "intro": {
                "Beginner": {
                    "question": "What does RAG stand for, and why is it preferred over fine-tuning for dynamic data?",
                    "expected_points": ["Retrieval-Augmented Generation", "real-time data access", "cost efficiency vs training"],
                },
                "Intermediate": {
                    "question": "Walk through the end-to-end architecture of a basic RAG pipeline from user query to generated answer.",
                    "expected_points": ["embedding query", "vector similarity lookup", "context augmentation", "LLM answer generation"],
                },
                "Advanced": {
                    "question": "How do you implement Corrective RAG (CRAG) or Adaptive RAG to evaluate context relevance before LLM generation?",
                    "expected_points": ["relevance evaluator", "web search fallback", "query transformation", "hallucination prevention"],
                },
                "Expert": {
                    "question": "How do you architect an enterprise RAG system that supports document-level access control (RBAC) across millions of files?",
                    "expected_points": ["security ACL filtering", "user token validation", "pre-filtering security metadata", "audit logging"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What happens if a RAG system retrieves irrelevant context for a user question?",
                    "expected_points": ["potential hallucination", "confusing answer", "system prompt grounding necessity"],
                },
                "Intermediate": {
                    "question": "How do you include citations and source document references in RAG generated responses?",
                    "expected_points": ["metadata tracking", "inline bracket citations", "document chunk mapping"],
                },
                "Advanced": {
                    "question": "How do you solve context fragmentation when complex answers require information spread across multiple distinct documents?",
                    "expected_points": ["parent-child chunking", "multi-vector retrieval", "graph RAG relations", "context stitching"],
                },
                "Expert": {
                    "question": "Compare Knowledge Graph RAG (GraphRAG) with traditional vector RAG for complex multi-hop reasoning queries.",
                    "expected_points": ["entity-relation graphs", "multi-hop traversal", "global summarization", "vector vs graph trade-offs"],
                },
            },
        },
        "Multi-Agent Systems": {
            "intro": {
                "Beginner": {
                    "question": "What is a multi-agent system, and why divide work across specialized AI agents?",
                    "expected_points": ["specialized roles", "division of labor", "improved focus"],
                },
                "Intermediate": {
                    "question": "How does a Router Agent decide which specialist agent should handle a incoming user request?",
                    "expected_points": ["intent classification", "routing rules/schema", "delegation logic"],
                },
                "Advanced": {
                    "question": "Compare hierarchical multi-agent orchestration (Supervisor pattern) with peer-to-peer agent collaboration (Swarm pattern).",
                    "expected_points": ["supervisor control flow", "peer delegation", "state management", "deadlock risks"],
                },
                "Expert": {
                    "question": "How do you manage global state synchronization and event-driven communication in complex LangGraph workflow graphs?",
                    "expected_points": ["state schema definition", "node reducers", "conditional edges", "checkpointing & time-travel"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What is an agent tool, and how does an agent know when to execute it?",
                    "expected_points": ["tool definitions", "function calling", "reasoning loop"],
                },
                "Intermediate": {
                    "question": "How do you handle tool execution failures or unexpected outputs within an agent reasoning loop?",
                    "expected_points": ["error feedback to LLM", "retry mechanisms", "fallback tools"],
                },
                "Advanced": {
                    "question": "How do you prevent infinite loops and token budget exhaustion when multi-agent teams collaborate on open-ended tasks?",
                    "expected_points": ["max iteration bounds", "recursion limits", "token cost tracking", "early stopping criteria"],
                },
                "Expert": {
                    "question": "Describe how to implement Human-in-the-Loop (HITL) pause-and-resume mechanisms inside a LangGraph multi-agent execution pipeline.",
                    "expected_points": ["interrupt_before/after nodes", "state persistence", "approval payload injection", "resume execution"],
                },
            },
        },
        "MCP": {
            "intro": {
                "Beginner": {
                    "question": "What does MCP stand for, and what problem does it solve in AI application development?",
                    "expected_points": ["Model Context Protocol", "standardized tool interface", "connecting models to data sources"],
                },
                "Intermediate": {
                    "question": "How does an MCP Server expose tools, resources, and prompts to compatible AI client applications?",
                    "expected_points": ["JSON-RPC transport", "tool registration", "resources vs tools", "standardized protocol"],
                },
                "Advanced": {
                    "question": "Explain the architecture of an MCP server providing database access and how protocol security boundaries are enforced.",
                    "expected_points": ["MCP protocol specification", "transport layer (stdio/SSE)", "tool execution isolation", "client permissions"],
                },
                "Expert": {
                    "question": "How do you design a high-throughput enterprise MCP gateway that federates tool discovery across dozens of internal microservice MCP servers?",
                    "expected_points": ["MCP federation", "dynamic tool routing", "protocol translation", "rate limiting & auth propagation"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What is the difference between an MCP Tool and an MCP Resource?",
                    "expected_points": ["tools are executable actions", "resources are readable data", "client interactions"],
                },
                "Intermediate": {
                    "question": "How do you handle asynchronous tool execution and streaming progress updates over the Model Context Protocol?",
                    "expected_points": ["async JSON-RPC notifications", "progress tokens", "streaming tool output"],
                },
                "Advanced": {
                    "question": "How do you manage tool schema evolution and versioning when deploying updated MCP servers to production clients?",
                    "expected_points": ["backward compatibility", "schema versioning", "dynamic tool capability negotiation"],
                },
                "Expert": {
                    "question": "How do you implement mutual TLS authentication and OAuth2 token passthrough for remote MCP servers over Server-Sent Events (SSE)?",
                    "expected_points": ["mTLS authentication", "OAuth2 Bearer token propagation", "SSE security headers", "session isolation"],
                },
            },
        },
        "Docker": {
            "intro": {
                "Beginner": {
                    "question": "Why containerize AI applications using Docker instead of running directly on a host machine?",
                    "expected_points": ["dependency isolation", "consistent environments", "easy deployment"],
                },
                "Intermediate": {
                    "question": "How do you optimize a Dockerfile for a FastAPI + PyTorch AI application to minimize final image size?",
                    "expected_points": ["multi-stage builds", "slim base images", "pip cache cleanup", "wheel compilation"],
                },
                "Advanced": {
                    "question": "Explain how Kubernetes Liveness and Readiness probes should be configured for an LLM inference service with cold-start latency.",
                    "expected_points": ["liveness vs readiness probes", "initialDelaySeconds configuration", "health check endpoints", "pod traffic routing"],
                },
                "Expert": {
                    "question": "How do you configure NVIDIA Container Toolkit and Kubernetes GPU resource requests (`nvidia.com/gpu`) for high-concurrency model deployment?",
                    "expected_points": ["NVIDIA container runtime", "GPU memory allocation", "MIG (Multi-Instance GPU) partitioning", "CUDA driver compatibility"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What is the role of Docker Compose in multi-container setups (e.g. FastAPI + Redis + ChromaDB)?",
                    "expected_points": ["orchestrating multiple services", "shared network creation", "environment variable management"],
                },
                "Intermediate": {
                    "question": "How do you handle secret management (e.g. OpenAI API keys) securely inside Docker containers and Kubernetes clusters?",
                    "expected_points": ["K8s Secrets", "environment variables vs mounted files", "avoiding hardcoded secrets in images"],
                },
                "Advanced": {
                    "question": "How do you configure Horizontal Pod Autoscalers (HPA) in Kubernetes based on custom metrics like GPU utilization or request queue depth?",
                    "expected_points": ["Prometheus Adapter", "Custom Metrics API", "HPA scaling policies", "scale-up / scale-down stabilization"],
                },
                "Expert": {
                    "question": "How do you implement zero-downtime rolling deployments and canary releases for stateful vector database clusters in Kubernetes?",
                    "expected_points": ["StatefulSet updates", "readiness gate management", "canary traffic splitting (Istio/NGINX)", "data persistence across rollouts"],
                },
            },
        },
        "Monitoring": {
            "intro": {
                "Beginner": {
                    "question": "Why is observability important for AI applications beyond standard server monitoring?",
                    "expected_points": ["tracking LLM latency", "monitoring token costs", "detecting hallucinations"],
                },
                "Intermediate": {
                    "question": "What key metrics would you track on a Grafana dashboard for a production RAG application?",
                    "expected_points": ["token consumption / cost", "P95/P99 latency", "retrieval score distribution", "error rate"],
                },
                "Advanced": {
                    "question": "How do you implement distributed tracing (using OpenTelemetry or LangSmith) to trace a query across API Gateway, Vector DB, and LLM call?",
                    "expected_points": ["OpenTelemetry spans & context propagation", "trace IDs across services", "latency bottleneck identification"],
                },
                "Expert": {
                    "question": "How do you build real-time automated drift detection for vector embeddings and LLM answer quality in production?",
                    "expected_points": ["embedding distribution drift (KS test)", "automated evaluation samplers", "hallucination rate alerts", "retraining triggers"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What is structured logging, and why is JSON format preferred for server logs?",
                    "expected_points": ["machine-readable logs", "easy parsing", "consistent key-value fields"],
                },
                "Intermediate": {
                    "question": "How do you track and alert on token usage costs to prevent budget overruns in multi-tenant AI systems?",
                    "expected_points": ["token counter middleware", "per-tenant rate limits", "Prometheus alerts"],
                },
                "Advanced": {
                    "question": "Explain how to log LLM inputs and outputs safely without violating GDPR or HIPAA sensitive data regulations.",
                    "expected_points": ["PII redacting middleware", "anonymization before logging", "opt-out storage policies"],
                },
                "Expert": {
                    "question": "How do you construct a self-healing monitoring pipeline that automatically triggers circuit breakers when LLM API latency degrades?",
                    "expected_points": ["circuit breaker pattern", "fallback model routing", "degraded mode execution", "recovery health checks"],
                },
            },
        },
        "Guardrails": {
            "intro": {
                "Beginner": {
                    "question": "What are AI guardrails, and why are they necessary for public-facing chatbots?",
                    "expected_points": ["safety checks", "preventing harmful content", "topic alignment"],
                },
                "Intermediate": {
                    "question": "How do input guardrails prevent prompt injection attacks and jailbreak attempts?",
                    "expected_points": ["input sanitization", "pattern matching", "classifier models for injection"],
                },
                "Advanced": {
                    "question": "Compare deterministic regex/rule-based guardrails with LLM-based guardrail models (like NeMo Guardrails or Llama Guard).",
                    "expected_points": ["latency vs accuracy", "rule-based speed", "model-based semantic detection", "layered defense"],
                },
                "Expert": {
                    "question": "How do you design a zero-latency streaming output guardrail that inspects generated tokens in real time before sending them to the client?",
                    "expected_points": ["sliding window token inspection", "trie / regex streaming match", "stream interruption & redaction", "buffer management"],
                },
            },
            "deep": {
                "Beginner": {
                    "question": "What is the difference between an input guardrail and an output guardrail?",
                    "expected_points": ["input checks user prompt", "output checks model response", "different threat models"],
                },
                "Intermediate": {
                    "question": "How do output guardrails detect and sanitize PII (Personally Identifiable Information) before rendering answers?",
                    "expected_points": ["regex & NER models (Presidio)", "PII masking", "compliance enforcement"],
                },
                "Advanced": {
                    "question": "How do you enforce hallucination guardrails by comparing generated statements directly against retrieved context chunks?",
                    "expected_points": ["NLI (Natural Language Inference) entailment", "statement extraction", "groundedness score threshold"],
                },
                "Expert": {
                    "question": "Describe how to construct adversarial stress tests to continuously audit guardrail security against novel jailbreak techniques.",
                    "expected_points": ["automated red-teaming", "adversarial prompt mutation", "bypass rate benchmarking", "continuous security regression testing"],
                },
            },
        },
    }

    # Topic Key Normalizer
    TOPIC_KEY_MAP: Dict[str, str] = {
        "embeddings": "Embeddings",
        "vector databases": "Vector Databases",
        "retrieval": "Retrieval",
        "prompt engineering": "Prompt Engineering",
        "rag": "RAG",
        "multi-agent": "Multi-Agent Systems",
        "multi-agent systems": "Multi-Agent Systems",
        "mcp": "MCP",
        "model context protocol": "MCP",
        "docker": "Docker",
        "monitoring": "Monitoring",
        "guardrails": "Guardrails",
    }

    def generate(
        self,
        plan: Union[InterviewPlan, Dict[str, Any]],
        question_number: int,
    ) -> Question:
        """
        Generates a structured Question for the given interview plan and question number.

        :param plan: InterviewPlan object or dictionary.
        :param question_number: 1-based index of current question (e.g. 1, 2, 3...).
        :return: Question dataclass containing id, topic, difficulty, question, and expected_points.
        """
        if isinstance(plan, InterviewPlan):
            plan_dict = plan.to_dict()
        else:
            plan_dict = plan

        difficulty = plan_dict.get("difficulty", "Advanced")
        focus_topics = plan_dict.get(
            "focus_topics", ["Embeddings", "Retrieval", "Multi-Agent Systems", "Docker", "Monitoring"]
        )

        # 1. Select Topic based on question_number
        topic_raw = self._select_topic_for_question(focus_topics, question_number)
        topic_normalized = self._normalize_topic(topic_raw)

        # 2. Determine Question Stage ("intro" for Q1, "deep" for Q2+)
        stage = "intro" if question_number == 1 else "deep"

        # 3. Retrieve Template from QUESTION_BANK with fallback
        template = self._get_template(topic_normalized, stage, difficulty)

        return Question(
            id=question_number,
            topic=topic_normalized,
            difficulty=difficulty,
            question=template["question"],
            expected_points=template["expected_points"],
        )

    def _select_topic_for_question(self, focus_topics: List[str], q_num: int) -> str:
        """
        Selects topic from focus_topics using modulo round-robin.
        """
        if not focus_topics:
            return "Retrieval"
        index = (q_num - 1) % len(focus_topics)
        return focus_topics[index]

    def _normalize_topic(self, raw_topic: str) -> str:
        """
        Normalizes topic string to match QUESTION_BANK keys.
        """
        topic_lower = raw_topic.lower().strip()
        for key, norm in self.TOPIC_KEY_MAP.items():
            if key in topic_lower:
                return norm
        return "Retrieval"

    def _get_template(self, topic: str, stage: str, difficulty: str) -> Dict[str, Any]:
        """
        Retrieves question template from QUESTION_BANK with graceful fallbacks.
        """
        topic_bank = self.QUESTION_BANK.get(topic, self.QUESTION_BANK["Retrieval"])
        stage_bank = topic_bank.get(stage, topic_bank.get("intro", {}))

        # Direct difficulty lookup
        if difficulty in stage_bank:
            return stage_bank[difficulty]

        # Fallback to Advanced or first available
        return stage_bank.get("Advanced", list(stage_bank.values())[0])
