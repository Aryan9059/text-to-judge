"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import IdeaInput from "@/components/IdeaInput";
import ProblemPanel from "@/components/ProblemPanel";
import OutputPanel from "@/components/OutputPanel";
import type { GeneratedProblem } from "@/lib/groq";
import type { JudgeResult } from "@/lib/judge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PublishModal from "@/components/PublishModal";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="panel"
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="spinner" />
    </div>
  ),
});

const DEFAULT_CODE = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    
    
    return 0;
}
`;

// ── Custom resizable hook ────────────────────────────────────────────────────
function useResize(
  initial: number,
  min: number,
  max: number,
  direction: "horizontal" | "vertical"
) {
  const [size, setSize] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ pos: number; size: number } | null>(null);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      startRef.current = {
        pos: direction === "horizontal" ? e.clientX : e.clientY,
        size,
      };
    },
    [size, direction]
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      if (!startRef.current) return;
      const delta =
        direction === "horizontal"
          ? e.clientX - startRef.current.pos
          : e.clientY - startRef.current.pos;
      const next = Math.min(max, Math.max(min, startRef.current.size + delta));
      setSize(next);
    };

    const onUp = () => setDragging(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging, direction, min, max]);

  return { size, dragging, onMouseDown };
}

export default function Workspace() {
  return (
    <Suspense fallback={<div className="min-h-screen bg--bg-primary flex items-center justify-center"><div className="spinner" /></div>}>
      <WorkspaceContent />
    </Suspense>
  );
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const problemIdFromUrl = searchParams.get("id");

  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isRegeneratingTests, setIsRegeneratingTests] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [reviewContent, setReviewContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [dbProblemId, setDbProblemId] = useState<string | null>(null);

  // Sync with URL ID
  useEffect(() => {
    if (problemIdFromUrl && !dbProblemId) {
      const fetchProblem = async () => {
        setIsGenerating(true);
        setError(null);
        try {
          const res = await fetch(`/api/problems/${problemIdFromUrl}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Problem not found");
          setProblem(data.problem);
          setDbProblemId(problemIdFromUrl);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsGenerating(false);
        }
      };
      fetchProblem();
    }
  }, [problemIdFromUrl, dbProblemId]);

  // ── Resizable split state (% of total width for left panel) ─────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState(45);
  const [hDragging, setHDragging] = useState(false);
  const hStart = useRef<{ x: number; pct: number } | null>(null);

  const onHMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setHDragging(true);
    hStart.current = { x: e.clientX, pct: leftPct };
  };

  useEffect(() => {
    if (!hDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!hStart.current || !containerRef.current) return;
      const totalW = containerRef.current.getBoundingClientRect().width;
      const delta = e.clientX - hStart.current.x;
      const deltaPct = (delta / totalW) * 100;
      setLeftPct(Math.min(75, Math.max(20, hStart.current.pct + deltaPct)));
    };
    const onUp = () => setHDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [hDragging]);

  // ── Vertical split state for right column (% of remaining height) ────────
  const rightColRef = useRef<HTMLDivElement>(null);
  const [topPct, setTopPct] = useState(55);
  const [vDragging, setVDragging] = useState(false);
  const vStart = useRef<{ y: number; pct: number } | null>(null);

  const onVMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setVDragging(true);
    vStart.current = { y: e.clientY, pct: topPct };
  };

  useEffect(() => {
    if (!vDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!vStart.current || !rightColRef.current) return;
      const totalH = rightColRef.current.getBoundingClientRect().height;
      const delta = e.clientY - vStart.current.y;
      const deltaPct = (delta / totalH) * 100;
      setTopPct(Math.min(80, Math.max(20, vStart.current.pct + deltaPct)));
    };
    const onUp = () => setVDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [vDragging]);

  const handleGenerate = useCallback(async (idea: string) => {
    setIsGenerating(true);
    setError(null);
    setProblem(null);
    setJudgeResult(null);
    setConsoleOutput(null);
    setReviewContent(null);
    setCode(DEFAULT_CODE);
    setDbProblemId(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate problem");
      }

      setProblem(data.problem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleRegenerateTests = useCallback(async () => {
    if (!problem) return;
    setIsRegeneratingTests(true);
    setError(null);
    setJudgeResult(null);
    setConsoleOutput(null);

    try {
      const res = await fetch("/api/regenerate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to regenerate test cases");
      }

      setProblem((prev) =>
        prev ? { ...prev, sampleCases: data.sampleCases, hiddenCases: data.hiddenCases } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test case regeneration failed");
    } finally {
      setIsRegeneratingTests(false);
    }
  }, [problem]);

  const handleRun = useCallback(async () => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOutput(null);
    setJudgeResult(null);
    setError(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          sampleCases: problem.sampleCases,
          hiddenCases: [],
          mode: "run",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to run code");
      }

      setJudgeResult(data.result);

      const output = data.result.results
        .map((r: { index: number; compilationError?: string; actualOutput: string; stderr: string }) => {
          if (r.compilationError) {
            return `=== Compilation Error ===\n${r.compilationError}`;
          }
          let s = `=== Test Case ${r.index + 1} ===\n`;
          if (r.actualOutput) s += r.actualOutput;
          if (r.stderr) s += `\n[stderr] ${r.stderr}`;
          return s;
        })
        .join("\n\n");

      setConsoleOutput(output || "(no output)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
      setConsoleOutput(
        `Error: ${err instanceof Error ? err.message : "Run failed"}`
      );
    } finally {
      setIsRunning(false);
    }
  }, [problem, code]);

  const handleSaveProblem = useCallback(async () => {
    if (!problem || dbProblemId) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/problems/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save problem");

      setDbProblemId(data.problemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saving failed");
    } finally {
      setIsSaving(false);
    }
  }, [problem, dbProblemId]);


  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setJudgeResult(null);
    setError(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          sampleCases: problem.sampleCases,
          hiddenCases: problem.hiddenCases || [],
          mode: "submit",
          problemId: dbProblemId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setJudgeResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, dbProblemId]);


  const handleReview = useCallback(async () => {
    if (!problem || !code.trim()) return;
    setIsReviewing(true);
    setReviewContent(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, problem }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Review failed");
      }

      setReviewContent(data.review);
    } catch (err) {
      setReviewContent(
        `Error: ${err instanceof Error ? err.message : "Review failed"}`
      );
    } finally {
      setIsReviewing(false);
    }
  }, [problem, code]);

  const handlePublish = async (data: any) => {
    if (!dbProblemId) return;
    try {
      const res = await fetch("/api/problems/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: dbProblemId,
          ...data,
        }),
      });

      if (res.ok) {
        setPublishOpen(false);
        // Refresh local state to show "Public" badge
        setProblem(prev => prev ? { ...prev, isPublic: true } : prev);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to publish problem");
    }
  };

  return (
    <div
      className={hDragging || vDragging ? "no-select-all" : ""}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <header
        className="glass-subtle"
        style={{
          padding: "10px 20px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: "1.2rem" }}>⚖️</span>
          <span
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Text<span style={{ color: "var(--accent-primary)" }}>Judge</span>
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "var(--surface-glass-border)", flexShrink: 0 }} />

        {/* Links */}
        <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
          <Link
            href="/explore"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            className="hover-text-primary transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            className="hover-text-primary transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "var(--surface-glass-border)", flexShrink: 0 }} />

        {/* Idea input — takes remaining space */}
        <div style={{ flex: 1 }}>
          <IdeaInput onGenerate={handleGenerate} isLoading={isGenerating} />
        </div>
      </header>

      {/* ── Error bar ──────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(239, 71, 67, 0.08)",
            borderBottom: "1px solid rgba(239, 71, 67, 0.2)",
            color: "var(--accent-red)",
            fontSize: "0.8125rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span>⚠ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-red)",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Main resizable workspace ───────────────────── */}
      <main
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Left: Problem Panel */}
        <div
          style={{
            width: `${leftPct}%`,
            minHeight: 0,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <ProblemPanel
            problem={problem}
            isLoading={isGenerating}
            onRegenerateTests={handleRegenerateTests}
            isRegeneratingTests={isRegeneratingTests}
            onSave={handleSaveProblem}
            isSaving={isSaving}
            isSaved={!!dbProblemId}
            onPublish={() => setPublishOpen(true)}
          />
        </div>

        {/* Horizontal resizer */}
        <div
          className={`resizer-h${hDragging ? " dragging" : ""}`}
          onMouseDown={onHMouseDown}
          title="Drag to resize"
        />

        {/* Right: Editor + Output stacked vertically with resizer */}
        <div
          ref={rightColRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Top: Code Editor */}
          <div style={{ height: `${topPct}%`, minHeight: 0, overflow: "hidden" }}>
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              hasProblem={!!problem}
            />
          </div>

          {/* Vertical resizer */}
          <div
            className={`resizer-v${vDragging ? " dragging" : ""}`}
            onMouseDown={onVMouseDown}
            title="Drag to resize"
          />

          {/* Bottom: Output Panel */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <OutputPanel
              judgeResult={judgeResult}
              consoleOutput={consoleOutput}
              reviewContent={reviewContent}
              isReviewing={isReviewing}
              onRequestReview={handleReview}
              hasProblem={!!problem}
              hasCode={code.trim().length > 0}
            />
          </div>
        </div>
      </main>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onConfirm={handlePublish}
        problem={problem}
      />
    </div>
  );
}
