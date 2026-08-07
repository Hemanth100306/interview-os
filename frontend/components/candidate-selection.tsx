"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Cpu,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import candidatesData from "@/data/candidates.json";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  education: string;
  missionsCompleted: number;
  totalMissions: number;
  firstTrySuccess: number;
  commitDays: number;
  status: "Ready for Assessment" | "Interview Pending" | "In Review";
  progress: number;
  badges: ("Strong Candidate" | "Needs Improvement" | "Skipped Topics" | "High Accuracy" | "Fast Learner")[];
  avatarInitials: string;
}

function getAvatarInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function deriveBadges(candidate: (typeof candidatesData.candidates)[number]): Candidate["badges"] {
  const badges: Candidate["badges"] = [];
  const { commitDays, missionsCompleted, missionsFirstTry } = candidate.signals;
  const hasSkipped = candidate.missions.some((m) => "skipped" in m && m.skipped);
  const firstTryRatio = missionsCompleted > 0 ? missionsFirstTry / missionsCompleted : 0;

  if (firstTryRatio >= 0.65 || (missionsCompleted >= 28 && missionsFirstTry >= 18)) {
    badges.push("Strong Candidate");
  }

  if (firstTryRatio < 0.35 || commitDays < 15 || candidate.missions.filter((m) => "passed" in m && !m.passed).length >= 2) {
    badges.push("Needs Improvement");
  }

  if (hasSkipped) {
    badges.push("Skipped Topics");
  }

  if (firstTryRatio >= 0.85) {
    badges.push("High Accuracy");
  } else if (commitDays >= 28 && firstTryRatio >= 0.7) {
    badges.push("Fast Learner");
  }

  if (badges.length === 0) {
    badges.push("Strong Candidate");
  }

  return badges;
}

const CANDIDATES: Candidate[] = candidatesData.candidates.map((c) => {
  const totalMissions = 31;
  const progress = Math.min(100, Math.round((c.signals.missionsCompleted / totalMissions) * 100));

  return {
    id: c.member.id,
    name: c.member.name,
    role: c.member.jobRole,
    experience: `${c.member.yearsExperience} yrs`,
    education: c.member.education,
    missionsCompleted: c.signals.missionsCompleted,
    totalMissions,
    firstTrySuccess: c.signals.missionsFirstTry,
    commitDays: c.signals.commitDays,
    status: c.member.status === "COMPLETED" ? "Ready for Assessment" : "In Review",
    progress,
    badges: deriveBadges(c),
    avatarInitials: getAvatarInitials(c.member.name),
  };
});

