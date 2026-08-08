"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ArrowLeft,
  Clock,
  Send,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Terminal,
  Code2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InterviewSessionWorkspaceProps {
  sessionId: string;
}

interface QuestionData {
  id: number;
  dayTitle: string;
  question: string;
  expectedDepth: string;
  contextTag: string;
}

const QUESTIONS_SEQUENCE: QuestionData[] = [
  {
    id: 1,
    dayTitle: "Day 7: Embeddings Explained",
    question: "Can you explain how you generated embeddings for healthcare knowledge base chunks and handled chunking overlaps?",
    expectedDepth: "Vector Math & Chunking",
    contextTag: "AI Core",
  },
  {
    id: 2,
    dayTitle: "Day 10: Retrieval & Matching Engine",
    question: "How does your hybrid query router decide between structured SQL lookup and vector semantic search when processing complex healthcare claims queries?",
    expectedDepth: "Hybrid Search & Routing",
    contextTag: "Architecture",
  },
  {
    id: 3,
    dayTitle: "Day 13: Function Calling & Structured Outputs",
    question: "When your LLM generates structured Pydantic tool calls, how do you handle JSON schema validation failures and retries gracefully?",
    expectedDepth: "API Resilience",
    contextTag: "Tooling",
  },
  {
    id: 4,
    dayTitle: "Day 22: Multi-Agent Orchestration",
    question: "In your multi-agent architecture using CrewAI/LangGraph, how do you prevent cascading loops and state deadlock between specialist agents?",
    expectedDepth: "Distributed Agents",
    contextTag: "Orchestration",
  },
  {
    id: 5,
    dayTitle: "Day 23: Model Context Protocol (MCP)",
    question: "What specific trade-offs did you encounter when exposing healthcare data tools over MCP versus standard REST endpoints?",
    expectedDepth: "Protocol Engineering",
    contextTag: "Integration",
  },
  {
    id: 6,
    dayTitle: "Day 27: Security & Guardrails",
    question: "How do you defend against prompt injection attacks that attempt to bypass medical data privacy guardrails?",
    expectedDepth: "Security Purity",
    contextTag: "Security",
  },
  {
    id: 7,
    dayTitle: "Day 28: Docker & Kubernetes Deployment",
    question: "How are your FastAPI backend pods configured for horizontal auto-scaling during sudden traffic spikes?",
    expectedDepth: "K8s Infrastructure",
    contextTag: "DevOps",
  },
  {
    id: 8,
    dayTitle: "Day 31: Capstone Architecture",
    question: "How would you evolve this system to handle 100,000 concurrent streaming chat sessions with under 200ms latency?",
    expectedDepth: "System Scaling",
    contextTag: "Production",
  },
];

