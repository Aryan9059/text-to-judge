"use client";

import type { Verdict } from "@/lib/judge";

interface VerdictBadgeProps {
  verdict: Verdict;
  large?: boolean;
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; className: string; icon: string }
> = {
  AC: { label: "Accepted", className: "verdict-ac", icon: "✅" },
  WA: { label: "Wrong Answer", className: "verdict-wa", icon: "❌" },
  TLE: { label: "Time Limit Exceeded", className: "verdict-tle", icon: "⏱" },
  CE: { label: "Compilation Error", className: "verdict-ce", icon: "🔧" },
  RE: { label: "Runtime Error", className: "verdict-re", icon: "💥" },
};

export default function VerdictBadge({ verdict, large }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <span
      className={config.className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: large ? 8 : 5,
        fontWeight: 700,
        fontSize: large ? "1.1rem" : "0.8125rem",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export { VERDICT_CONFIG };