export function CandidateSelection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredCandidates = useMemo(() => {
    return CANDIDATES.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.education.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === "All") return true;
      if (selectedFilter === "Strong Candidate")
        return candidate.badges.includes("Strong Candidate");
      if (selectedFilter === "Needs Improvement")
        return candidate.badges.includes("Needs Improvement");
      if (selectedFilter === "Skipped Topics")
        return candidate.badges.includes("Skipped Topics");

      return true;
    });
  }, [searchQuery, selectedFilter]);

  const readyCount = useMemo(() => {
    return CANDIDATES.filter((c) => c.status === "Ready for Assessment").length;
  }, []);

  const avgPassRate = useMemo(() => {
    const total = CANDIDATES.reduce((acc, c) => acc + c.progress, 0);
    return (total / CANDIDATES.length).toFixed(1);
  }, []);

  const renderBadge = (badge: Candidate["badges"][number]) => {
    switch (badge) {
      case "Strong Candidate":
        return (
          <Badge key={badge} variant="emerald" className="gap-1 font-mono text-[11px]">
            <Sparkles className="size-3" /> Strong Candidate
          </Badge>
        );
      case "Needs Improvement":
        return (
          <Badge key={badge} className="border-amber-500/30 bg-amber-500/10 text-amber-400 gap-1 font-mono text-[11px]">
            <AlertCircle className="size-3" /> Needs Improvement
          </Badge>
        );
      case "Skipped Topics":
        return (
          <Badge key={badge} variant="violet" className="gap-1 font-mono text-[11px]">
            <Clock className="size-3" /> Skipped Topics
          </Badge>
        );
      case "High Accuracy":
        return (
          <Badge key={badge} variant="glow" className="gap-1 font-mono text-[11px]">
            <Target className="size-3" /> High Accuracy
          </Badge>
        );
      case "Fast Learner":
        return (
          <Badge key={badge} className="border-sky-500/30 bg-sky-500/10 text-sky-400 gap-1 font-mono text-[11px]">
            <TrendingUp className="size-3" /> Fast Learner
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Subtle Gradient Mesh */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium pr-2 border-r border-white/10"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Landing Page</span>
            </Link>
            
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center size-8 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-900 border border-white/15">
                <Cpu className="size-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Interview<span className="text-cyan-400">OS</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hidden md:inline">
                Candidates Portal
              </span>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search candidate by name, role, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 bg-zinc-900/80 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
          </div>

          {/* Filter Option Buttons (UI Filters) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900/80 p-1 rounded-lg border border-white/10 text-xs">
              {["All", "Strong Candidate", "Needs Improvement", "Skipped Topics"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? "bg-zinc-800 text-white shadow-sm border border-white/10"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="p-4 border-b border-white/5 bg-zinc-950 block sm:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-zinc-900 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 relative">
        {/* Title & Stats Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Candidate Selection
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {filteredCandidates.length} Available
              </span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Select a candidate to initiate their AI-driven adaptive technical evaluation.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Ready</p>
                <p className="text-sm font-bold text-white">{readyCount} Candidates</p>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Award className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Avg Pass Rate</p>
                <p className="text-sm font-bold text-white">{avgPassRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="h-full border-white/10 bg-zinc-950/80 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/5 bg-zinc-900/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Initials */}
                      <div className="size-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/15 flex items-center justify-center text-sm font-bold text-cyan-400 shadow-inner shrink-0">
                        {candidate.avatarInitials}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {candidate.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="size-3 text-zinc-500" />
                          {candidate.role}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      {candidate.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 flex-1">
                  {/* Years of Experience & Education */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">Experience</p>
                      <p className="font-semibold text-zinc-200 mt-0.5">{candidate.experience}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">Commit Days</p>
                      <p className="font-semibold text-zinc-200 mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3 text-cyan-400" />
                        {candidate.commitDays} days
                      </p>
                    </div>
                  </div>

                  {/* Education Line */}
                  <div className="text-xs text-zinc-400 flex items-start gap-1.5 pt-1">
                    <GraduationCap className="size-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="truncate">{candidate.education}</span>
                  </div>

                  {/* Progress Bar & Missions Info */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Target className="size-3 text-cyan-400" />
                        Missions: {candidate.missionsCompleted} / {candidate.totalMissions}
                      </span>
                      <span className="text-cyan-400 font-bold">{candidate.progress}%</span>
                    </div>
                    <Progress value={candidate.progress} />
                  </div>

                  {/* Metrics Summary Row */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <CheckCircle2 className="size-3 text-emerald-400" />
                      First-Try Success: <strong className="text-white">{candidate.firstTrySuccess}</strong>
                    </span>
                  </div>

                  {/* Badges Container */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {candidate.badges.map((b) => renderBadge(b))}
                  </div>
                </CardContent>

                {/* Footer Action Button */}
                <div className="p-4 pt-0">
                  <Link href={`/interview-plan/${candidate.id}`}>
                    <Button
                      className="w-full bg-zinc-900 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-black text-white font-semibold text-xs border border-white/10 hover:border-transparent transition-all duration-300 cursor-pointer group/btn"
                    >
                      Start Interview
                      <ArrowRight className="ml-1.5 size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/50 space-y-3">
            <Search className="size-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-300 text-sm font-semibold">No candidates match your current filter</p>
            <p className="text-zinc-500 text-xs">Try clearing your search query or selecting &quot;All&quot;</p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("All");
              }}
              className="mt-2 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
