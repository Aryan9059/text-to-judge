"use client";

import type { GeneratedProblem } from "@/lib/groq";

interface ProblemPanelProps {
  problem: GeneratedProblem | null;
  isLoading: boolean;
  onRegenerateTests: () => void;
  isRegeneratingTests: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
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
  onSave,
  isSaving,
  isSaved,
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3>Problem</h3>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              background: "var(--bg-tertiary)",
              padding: "2px 7px",
              borderRadius: 999,
              marginRight: 4,
            }}
          >
            {(problem.sampleCases?.length || 0) + (problem.hiddenCases?.length || 0)} tests
          </span>

          {onSave && (
            <button
              className={`btn ${isSaved ? "btn-ghost" : "btn-primary"} btn-sm`}
              onClick={onSave}
              disabled={isSaving || isSaved}
              style={{ 
                fontSize: "0.75rem", 
                gap: 5,
                height: 28,
                padding: "0 10px",
                borderColor: isSaved ? "var(--accent-green)" : undefined,
                color: isSaved ? "var(--accent-green)" : undefined
              }}
            >
              {isSaving ? (
                <span className="spinner" style={{ width: 10, height: 10 }} />
              ) : isSaved ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )}
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Problem"}
            </button>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={onRegenerateTests}
            disabled={isRegeneratingTests}
            id="regen-tests-btn"
            title="Generate a fresh set of test cases including stress/TLE/MLE cases"
            style={{ fontSize: "0.75rem", gap: 5, height: 28 }}
          >
            {isRegeneratingTests ? (
              <>
                <span className="spinner" style={{ width: 10, height: 10 }} />
                Regenerating...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
                Regen Tests
              </>
            )}
          </button>
        </div>
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

        {/* Practice Links */}
        {(problem.leetcodeLink || problem.gfgLink) && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {problem.leetcodeLink && (
              <a
                href={problem.leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: "0.75rem",
                  gap: 6,
                  color: "var(--accent-amber)",
                  borderColor: "rgba(255, 184, 0, 0.2)",
                  background: "rgba(255, 184, 0, 0.05)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.043-1.954l-1.04-1.127a1.374 1.374 0 0 0-1.942-.047l-1.002 1.054c-.161.169-.427.169-.59 0l-1.196-1.297a1.374 1.374 0 0 0-1.942-.047l-1.002 1.054c-.161.169-.427.169-.59 0l-1.196-1.297a1.374 1.374 0 0 0-1.942-.047l-1.002 1.054c-.161.169-.427.169-.59 0l-1.196-1.297a1.374 1.374 0 0 0-1.942-.047l-1.002 1.054c-.161.169-.427.169-.59 0l-1.196-1.297a1.374 1.374 0 0 0-1.942-.047L1.139 12.564c-.161.169-.427.169-.59 0L.046 11.458c-.161-.169-.161-.444 0-.613l2.257-2.381c1.282-1.353 3.033-2.11 4.887-2.11h.001c1.854 0 3.605.757 4.887 2.11l2.43 2.564c.161.169.427.169.59 0l1.04-1.127c.161-.169.161-.444 0-.613l-2.43-2.564c-1.282-1.353-3.033-2.11-4.887-2.11h-.001c-1.854 0-3.605.757-4.887 2.11L.046 8.525c-.161.169-.161.444 0 .613l1.106 1.199c.161.169.427.169.59 0l1.196-1.297a1.374 1.374 0 0 0 1.942-.047l1.002-1.054c.161-.169.427-.169.59 0l1.196 1.297a1.374 1.374 0 0 0 1.942.047l1.002-1.054c.161-.169.427-.169.59 0l1.196 1.297a1.374 1.374 0 0 0 1.942.047l1.002-1.054c.161-.169.427-.169.59 0l1.196 1.297a1.374 1.374 0 0 0 1.942.047l2.12-2.12c.54-.54.54-1.414 0-1.954l-2.396-2.392a1.374 1.374 0 0 0-.961-.438z" />
                </svg>
                LeetCode
              </a>
            )}
            {problem.gfgLink && (
              <a
                href={problem.gfgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: "0.75rem",
                  gap: 6,
                  color: "var(--accent-green)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                  background: "rgba(34, 197, 94, 0.05)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
                </svg>
                GeeksforGeeks
              </a>
            )}
          </div>
        )}

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
