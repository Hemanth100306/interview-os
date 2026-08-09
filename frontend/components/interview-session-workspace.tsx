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
  Award,
  BookOpen,
  Check,
  X,
  RotateCcw,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import candidatesData from "@/data/candidates.json";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/interview";

interface InterviewSessionWorkspaceProps {
  sessionId: string;
}

interface EvaluationData {
  score: number;
  feedback: string;
  covered_points: string[];
  missing_points: string[];
}

interface MetadataData {
  difficulty?: string;
  duration_minutes?: number;
  total_questions?: number;
  current_question?: number;
  topic?: string;
  expected_points?: string[];
  evaluation?: EvaluationData;
  summary_metrics?: {
    average_score: number;
    strongest_topics: string[];
    weakest_topics: string[];
    recommendation: string;
  };
}

interface ChatMessage {
  id: string;
  type: "ai_q" | "user_a";
  qNum?: number;
  topic?: string;
  text: string;
  evaluation?: EvaluationData;
}

interface FeedbackData {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export function InterviewSessionWorkspace({ sessionId }: InterviewSessionWorkspaceProps) {
  // Extract candidateId from sessionId (e.g., "sess-CAND-001" or "CAND-001")
  const candidateId = sessionId.replace(/^(sess-|session-)/, "");

  // Find selected candidate or fallback
  const rawCandidate =
    candidatesData.candidates.find((c) => c.member.id === candidateId) ||
    candidatesData.candidates[0];

  const { member } = rawCandidate;

  // Workspace State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [metadata, setMetadata] = useState<MetadataData>({});
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<FeedbackData | null>(null);
  const [lastEvaluation, setLastEvaluation] = useState<EvaluationData | null>(null);

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

  // 1. Initial Start Interview API Call
  useEffect(() => {
    async function startInterview() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            candidate: rawCandidate,
          }),
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json();
        setCurrentQuestionText(data.reply);
        setMetadata(data.metadata || {});

