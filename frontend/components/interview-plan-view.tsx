"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Brain,
  Clock,
  HelpCircle,
  Layers,
  Sparkles,
  AlertCircle,
  Play,
  Check,
  Target,
  FileCode2,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import candidatesData from "@/data/candidates.json";

interface InterviewPlanViewProps {
  candidateId: string;
}

export function InterviewPlanView({ candidateId }: InterviewPlanViewProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [checklistStep, setChecklistStep] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Find candidate in JSON data or default to first
  const rawCandidate =
    candidatesData.candidates.find((c) => c.member.id === candidateId) ||
    candidatesData.candidates[0];

  const { member, missions, signals } = rawCandidate;

  // Derive initial avatar
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Derive skipped and weak topics
  const skippedMissions = missions.filter((m) => "skipped" in m && m.skipped);
  const multiAttemptMissions = missions.filter(
    (m) => "attempts" in m && m.attempts && m.attempts > 2
  );
  const passedFirstTry = missions.filter((m) => "attempts" in m && m.attempts === 1);

  // Derive Focus Days
  const targetDays = Array.from(
    new Set([
      ...skippedMissions.map((m) => `Day ${m.day}`),
      ...multiAttemptMissions.map((m) => `Day ${m.day}`),
      "Day 7",
      "Day 22",
      "Day 28",
    ])
  ).slice(0, 5);

  // 2-second loading animation sequence
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 20 && pct < 40) setChecklistStep(1);
      else if (pct >= 40 && pct < 60) setChecklistStep(2);
      else if (pct >= 60 && pct < 80) setChecklistStep(3);
      else if (pct >= 80 && pct < 100) setChecklistStep(4);
      else if (pct >= 100) {
        setChecklistStep(5);
        clearInterval(interval);
        setTimeout(() => setLoading(false), 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const checklistItems = [
    "Reading Candidate Profile",
    "Analyzing Learning Signals",
    "Identifying Weak Areas",
    "Selecting Curriculum Topics",
    "Building Interview Plan",
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/candidates"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium pr-2 border-r border-white/10"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Candidates</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center size-8 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-900 border border-white/15">
                <Cpu className="size-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Interview<span className="text-cyan-400">OS</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Plan Generator
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {loading ? (
            /* 1. ANIMATED AI LOADING STATE (0-2 SECONDS) */
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
            >
              {/* Pulsing AI Glowing Ring Icon */}
              <div className="relative size-20 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                <Brain className="size-10 text-cyan-400 animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-3xl border border-cyan-500/30 border-t-cyan-400 -z-10"
                />
              </div>

              {/* Loading Title & Progress Bar */}
              <div className="space-y-3 max-w-md w-full">
                <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
                  Preparing Adaptive Interview...
                </h2>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>AI Engine Processing</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                </div>
              </div>

              {/* Animated Checklist Steps */}
              <div className="w-full max-w-md bg-zinc-950/80 border border-white/10 rounded-xl p-5 space-y-3 text-left backdrop-blur-xl">
                {checklistItems.map((item, index) => {
                  const isDone = checklistStep > index;
                  const isCurrent = checklistStep === index;

                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: isDone || isCurrent ? 1 : 0.3,
                        x: 0,
                      }}
                      className="flex items-center gap-3 text-xs font-mono"
                    >
                      <div
                        className={`size-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : isCurrent
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse"
                            : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                        }`}
                      >
                        {isDone ? <Check className="size-3" /> : index + 1}
                      </div>
                      <span
                        className={
                          isDone
                            ? "text-zinc-200 font-semibold"
                            : isCurrent
                            ? "text-cyan-300 font-medium"
                            : "text-zinc-500"
                        }
                      >
                        {isDone ? `✓ ${item}` : item}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* 2. REVEALED INTERVIEW PLAN CARD */
            <motion.div
              key="plan-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Top Banner Card */}
              <div className="relative rounded-2xl border border-white/10 bg-zinc-950/90 p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-20">
                  <Brain className="size-48 text-cyan-500" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/20 flex items-center justify-center text-xl font-bold text-cyan-400 shadow-inner shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="glow" className="text-[10px] font-mono">
                          AI PLAN GENERATED
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">ID: {member.id}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {member.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2 mt-0.5">
                        <Briefcase className="size-3.5 text-zinc-500" />
                        {member.jobRole}
                        <span className="text-zinc-600">•</span>
                        <GraduationCap className="size-3.5 text-zinc-500" />
                        {member.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1.5 border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                      Target Seniority Level
                    </span>
                    <span className="text-sm font-bold text-cyan-400 font-mono px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      {member.yearsExperience >= 8
                        ? "Staff / Level 5 (Adaptive Depth 9.5/10)"
                        : member.yearsExperience >= 5
                        ? "Senior / Level 4 (Adaptive Depth 8.5/10)"
                        : "Mid-Level / Level 3 (Adaptive Depth 7.0/10)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-white/10 bg-zinc-950/80">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                      <Target className="size-3 text-cyan-400" /> Difficulty Level
                    </CardDescription>
                    <CardTitle className="text-sm font-bold text-white">
                      {member.yearsExperience >= 6 ? "Senior Adaptive" : "Mid-Senior Standard"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-zinc-400">
                    Scales dynamically based on real-time code precision.
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-zinc-950/80">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                      <Clock className="size-3 text-indigo-400" /> Estimated Duration
                    </CardDescription>
                    <CardTitle className="text-sm font-bold text-white">25 - 30 minutes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-zinc-400">
                    Includes coding assessment & system follow-ups.
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-zinc-950/80">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                      <HelpCircle className="size-3 text-violet-400" /> Question Count
                    </CardDescription>
                    <CardTitle className="text-sm font-bold text-white">5 Core + Probing</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-zinc-400">
                    Deep probing into architecture & edge cases.
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-zinc-950/80">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="size-3 text-emerald-400" /> Curriculum Days
                    </CardDescription>
                    <CardTitle className="text-sm font-bold text-white font-mono">
                      {targetDays.join(", ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-zinc-400">
                    Key cohort days selected for evaluation.
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Evaluation Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Focus Areas */}
                <Card className="border-white/10 bg-zinc-950/80 md:col-span-1">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="size-4 text-cyan-400" />
                      Focus Areas
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Curriculum modules selected for deep evaluation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                      <p className="font-semibold text-cyan-300 font-mono">Embeddings & Vector Search</p>
                      <p className="text-zinc-400 text-[11px]">ChromaDB, Semantic Retrieval, Cosine Similarity</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                      <p className="font-semibold text-indigo-300 font-mono">Agentic AI & MCP</p>
                      <p className="text-zinc-400 text-[11px]">Multi-Agent Orchestration, Tool Calling Protocols</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                      <p className="font-semibold text-violet-300 font-mono">Docker & K8s Deployment</p>
                      <p className="text-zinc-400 text-[11px]">Containerization, Health Probes, Scaling</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Strengths */}
                <Card className="border-white/10 bg-zinc-950/80 md:col-span-1">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="size-4 text-emerald-400" />
                      Candidate Strengths
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Verified competencies from cohort signals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        High First-Try Success: <strong className="text-white">{signals.missionsFirstTry} / {signals.missionsCompleted}</strong> missions passed on first attempt.
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Commit Velocity: <strong className="text-white">{signals.commitDays} active days</strong> of consistent code delivery.
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Demonstrated mastery in core LLM integration and API orchestration.
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Weak Areas / Skipped Topics */}
                <Card className="border-white/10 bg-zinc-950/80 md:col-span-1">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <AlertCircle className="size-4 text-amber-400" />
                      Weak Areas & Skipped
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Identified gap areas to probe during interview.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2.5 text-xs">
                    {skippedMissions.length > 0 ? (
                      skippedMissions.map((m) => (
                        <div key={m.day} className="flex items-start gap-2 text-amber-300">
                          <ShieldAlert className="size-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            Skipped Day {m.day}: <strong>{m.title}</strong>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-2 text-zinc-400">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>No skipped modules detected in candidate history.</span>
                      </div>
                    )}

                    {multiAttemptMissions.length > 0 && (
                      <div className="pt-2 border-t border-white/5 text-zinc-400 space-y-1">
                        <p className="text-[11px] font-mono text-zinc-500 uppercase">Multi-attempt Topics:</p>
                        {multiAttemptMissions.map((m) => (
                          <p key={m.day} className="text-zinc-300 text-[11px]">
                            • Day {m.day}: {m.title} ({m.attempts} attempts)
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Primary Action Card */}
              <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-indigo-950/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                    <Zap className="size-5 text-cyan-400" />
                    Adaptive Session Ready
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-lg">
                    The AI Interviewer is initialized with {member.name}&apos;s profile, custom curriculum probes, and difficulty scaling rules.
                  </p>
                </div>

                <Link href="/interview/demo-session-001" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
                  >
                    <Play className="mr-2 size-4 fill-black" />
                    Start Adaptive Interview
                  </Button>
                </Link>
              </div>

              {/* Toast / Notification when Start Adaptive Interview is clicked */}
              {sessionStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <Sparkles className="size-4 animate-spin" />
                  Interview Session Configured for {member.name}. Waiting for session launch...
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
