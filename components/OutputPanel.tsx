"use client";

import { useState } from "react";
import VerdictBadge from "./VerdictBadge";
import type { JudgeResult, TestCaseResult } from "@/lib/judge";

type OutputTab = "console" | "results" | "review";

interface OutputPanelProps {
  judgeResult: JudgeResult | null;
  consoleOutput: string | null;
  reviewContent: string | null;
  isReviewing: boolean;
  onRequestReview: () => void;
  hasProblem: boolean;
  hasCode: boolean;
}

function TestCaseRow({ result }: { result: TestCaseResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--surface-glass-border)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <VerdictBadge verdict={result.verdict} />
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            {result.isHidden ? "Hidden " : ""}Case {result.index + 1}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            {result.executionTimeMs}ms
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform var(--transition-fast)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            padding: "0 14px 14px",
            borderTop: "1px solid var(--surface-glass-border)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            animation: "fadeIn 150ms ease-out",
          }}
        >
          {/* Input */}
          {!result.isHidden && (
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Input
              </div>
              <pre className="code-block" style={{ margin: 0, fontSize: "0.8rem", padding: "8px 10px" }}>
                {result.input}
              </pre>
            </div>
          )}

          {/* Expected vs Actual */}
          {result.verdict !== "CE" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "var(--accent-emerald)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Expected
                </div>
                <pre
                  className="code-block"
                  style={{ margin: 0, fontSize: "0.8rem", padding: "8px 10px" }}
                >
                  {result.isHidden ? "(hidden)" : result.expectedOutput}
                </pre>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color:
                      result.verdict === "AC"
                        ? "var(--accent-emerald)"
                        : "var(--accent-rose)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Actual
                </div>
                <pre
                  className="code-block"
                  style={{ margin: 0, fontSize: "0.8rem", padding: "8px 10px" }}
                >
                  {result.actualOutput || "(no output)"}
                </pre>
              </div>
            </div>
          )}

          {/* Stderr */}
          {result.stderr && (
            <div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "var(--accent-rose)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Error Output
              </div>
              <pre
                className="code-block"
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  padding: "8px 10px",
                  color: "var(--accent-rose)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                }}
              >
                {result.stderr}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code style="background:var(--bg-primary);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:0.8em">$1</code>')
    .replace(/^### (.*$)/gm, '<h4 style="font-size:0.9rem;font-weight:700;color:var(--accent-indigo);margin-top:16px;margin-bottom:6px">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 style="font-size:1rem;font-weight:700;color:var(--accent-violet);margin-top:20px;margin-bottom:8px">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-top:20px;margin-bottom:8px">$1</h2>')
    .replace(/^- (.*$)/gm, '<li style="margin-left:16px;margin-bottom:4px;list-style:disc">$1</li>')
    .replace(/\n/g, "<br>");
}

export default function OutputPanel({
  judgeResult,
  consoleOutput,
  reviewContent,
  isReviewing,
  onRequestReview,
  hasProblem,
  hasCode,
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>("console");

  return (
    <div
      className="panel"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="panel-header" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Output</h3>
          {judgeResult && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <VerdictBadge verdict={judgeResult.overallVerdict} large />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {judgeResult.totalPassed}/{judgeResult.totalCases} passed
              </span>
            </div>
          )}
        </div>
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            Console
          </button>
          <button
            className={`tab ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
          >
            Test Results
            {judgeResult && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: "0.7rem",
                  padding: "1px 6px",
                  borderRadius: 999,
                  background:
                    judgeResult.overallVerdict === "AC"
                      ? "rgba(52, 211, 153, 0.15)"
                      : "rgba(244, 63, 94, 0.15)",
                  color:
                    judgeResult.overallVerdict === "AC"
                      ? "var(--accent-emerald)"
                      : "var(--accent-rose)",
                }}
              >
                {judgeResult.totalPassed}/{judgeResult.totalCases}
              </span>
            )}
          </button>
          <button
            className={`tab ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            AI Review
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {/* Console Tab */}
        {activeTab === "console" && (
          <div>
            {consoleOutput !== null ? (
              <pre
                className="code-block animate-fade-in"
                style={{
                  fontSize: "0.8125rem",
                  minHeight: 100,
                  whiteSpace: "pre-wrap",
                }}
              >
                {consoleOutput || "(no output)"}
              </pre>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 150,
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  gap: 8,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ opacity: 0.4 }}
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Run your code to see output here
              </div>
            )}
          </div>
        )}

        {/* Test Results Tab */}
        {activeTab === "results" && (
          <div>
            {judgeResult ? (
              <div
                className="animate-fade-in"
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {/* Overall verdict banner */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    background:
                      judgeResult.overallVerdict === "AC"
                        ? "rgba(52, 211, 153, 0.08)"
                        : "rgba(244, 63, 94, 0.08)",
                    border: `1px solid ${
                      judgeResult.overallVerdict === "AC"
                        ? "rgba(52, 211, 153, 0.2)"
                        : "rgba(244, 63, 94, 0.2)"
                    }`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <VerdictBadge verdict={judgeResult.overallVerdict} large />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {judgeResult.totalPassed}/{judgeResult.totalCases} test cases
                    passed
                  </span>
                </div>

                {/* Compilation error */}
                {judgeResult.compilationError && (
                  <div
                    style={{
                      padding: 14,
                      borderRadius: "var(--radius-md)",
                      background: "rgba(244, 63, 94, 0.06)",
                      border: "1px solid rgba(244, 63, 94, 0.15)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--accent-rose)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                      }}
                    >
                      Compilation Error
                    </div>
                    <pre
                      className="code-block"
                      style={{
                        margin: 0,
                        color: "var(--accent-rose)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {judgeResult.compilationError}
                    </pre>
                  </div>
                )}

                {/* Per-case results */}
                {judgeResult.results.map((r) => (
                  <TestCaseRow key={r.index} result={r} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 150,
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  gap: 8,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ opacity: 0.4 }}
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                Submit your code to see test results
              </div>
            )}
          </div>
        )}

        {/* Review Tab */}
        {activeTab === "review" && (
          <div>
            {reviewContent ? (
              <div
                className="animate-fade-in"
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(reviewContent),
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 150,
                  gap: 12,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                  style={{ opacity: 0.4 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  Get AI-powered feedback on your code
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onRequestReview}
                  disabled={!hasProblem || !hasCode || isReviewing}
                  id="review-btn"
                >
                  {isReviewing ? (
                    <>
                      <span className="spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      Request AI Review
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
