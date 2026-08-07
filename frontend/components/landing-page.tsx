"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquareCode,
  Sparkles,
  BarChart3,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  Terminal,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-zinc-100 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Animated Gradient Mesh & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      
      {/* Ambient Animated Glow Orbs inspired by Linear / Vercel */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.4, 0.25],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-purple-600/30 rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-[600px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-pink-600/20 rounded-full blur-[150px]"
      />

      {/* Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-b from-zinc-700 to-zinc-900 border border-white/15 shadow-inner">
              <Cpu className="size-5 text-cyan-400" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md -z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Interview<span className="text-cyan-400">OS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Preview</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="glow" className="px-4 py-1.5 text-xs font-medium tracking-wide">
              <Sparkles className="size-3.5 mr-2 inline text-cyan-400 animate-pulse" />
              Next-Gen AI Technical Interviewer v1.0
            </Badge>
          </motion.div>

          {/* Main Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-balance"
          >
            The AI Interviewer that adapts like a{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              real Senior Engineer.
            </span>
          </motion.h1>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed text-balance"
          >
            InterviewOS conducts real-time technical assessments, dynamically adapting query difficulty, asking deep architectural follow-ups, and delivering senior-grade evaluations.
          </motion.p>

          {/* Hero Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 bg-zinc-100 text-black hover:bg-white font-semibold text-base shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all cursor-pointer group"
            >
              Start Interview
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 font-medium text-base cursor-pointer"
            >
              View Architecture
            </Button>
          </motion.div>

          {/* Animated Hero Card / Interactive Code & Dialogue Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 w-full max-w-4xl relative group"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-purple-500/30 opacity-50 blur-xl group-hover:opacity-75 transition duration-500" />
            
            <div className="relative rounded-xl border border-white/10 bg-zinc-950/90 shadow-2xl overflow-hidden text-left backdrop-blur-2xl">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-900/60">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-cyan-400" /> session_live // Candidate: Alex Dev
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    CONNECTED
                  </span>
                </div>
              </div>

              {/* Mock Dialogue Content */}
              <div className="p-6 font-mono text-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-xs shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-cyan-400/80 font-sans font-medium">Senior Technical Interviewer</p>
                    <p className="text-zinc-300 leading-relaxed font-sans">
                      &quot;I noticed you chose an in-memory sliding window for rate-limiting. How would your algorithm handle sudden horizontal scaling across 50 regional Kubernetes clusters?&quot;
                    </p>
                  </div>
                </div>

                <div className="pl-10">
                  <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-white/5 text-zinc-300 font-sans text-xs sm:text-sm space-y-2">
                    <p className="text-zinc-400 text-xs font-mono">// Candidate Response</p>
                    <p>&quot;I&apos;d transition to Redis with Lua scripts for atomic token bucket evaluation, utilizing dynamic cluster hashing to prevent single-node bottlenecking.&quot;</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-xs shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-emerald-400/80 font-sans font-medium">Adaptive Evaluation Engine</p>
                    <div className="flex items-center gap-2 font-sans text-xs">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">Depth Rating: 9.4/10</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">Distributed Systems: Mastery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="relative py-24 px-6 border-t border-white/5 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="glow">Architected for Depth</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Built to mimic top 1% tech screeners
            </h2>
            <p className="text-zinc-400 text-base">
              Unlike static quiz bots, InterviewOS dynamically tailors its conversation based on real-time candidate reasoning and technical rigor.
            </p>
          </div>

          {/* Grid of 4 Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: Adaptive Interview */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-white/10 bg-zinc-950/80 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group transition-all">
                <CardHeader>
                  <div className="size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="size-6" />
                  </div>
                  <CardTitle className="text-xl">Adaptive Interview</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Dynamic difficulty scaling based on candidate responses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400 text-sm leading-relaxed">
                  The interview engine continuously evaluates answer accuracy, conceptual depth, and speed—scaling problem complexity from core algorithms up to distributed system design in real time.
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2: Follow-up Questions */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-white/10 bg-zinc-950/80 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] group transition-all">
                <CardHeader>
                  <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquareCode className="size-6" />
                  </div>
                  <CardTitle className="text-xl">Follow-up Questions</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Context-aware probing into trade-offs and edge cases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400 text-sm leading-relaxed">
                  Never satisfied with surface-level code, InterviewOS probes edge cases, time/space complexity trade-offs, network failure scenarios, and memory bottlenecks just like a Staff Engineer.
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3: Technical Evaluation */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-white/10 bg-zinc-950/80 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] group transition-all">
                <CardHeader>
                  <div className="size-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="size-6" />
                  </div>
                  <CardTitle className="text-xl">Technical Evaluation</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Multi-dimensional rubric scoring across key engineering pillars.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400 text-sm leading-relaxed">
                  Automated objective evaluation of code correctness, syntax purity, architectural scalability, system resilience, and clear engineering communication.
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 4: Personalized Feedback */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-white/10 bg-zinc-950/80 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group transition-all">
                <CardHeader>
                  <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="size-6" />
                  </div>
                  <CardTitle className="text-xl">Personalized Feedback</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Actionable report with senior engineer insights.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400 text-sm leading-relaxed">
                  Receive comprehensive score breakdowns, key strengths, targeted areas for improvement, and benchmark metrics against industry peer standards.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURE PREVIEW SECTION */}
      <section id="architecture" className="relative py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="glow">Seamless Pipeline</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              End-to-End Interview Workflow
            </h2>
            <p className="text-zinc-400 text-base">
              A transparent, multi-stage evaluation pipeline engineered for precision and speed.
            </p>
          </div>

          {/* Workflow Cards Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: Candidate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-xl border border-white/10 bg-zinc-950/70 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      STEP 01
                    </span>
                    <Code2 className="size-5 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Candidate</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Submits candidate profile, target seniority level, and starts the live coding/architectural assessment.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center text-xs text-zinc-500 font-mono">
                  Input: Code + Voice/Text
                </div>
              </div>
            </motion.div>

            {/* Step 2: AI Interview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-xl border border-white/10 bg-zinc-950/70 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      STEP 02
                    </span>
                    <Brain className="size-5 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Interview</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Adaptive dialogue model conducts dynamic questioning, live code execution checks, and probing follow-ups.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center text-xs text-zinc-500 font-mono">
                  Process: Real-time LLM
                </div>
              </div>
            </motion.div>

            {/* Step 3: Evaluation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-xl border border-white/10 bg-zinc-950/70 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-violet-400 font-bold px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                      STEP 03
                    </span>
                    <Layers className="size-5 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Evaluation</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Multi-criteria grading engine scores problem solving, architectural trade-offs, and code efficiency.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center text-xs text-zinc-500 font-mono">
                  Analysis: Rubric Engine
                </div>
              </div>
            </motion.div>

            {/* Step 4: Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-xl border border-white/10 bg-zinc-950/70 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      STEP 04
                    </span>
                    <FileCheck className="size-5 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Feedback</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Generates detailed engineering report, benchmark rank, strengths, and actionable roadmap for growth.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center text-xs text-zinc-500 font-mono">
                  Output: Detailed Report
                </div>
              </div>
            </motion.div>
          </div>

          {/* Workflow Visual Flow Bar */}
          <div className="mt-12 p-6 rounded-xl border border-white/10 bg-zinc-950/60 backdrop-blur-md hidden md:flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-2 text-cyan-400">
              <CheckCircle2 className="size-4" /> Candidate Init
            </span>
            <ChevronRight className="size-4 text-zinc-600" />
            <span className="flex items-center gap-2 text-indigo-400">
              <Zap className="size-4" /> Adaptive Reasoning Engine
            </span>
            <ChevronRight className="size-4 text-zinc-600" />
            <span className="flex items-center gap-2 text-violet-400">
              <BarChart3 className="size-4" /> Rubric Evaluation
            </span>
            <ChevronRight className="size-4 text-zinc-600" />
            <span className="flex items-center gap-2 text-emerald-400">
              <FileCheck className="size-4" /> Senior Engineer Report
            </span>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="relative border-t border-white/10 bg-zinc-950 py-12 px-6 text-zinc-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-cyan-400" />
              <span className="font-bold text-white tracking-tight">InterviewOS</span>
            </div>
            <p className="text-xs text-zinc-500">
              The AI Interviewer that adapts like a real Senior Engineer.
            </p>
          </div>

          {/* Center Operational Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300">All Systems Operational</span>
          </div>

          {/* Right Side Links & Copyright */}
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg> GitHub
            </a>
            <span>&copy; {new Date().getFullYear()} InterviewOS. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