        setChatHistory([
          {
            id: `q-1`,
            type: "ai_q",
            qNum: data.metadata?.current_question || 1,
            topic: data.metadata?.topic || "Core Systems",
            text: data.reply,
          },
        ]);
      } catch (err: any) {
        console.error("Failed to start interview session:", err);
        setError(err.message || "Failed to connect to FastAPI backend at localhost:8000.");
      } finally {
        setLoading(false);
      }
    }

    startInterview();
  }, [sessionId, rawCandidate]);

  // 2. Submit Answer API Call
  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || isThinking) return;

    const userText = answerInput.trim();
    setAnswerInput("");
    setIsThinking(true);

    const currentQNum = metadata.current_question || 1;

    // Append user answer immediately to timeline
    const tempUserMsgId = `user-${Date.now()}`;
    setChatHistory((prev) => [
      ...prev,
      {
        id: tempUserMsgId,
        type: "user_a",
        qNum: currentQNum,
        text: userText,
      },
    ]);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          message: userText,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();

      // Extract evaluation data from response metadata
      const evalData: EvaluationData | undefined = data.metadata?.evaluation;
      if (evalData) {
        setLastEvaluation(evalData);
        // Attach evaluation to previous user message in timeline
        setChatHistory((prev) =>
          prev.map((msg) => (msg.id === tempUserMsgId ? { ...msg, evaluation: evalData } : msg))
        );
      }

      // If Interview Complete
      if (data.done) {
        setIsFinished(true);
        setFinalFeedback(data.feedback || null);
        if (data.metadata) {
          setMetadata(data.metadata);
        }
      } else {
        // Advance to next question
        setCurrentQuestionText(data.reply);
        if (data.metadata) {
          setMetadata(data.metadata);
        }

        setChatHistory((prev) => [
          ...prev,
          {
            id: `q-${data.metadata?.current_question || currentQNum + 1}`,
            type: "ai_q",
            qNum: data.metadata?.current_question || currentQNum + 1,
            topic: data.metadata?.topic || "Technical Evaluation",
            text: data.reply,
          },
        ]);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
      setError("Failed to process answer with backend service.");
    } finally {
      setIsThinking(false);
    }
  };

  const totalQuestions = metadata.total_questions || 8;
  const currentQNum = metadata.current_question || 1;
  const progressPct = Math.round((currentQNum / totalQuestions) * 100);

  // Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <Sparkles className="size-10 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-zinc-400 animate-pulse">
          Connecting to InterviewOS FastAPI Backend (localhost:8000)...
        </p>
      </div>
    );
  }

  // Render Final Summary Page when Interview Done
  if (isFinished && finalFeedback) {
    const avgScore = metadata.summary_metrics?.average_score ?? 8.5;
    const recommendation = metadata.summary_metrics?.recommendation || finalFeedback.summary;
    const strengths = metadata.summary_metrics?.strongest_topics || finalFeedback.strengths;
    const gaps = metadata.summary_metrics?.weakest_topics || finalFeedback.gaps;

    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500 selection:text-black">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/candidates"
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Cpu className="size-5 text-cyan-400" />
              <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                InterviewOS
              </span>
            </div>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs py-1 px-3">
            Assessment Completed
          </Badge>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Summary Hero Card */}
          <Card className="border border-cyan-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
            <CardHeader className="text-center space-y-3 pb-6 border-b border-white/5">
              <div className="mx-auto size-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Award className="size-8" />
              </div>
              <CardTitle className="text-2xl font-black text-white">
                Technical Interview Summary
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs max-w-md mx-auto">
                Final adaptive evaluation report for candidate <strong>{member.name}</strong> ({member.jobRole}).
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-white/10 bg-white/5 text-center space-y-1">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase">Average Score</p>
                  <p className="text-3xl font-black text-cyan-400">{avgScore} <span className="text-xs text-zinc-500">/ 10</span></p>
                </div>
                <div className="p-5 rounded-xl border border-white/10 bg-white/5 text-center space-y-1">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase">Duration</p>
                  <p className="text-3xl font-black text-purple-400">{formatTimer(elapsedSeconds)}</p>
                </div>
                <div className="p-5 rounded-xl border border-white/10 bg-white/5 text-center space-y-1">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase">Difficulty Tier</p>
                  <p className="text-2xl font-bold text-amber-400">{metadata.difficulty || "Expert"}</p>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className="p-5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 space-y-2">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="size-4" /> Recommendation
                </h4>
                <p className="text-sm font-medium text-white">{recommendation}</p>
              </div>

              {/* Strengths & Gaps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="size-4" /> Strongest Competencies
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="size-4" /> Identified Gap Areas
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {gaps.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/candidates" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm">
                    Back to Candidate Selection
                  </Button>
                </Link>
                <Link href={`/interview-plan/${candidateId}`} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm">
                    <RotateCcw className="mr-2 size-4" /> View Analysis Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Active Session Workspace View
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500 selection:text-black flex flex-col">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/candidates"
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{member.name}</span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs text-zinc-400 font-mono">{member.jobRole}</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500">Session ID: {sessionId}</p>
          </div>
        </div>

        {/* Center Progress & Timer */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">Progress:</span>
            <div className="w-32">
              <Progress value={progressPct} className="h-2 bg-zinc-800" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {currentQNum} / {totalQuestions}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Clock className="size-3.5 text-cyan-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs">
            {metadata.difficulty || "Expert"}
          </Badge>
        </div>

        {/* Right Badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Backend Connected
          </Badge>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: AI Card + Conversation Timeline */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          {/* Top Active AI Question Card */}
          <Card className="border border-cyan-500/30 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-950 text-white shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-5 text-cyan-400" />
                <CardTitle className="text-base font-bold text-white">
                  Active Question #{currentQNum}
                </CardTitle>
              </div>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono text-[11px]">
                {metadata.topic || "Core Systems"}
              </Badge>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <p className="text-sm md:text-base text-zinc-100 font-medium leading-relaxed">
                {currentQuestionText}
              </p>

              {/* Expected Rubric Points Preview */}
              {metadata.expected_points && metadata.expected_points.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="size-3.5 text-cyan-400" /> Expected Evaluation Rubric Points:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.expected_points.map((pt, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[11px] text-zinc-300 font-mono"
                      >
                        • {pt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation & Answer Timeline */}
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2">
            {chatHistory.map((item) => (
              <div key={item.id} className="space-y-2">
                {item.type === "ai_q" ? (
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                      <span>AI Interviewer • Q{item.qNum}</span>
                      <span>{item.topic}</span>
                    </div>
                    <p className="text-xs text-zinc-200">{item.text}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 ml-8 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                      <span>Candidate Response (Q{item.qNum})</span>
                      {item.evaluation && (
                        <span className="font-bold text-emerald-400">
                          Score: {item.evaluation.score} / 10
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-100">{item.text}</p>

                    {/* Live Evaluation Breakdown Card */}
                    {item.evaluation && (
                      <div className="pt-2 border-t border-cyan-500/20 space-y-2 text-[11px]">
                        <p className="text-emerald-300 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5" /> {item.evaluation.feedback}
                        </p>
                        {item.evaluation.covered_points.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-zinc-400">Covered:</span>
                            {item.evaluation.covered_points.map((pt, idx) => (
                              <span key={idx} className="text-emerald-400 font-mono">
                                [{pt}]
                              </span>
                            ))}
                          </div>
                        )}
                        {item.evaluation.missing_points.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-zinc-400">Missing:</span>
                            {item.evaluation.missing_points.map((pt, idx) => (
                              <span key={idx} className="text-amber-400 font-mono">
                                [{pt}]
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 flex items-center gap-3 text-cyan-300 text-xs animate-pulse">
                <Sparkles className="size-4 animate-spin text-cyan-400" />
                <span>AI AnswerEvaluator & QuestionGenerator processing response...</span>
              </div>
            )}
          </div>

          {/* Bottom Candidate Answer Input Box */}
          <div className="space-y-3">
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Type your technical response here (e.g. explain architecture, tradeoffs, implementation details)..."
              disabled={isThinking}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/90 p-4 text-xs md:text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none font-sans"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                Press Submit Answer to send to FastAPI backend endpoint
              </span>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answerInput.trim() || isThinking}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs px-6 py-2 h-10 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Send className="mr-2 size-3.5" />
                {isThinking ? "Evaluating..." : "Submit Answer"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Live Session Insights & Timeline Sidebar */}
        <div className="space-y-6">
          {/* Insights Card */}
          <Card className="border border-white/10 bg-zinc-900/60 backdrop-blur-xl text-white">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4 text-cyan-400" /> Live Interview Signals
                </CardTitle>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]">
                  Real-Time
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Last Score Evaluation:</span>
                <p className="font-bold text-emerald-400 text-sm">
                  {lastEvaluation ? `${lastEvaluation.score} / 10` : "Awaiting First Submission"}
                </p>
              </div>

              {lastEvaluation && (
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
                  <p className="text-emerald-300 text-[11px] font-medium">{lastEvaluation.feedback}</p>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Questions Progress</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {currentQNum} / {totalQuestions}
                  </span>
                </div>
                <Progress value={progressPct} className="h-1.5 bg-zinc-800" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
