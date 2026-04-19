"use client";

import Editor from "@monaco-editor/react";
import { useRef } from "react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  hasProblem: boolean;
}

const DEFAULT_TEMPLATE = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    
    
    return 0;
}
`;

export { DEFAULT_TEMPLATE };

export default function CodeEditor({
  code,
  onChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  hasProblem,
}: CodeEditorProps) {
  const editorRef = useRef<unknown>(null);

  const handleEditorMount = (editor: unknown) => {
    editorRef.current = editor;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      if (hasProblem && !isSubmitting) onSubmit();
    } else if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      if (hasProblem && !isRunning) onRun();
    }
  };

  return (
    <div
      className="panel"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3>Code Editor</h3>
          <span
            className="badge"
            style={{
              background: "rgba(255, 161, 22, 0.1)",
              color: "var(--accent-primary)",
              fontSize: "0.6875rem",
            }}
          >
            C++
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onRun}
            disabled={!hasProblem || isRunning || isSubmitting}
            id="run-btn"
            title="Run against sample cases (Ctrl+Enter)"
            style={{ color: "var(--accent-green)" }}
          >
            {isRunning ? (
              <>
                <span className="spinner" />
                Running...
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run
              </>
            )}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={onSubmit}
            disabled={!hasProblem || isRunning || isSubmitting}
            id="submit-btn"
            title="Submit against all cases (Ctrl+Shift+Enter)"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Judging...
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "var(--font-mono)",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "off",
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />
      </div>
      <div
        style={{
          padding: "6px 12px",
          borderTop: "1px solid var(--surface-glass-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          background: "rgba(10, 11, 16, 0.4)",
        }}
      >
        <span>Ctrl+Enter to Run • Ctrl+Shift+Enter to Submit</span>
        <span>{code.split("\n").length} lines</span>
      </div>
    </div>
  );
}
