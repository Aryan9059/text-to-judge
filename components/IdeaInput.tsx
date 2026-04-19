"use client";

import { useState } from "react";

interface IdeaInputProps {
  onGenerate: (idea: string) => void;
  isLoading: boolean;
}

export default function IdeaInput({ onGenerate, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onGenerate(idea.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3" id="idea-form">
      <div className="flex-1 relative">
        <input
          id="idea-input"
          type="text"
          className="input"
          placeholder="Describe a coding problem idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          maxLength={500}
          disabled={isLoading}
          autoFocus
        />
        {idea.length > 0 && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            {idea.length}/500
          </span>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!idea.trim() || isLoading}
        id="generate-btn"
        style={{ minWidth: 140 }}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Generating...
          </>
        ) : (
          <>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Generate
          </>
        )}
      </button>
    </form>
  );
}
