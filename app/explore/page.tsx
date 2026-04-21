"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

interface PublicProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  companyTags: string[];
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export default function ExplorePage() {
  const [problems, setProblems] = useState<PublicProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    async function fetchExplore() {
      try {
        const res = await fetch("/api/problems/explore");
        const data = await res.json();
        if (res.ok) {
          setProblems(data.problems);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExplore();
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
                         p.companyTags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

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
            <Link href="/explore" className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">Explore</Link>
            <Link href="/dashboard" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider">Dashboard</Link>
            <Link href="/workspace" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider">Workspace</Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-br from-white to-[var(--text-muted)] bg-clip-text text-transparent">
            Explore Community Problems
          </h1>
          <p className="text-[var(--text-secondary)] font-medium mb-8">
            Challenge yourself with problems shared by other developers. 
            Search by topic, company, or difficulty.
          </p>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="text"
              placeholder="Search problems, topics, or companies..."
              className="input pl-11 py-3.5 text-base glass shadow-lg focus:shadow-[var(--shadow-glow-primary)] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-[var(--surface-glass-border)] pb-4">
          <div className="flex gap-2">
            {["All", "Easy", "Medium", "Hard"].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                  difficultyFilter === diff 
                  ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--bg-primary)]" 
                  : "bg-transparent border-[var(--surface-glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {filteredProblems.length} Problems found
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="panel h-48 skeleton border-none" />
            ))}
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="panel bg-transparent border border-dashed border-[var(--surface-glass-border)] p-20 text-center rounded-2xl">
            <p className="text-[var(--text-muted)] font-medium">No public problems match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map(p => (
              <Link 
                key={p.id} 
                href={`/workspace?id=${p.id}`}
                className="group relative flex flex-col glass bg-[var(--bg-secondary)] border-[var(--surface-glass-border)] rounded-2xl hover:border-[var(--accent-primary)]/40 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      p.difficulty === "Easy" ? "text-[var(--accent-green)]" : 
                      p.difficulty === "Medium" ? "text-[var(--accent-amber)]" : "text-[var(--accent-red)]"
                    }`}>
                      {p.difficulty}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed font-medium">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {p.companyTags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase">
                        {tag}
                      </span>
                    ))}
                    {p.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--surface-glass-border)] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-[var(--bg-primary)]/30 border-t border-[var(--surface-glass-border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-orange-600 flex items-center justify-center text-[8px] font-black text-[var(--bg-primary)]">
                      {p.user?.name?.[0] || "U"}
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{p.user?.name || "Anonymous User"}</span>
                  </div>
                  <div className="text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
