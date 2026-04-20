"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

interface DashboardData {
  stats: {
    problemsTotal: number;
    submissionsTotal: number;
    accuracy: string;
  };
  problems: any[];
  submissions: any[];
}

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load dashboard");
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-violet-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-subtle h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--accent-primary)]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-base font-bold tracking-[0.05em] uppercase">
              Text<span className="text-[var(--accent-primary)]">Judge</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/workspace"
              className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider"
            >
              Workspace
            </Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, <span className="text-[var(--accent-primary)]">{user?.firstName || "User"}</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">
            Track your generated problems and evaluation history.
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="panel bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border border-[var(--surface-glass-border)] shadow-sm">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] mb-1">Problems Saved</div>
            <div className="text-3xl font-black">{data?.stats.problemsTotal || 0}</div>
          </div>
          <div className="panel bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border border-[var(--surface-glass-border)] shadow-sm">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] mb-1">Total Submissions</div>
            <div className="text-3xl font-black">{data?.stats.submissionsTotal || 0}</div>
          </div>
          <div className="panel bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border border-[var(--surface-glass-border)] shadow-sm">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] mb-1">Accuracy Rate</div>
            <div className="text-3xl font-black text-[var(--accent-green)]">{data?.stats.accuracy || "0.0"}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Problems Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent-primary)]">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Saved Problems
              </h2>
              <Link href="/workspace" className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] hover:underline">New Problem</Link>
            </div>

            {data?.problems.length === 0 ? (
              <div className="panel bg-transparent border border-dashed border-[var(--surface-glass-border)] p-12 text-center rounded-[var(--radius-lg)] text-[var(--text-muted)]">
                No problems saved yet. Generate and save one in the workspace!
              </div>
            ) : (
              <div className="space-y-4">
                {data?.problems.map((prob) => (
                  <div key={prob.id} className="panel bg-[var(--bg-secondary)] p-5 rounded-[var(--radius-md)] border border-[var(--surface-glass-border)] hover:border-[var(--accent-primary)]/30 transition-all group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base mb-1 group-hover:text-[var(--accent-primary)] transition-colors">{prob.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-3">{prob.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                            {formatDistanceToNow(new Date(prob.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href={`/workspace?id=${prob.id}`}
                        className="btn btn-ghost btn-sm text-[10px] font-bold uppercase"
                      >
                        Solve
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent-indigo)]">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Recent Activity
            </h2>

            {data?.submissions.length === 0 ? (
              <div className="panel bg-transparent border border-dashed border-[var(--surface-glass-border)] p-12 text-center rounded-[var(--radius-lg)] text-[var(--text-muted)]">
                No submissions yet.
              </div>
            ) : (
              <div className="panel bg-[var(--bg-secondary)] border border-[var(--surface-glass-border)] rounded-[var(--radius-lg)] overflow-hidden">
                <div className="divide-y divide-[var(--surface-glass-border)]">
                  {data?.submissions.map((sub) => (
                    <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">
                          {sub.problem?.title || "Unknown Problem"}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                          {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          sub.verdict === "AC" ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                        }`}>
                          {sub.verdict}
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)]">
                          {sub.executionTime}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
