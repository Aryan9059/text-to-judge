"use client";

import type { GeneratedProblem } from "@/lib/groq";

interface ProblemPanelProps {
  problem: GeneratedProblem | null;
  isLoading: boolean;
  onRegenerateTests: () => void;
  isRegeneratingTests: boolean;
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const cls =
    difficulty === "Easy"
      ? "badge-easy"
      : difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";
  return <span className={`badge ${cls}`}>{difficulty}</span>;
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-ghost btn-sm"
      title="Copy to clipboard"
      style={{ padding: "2px 8px", fontSize: "0.7rem" }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
      Copy
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 28, width: "60%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: "30%", marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: "95%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 80, width: "100%", marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 14, width: "45%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 60, width: "100%" }} />
    </div>
  );
}

export default function ProblemPanel({
  problem,
  isLoading,
  onRegenerateTests,
  isRegeneratingTests,
}: ProblemPanelProps) {
  if (isLoading) {
    return (
      <div className="panel" style={{ height: "100%" }}>
        <div className="panel-header">
          <h3>Problem</h3>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!problem) {
    return (
      <div
        className="panel"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="panel-header">
          <h3>Problem</h3>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "var(--text-muted)",
            padding: 40,
            textAlign: "center",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.4 }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p style={{ fontSize: "0.9rem" }}>
            Enter a coding idea above to generate a problem
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="panel animate-fade-in"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="panel-header">
        <h3>Problem</h3>
        {problem && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DifficultyBadge difficulty={problem.difficulty} />
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                background: "var(--bg-tertiary)",
                padding: "2px 7px",
                borderRadius: 999,
              }}
            >
              {(problem.sampleCases?.length || 0) + (problem.hiddenCases?.length || 0)} tests
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onRegenerateTests}
              disabled={isRegeneratingTests}
              id="regen-tests-btn"
              title="Generate a fresh set of test cases including stress/TLE/MLE cases"
              style={{ fontSize: "0.75rem", gap: 5 }}
            >
              {isRegeneratingTests ? (
                <>
                  <span className="spinner" />
                  Regenerating...
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Regenerate Tests
                </>
              )}
            </button>
          </div>
        )}
        {!problem && <span />}
      </div>
      <div
        className="panel-body"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          position: "relative",
        }}
      >
        {/* Regenerating overlay */}
        {isRegeneratingTests && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(26, 26, 26, 0.75)",
              backdropFilter: "blur(4px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              zIndex: 10,
            }}
          >
            <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Generating stress &amp; edge cases…
            </p>
          </div>
        )}
        {/* Title */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {problem.title}
        </h2>

        {/* Statement */}
        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.75 }}>
          {problem.statement.split("\n").map((line, i) => (
            <p key={i} style={{ marginBottom: line.trim() === "" ? 12 : 4 }}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>

        {/* Input Format */}
        {problem.inputFormat && (
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Input Format
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {problem.inputFormat}
            </p>
          </div>
        )}

        {/* Output Format */}
        {problem.outputFormat && (
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Output Format
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {problem.outputFormat}
            </p>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Constraints
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {problem.constraints.map((c, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    paddingLeft: 12,
                    borderLeft: "2px solid var(--surface-glass-border)",
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Cases */}
        {problem.sampleCases && problem.sampleCases.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Examples
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {problem.sampleCases.map((tc, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--surface-glass-border)",
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                      }}
                    >
                      Example {i + 1}
                    </span>
                    <CopyButton text={tc.input} />
                  </div>
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
                          color: "var(--text-muted)",
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Input
                      </div>
                      <pre
                        className="code-block"
                        style={{
                          margin: 0,
                          fontSize: "0.8125rem",
                          padding: "8px 10px",
                        }}
                      >
                        {tc.input}
                      </pre>
                    </div>
                    <div>
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
                        Output
                      </div>
                      <pre
                        className="code-block"
                        style={{
                          margin: 0,
                          fontSize: "0.8125rem",
                          padding: "8px 10px",
                        }}
                      >
                        {tc.output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <details style={{ color: "var(--text-muted)" }}>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--accent-amber)",
                userSelect: "none",
              }}
            >
              💡 Hints ({problem.hints.length})
            </summary>
            <ul
              style={{
                listStyle: "none",
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {problem.hints.map((h, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    paddingLeft: 12,
                    borderLeft: "2px solid var(--accent-amber)",
                  }}
                >
                  {h}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
