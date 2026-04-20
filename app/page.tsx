import Link from "next/link";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (

    // Navbar
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-subtle h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--accent-primary)]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-base font-bold tracking-[0.05em] uppercase">
              Text<span className="text-[var(--accent-primary)]">Judge</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer capitalize">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/workspace">
                <button className="btn btn-primary btn-sm rounded-[var(--radius-md)]">
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/workspace"
                className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Go to Workspace
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <main className="flex-1 flex flex-col pt-40 pb-20 px-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.3]">
            Turn vague coding ideas into <br />
            <span className="text-[var(--accent-primary)]">structured challenges.</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Describe a problem in plain text. Let AI generate constraints and test cases. 
            Run and verify your C++ solutions in a real-time local judge.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/workspace"
              className="btn btn-primary btn-lg min-w-[160px] shadow-[var(--shadow-glow-primary)]"
            >
              Start Generating
            </Link>
            <button className="btn btn-ghost btn-lg min-w-[160px]">
              Learn More
            </button>
          </div>
        </div>

        {/* App Mockup */}
        <div className="max-w-5xl mx-auto w-full mt-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)] to-transparent opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
          <div className="relative panel bg-[var(--bg-primary)] border-[var(--surface-glass-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden">
             <div className="panel-header border-b-[var(--surface-glass-border)]">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--bg-elevated)]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--bg-elevated)]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--bg-elevated)]" />
                </div>
                <div className="px-3 py-1 rounded bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--accent-primary)]">
                   judge.cpp
                </div>
                <div className="w-12 h-2" />
             </div>
             
             <div className="grid grid-cols-12 h-64">
                <div className="col-span-4 border-r border-[var(--surface-glass-border)] p-4 space-y-4">
                   <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-[var(--bg-elevated)] rounded" />
                      <div className="h-2 w-1/2 bg-[var(--bg-tertiary)] rounded" />
                   </div>
                   <div className="space-y-2 pt-4">
                      <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full" />
                      <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full" />
                      <div className="h-1.5 w-3/4 bg-[var(--bg-elevated)] rounded-full" />
                   </div>
                </div>
                <div className="col-span-8 p-4 bg-[var(--bg-secondary)] relative">
                   <div className="font-mono text-xs text-[var(--text-muted)] space-y-1">
                      <div className="flex gap-3"><span className="opacity-30">1</span><span className="text-[var(--accent-indigo)]">#include</span> &lt;iostream&gt;</div>
                      <div className="flex gap-3"><span className="opacity-30">2</span><span className="text-[var(--accent-indigo)]">using namespace</span> std;</div>
                      <div className="flex gap-3"><span className="opacity-30">3</span></div>
                      <div className="flex gap-3"><span className="opacity-30">4</span><span className="text-[var(--accent-amber)]">int</span> main() {"{"}</div>
                      <div className="flex gap-3"><span className="opacity-30">5</span>  cout &lt;&lt; <span className="text-[var(--accent-green)]">&quot;Ready.&quot;</span> &lt;&lt; endl;</div>
                      <div className="flex gap-3"><span className="opacity-30">6</span>  <span className="text-[var(--accent-indigo)]">return</span> <span className="text-[var(--accent-orange)]">0</span>;</div>
                      <div className="flex gap-3"><span className="opacity-30">7</span>{"}"}</div>
                   </div>
                   <div className="absolute top-4 right-4 animate-pulse">
                      <div className="px-2 py-1 rounded bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[10px] font-bold border border-[var(--accent-green)]/20 uppercase tracking-widest">
                         Accepted
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* feature list */}
        <div className="max-w-5xl mx-auto w-full mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--surface-glass-border)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--accent-primary)] fill-none" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Speed of Groq</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Generate entire problem sets, constraints, and test scenarios in milliseconds with our high-speed AI integration.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--surface-glass-border)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--accent-primary)] fill-none" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.63 3 12" />
                <polyline points="21 12 16.5 14.63 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Local C++ Judge</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Compile and run code locally in your browser. Perfect for rapid prototyping and practice without server delays.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--surface-glass-border)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--accent-primary)] fill-none" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Precise Verdicts</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Get detailed performance metrics and correctness verdicts. Supports multiple test cases per generation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--surface-glass-border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase">
            © {new Date().getFullYear()} TextJudge. Zero-Latency Judge Platform.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase">GitHub</a>
            <a href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase">Docs</a>
            <a href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