export function InterviewSessionWorkspace({ sessionId }: InterviewSessionWorkspaceProps) {
  const [qIndex, setQIndex] = useState(1); // Currently on Q2 (index 1)
  const [answerInput, setAnswerInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(872); // 14 mins 32 seconds initial
  const [chatHistory, setChatHistory] = useState([
    {
      type: "ai_q",
      qNum: 1,
      text: QUESTIONS_SEQUENCE[0].question,
      dayTitle: QUESTIONS_SEQUENCE[0].dayTitle,
    },
    {
      type: "user_a",
      qNum: 1,
      text: "I used LangChain RecursiveCharacterTextSplitter with a 500-token chunk size and 50-token overlap, then generated 1536-dim embeddings via OpenAI text-embedding-3-small stored in ChromaDB for fast cosine similarity search.",
      rating: "Depth Rating: 9.2/10 · High Precision",
    },
  ]);

  // Insights State
  const [insights, setInsights] = useState({
    topicsCovered: "Vector Search, RAG, Hybrid Query Routing",
    confidenceScore: 92,
    technicalDepth: 8.8,
    communicationScore: 94,
    adaptiveDifficulty: "Senior / Level 4 (+0.2)",
  });

  // Live Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = QUESTIONS_SEQUENCE[qIndex] || QUESTIONS_SEQUENCE[0];

  const handleSubmitAnswer = () => {
    if (!answerInput.trim()) return;

    setIsThinking(true);

    const submittedText = answerInput;
    setAnswerInput("");

    setTimeout(() => {
      // Append Q2 answer & next Q3 question to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: "user_a",
          qNum: qIndex + 1,
          text: submittedText,
          rating: "Depth Rating: 9.4/10 · Exceptional Conceptual Clarity",
        },
      ]);

      if (qIndex + 1 < QUESTIONS_SEQUENCE.length) {
        const nextIdx = qIndex + 1;
        setQIndex(nextIdx);

        setChatHistory((prev) => [
          ...prev,
          {
            type: "ai_q",
            qNum: nextIdx + 1,
            text: QUESTIONS_SEQUENCE[nextIdx].question,
            dayTitle: QUESTIONS_SEQUENCE[nextIdx].dayTitle,
          },
        ]);

        // Update live insights
        setInsights((prev) => ({
          ...prev,
          confidenceScore: Math.min(99, prev.confidenceScore + 2),
          technicalDepth: Math.min(10, +(prev.technicalDepth + 0.2).toFixed(1)),
          adaptiveDifficulty: `Senior / Level 4 (+${(0.2 * (nextIdx + 1)).toFixed(1)})`,
        }));
      }

      setIsThinking(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Candidate Info & Session ID */}
          <div className="flex items-center gap-4">
            <Link
              href="/candidates"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium pr-3 border-r border-white/10"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Exit Session</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/15 flex items-center justify-center text-xs font-bold text-cyan-400">
                SJ
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">Sarah Johnson</h1>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  SESSION // <span className="text-cyan-400 font-semibold">{sessionId}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Center Progress & Topic Badges */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs">
              <span className="text-zinc-400 font-mono">Progress:</span>
              <span className="font-bold text-cyan-400 font-mono">{qIndex + 1} / 8</span>
            </div>

            <Badge variant="glow" className="text-xs font-mono py-1 px-3">
              <Layers className="size-3 mr-1.5 inline" />
              {currentQ.dayTitle}
            </Badge>

            <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono py-1 px-3">
              Adaptive L4
            </Badge>
          </div>

          {/* Right Timer Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 font-mono text-xs text-emerald-400 shadow-inner">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <Clock className="size-3.5 text-zinc-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE GRID */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* MAIN AREA (8 Cols) */}
        <main className="lg:col-span-8 flex flex-col space-y-6">
          {/* Active Question Card (AI Interviewer) */}
          <Card className="border-white/10 bg-zinc-950/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
              <Brain className="size-32 text-cyan-400" />
            </div>

            <CardHeader className="pb-3 border-b border-white/5 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Senior Technical Interviewer</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      Question {qIndex + 1} of 8 • {currentQ.contextTag} Domain
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
                  Target Depth: High
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-mono text-cyan-400">// ACTIVE QUESTION</p>
                <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  &quot;{currentQ.question}&quot;
                </h2>
              </div>

              {/* Previous Conversation Log Accordion/List */}
              {chatHistory.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Conversation History
                  </p>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {chatHistory.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1 font-mono">
                        {item.type === "ai_q" ? (
                          <div className="flex items-start gap-2 text-cyan-300/90">
                            <span className="text-cyan-500 font-bold shrink-0">Q{item.qNum}:</span>
                            <span>{item.text}</span>
                          </div>
                        ) : (
                          <div className="pl-4 p-2.5 rounded-lg bg-zinc-900/70 border border-white/5 text-zinc-300 space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                              <span>Candidate Answer (Q{item.qNum})</span>
                              {item.rating && (
                                <span className="text-emerald-400 font-mono">{item.rating}</span>
                              )}
                            </div>
                            <p className="font-sans text-xs text-zinc-200">&quot;{item.text}&quot;</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidate Answer Textarea & Controls */}
          <Card className="border-white/10 bg-zinc-950/90 shadow-2xl flex-1 flex flex-col justify-between">
            <CardHeader className="pb-2 border-b border-white/5 bg-zinc-900/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Code2 className="size-4 text-cyan-400" />
                  Your Response
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {answerInput.length} chars • {answerInput.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 flex flex-col space-y-4">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                disabled={isThinking}
                placeholder="Type your technical answer here... Explain your architectural choices, data structures, trade-offs, and failure recovery handling in detail."
                className="w-full h-40 p-4 bg-zinc-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none font-sans leading-relaxed transition-all"
              />

              {/* AI Thinking Animation State */}
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 animate-spin text-cyan-400" />
                      <span>AI Thinking... Analyzing technical depth & scaling follow-up question</span>
                    </div>
                    <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <Terminal className="size-3.5" /> Markdown & Code blocks supported
                </div>

                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answerInput.trim() || isThinking}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs px-6 h-10 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <Send className="mr-1.5 size-3.5" />
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* RIGHT SIDEBAR (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Live Performance Insights Card */}
          <Card className="border-white/10 bg-zinc-950/80 shadow-2xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="size-4 text-cyan-400" />
                Live Interview Insights
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time scoring metrics updated by AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              {/* Topics Covered */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Topics Covered</p>
                <p className="font-medium text-cyan-300 leading-normal">{insights.topicsCovered}</p>
              </div>

              {/* Confidence Score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Confidence Score</span>
                  <span className="text-emerald-400 font-bold">{insights.confidenceScore}%</span>
                </div>
                <Progress value={insights.confidenceScore} />
              </div>

              {/* Technical Depth & Communication Grid */}
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase">Technical Depth</p>
                  <p className="text-sm font-bold text-white mt-0.5">{insights.technicalDepth} / 10</p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase">Communication</p>
                  <p className="text-sm font-bold text-white mt-0.5">{insights.communicationScore}%</p>
                </div>
              </div>

              {/* Adaptive Difficulty */}
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <span className="text-[11px] text-indigo-300 font-mono">Adaptive Difficulty</span>
                <span className="text-xs font-bold text-indigo-200 font-mono">
                  {insights.adaptiveDifficulty}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Question Timeline Widget */}
          <Card className="border-white/10 bg-zinc-950/80 shadow-2xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Target className="size-4 text-emerald-400" />
                Question Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                8-question adaptive assessment roadmap.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-2.5 font-mono text-xs">
              {QUESTIONS_SEQUENCE.map((q, idx) => {
                const isCompleted = idx < qIndex;
                const isActive = idx === qIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isActive
                        ? "border-cyan-500/50 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-300"
                        : "border-white/5 bg-zinc-900/40 text-zinc-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isActive
                            ? "bg-cyan-400 text-black animate-pulse"
                            : isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {isCompleted ? "✓" : isActive ? "●" : "○"}
                      </span>
                      <span className="truncate">
                        Q{q.id}: {q.dayTitle.split(":")[1] || q.dayTitle}
                      </span>
                    </div>

                    <span className="text-[10px] shrink-0 font-mono text-zinc-500">
                      {isCompleted ? "Passed" : isActive ? "Active" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
