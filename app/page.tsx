import Link from "next/link";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-subtle h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Job<span className="Welcome-text font-extrabold">Perfect</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/workspace">
                <button className="btn btn-primary btn-sm">
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/workspace"
                className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Workspace
              </Link>
              <UserButton />
            </Show>

          </div>
        </div>
      </nav>

      {/* Hero section */}
      <main className="flex-1 flex flex-col pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto w-full text-center space-y-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--surface-glass-border)] bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] animate-fade-in">
            New: AI-Powered Interview Prep
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] animate-fade-in delay-100">
            Crush your coding <br />
            <span className="Welcome-text">interviews.</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in delay-200">
            Input vague problem ideas, get structured challenges. 
            Write and test your solutions in a premium, zero-latency environment.
          </p>

          <div className="flex items-center justify-center gap-6 pt-6 animate-fade-in delay-300">
            <Link
              href="/workspace"
              className="btn btn-primary btn-lg shadow-glow-primary"
            >
              Start Practice
            </Link>
            <button className="btn btn-ghost btn-lg">
              View Tracks
            </button>
          </div>
        </div>

        {/* Platform Mockup */}
        <div className="max-w-5xl mx-auto w-full mt-28 relative animate-fade-in delay-500">
          <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-pink)] opacity-10 blur-3xl" />
          <div className="relative panel bg-[var(--bg-primary)] border-[var(--surface-glass-border)] overflow-hidden shadow-2xl">
             <div className="panel-header border-b-[var(--surface-glass-border)]">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="px-4 py-1 rounded-full bg-[var(--bg-tertiary)] text-[11px] font-mono text-[var(--accent-primary)]">
                   solution.cpp
                </div>
                <div className="w-16 h-2" />
             </div>
             
             <div className="grid grid-cols-12 h-80">
                <div className="col-span-4 border-r border-[var(--surface-glass-border)] p-6 space-y-6 bg-[var(--bg-secondary)]/30">
                   <div className="space-y-3">
                      <div className="h-2.5 w-3/4 bg-[var(--bg-tertiary)] rounded-full" />
                      <div className="h-2.5 w-1/2 bg-[var(--bg-elevated)] rounded-full" />
                   </div>
                   <div className="space-y-3 pt-6">
                      <div className="h-2 w-full bg-[var(--bg-tertiary)] rounded-full" />
                      <div className="h-2 w-full bg-[var(--bg-tertiary)] rounded-full" />
                      <div className="h-2 w-4/5 bg-[var(--bg-tertiary)] rounded-full" />
                   </div>
                </div>
                <div className="col-span-8 p-6 bg-[var(--bg-secondary)] relative">
                   <div className="font-mono text-sm text-[var(--text-muted)] space-y-2">
                      <div className="flex gap-4"><span className="opacity-20">1</span><span className="text-[#b5b5f6]">#include</span> &lt;iostream&gt;</div>
                      <div className="flex gap-4"><span className="opacity-20">2</span><span className="text-[#b5b5f6]">using namespace</span> std;</div>
                      <div className="flex gap-4"><span className="opacity-20">3</span></div>
                      <div className="flex gap-4"><span className="opacity-20">4</span><span className="text-[#f7bff4]">int</span> main() {"{"}</div>
                      <div className="flex gap-4"><span className="opacity-20">5</span>  cout &lt;&lt; <span className="text-[#00d4bc]">&quot;Accepted&quot;</span> &lt;&lt; endl;</div>
                      <div className="flex gap-4"><span className="opacity-20">6</span>  <span className="text-[#b5b5f6]">return</span> <span className="text-[#fbb342]">0</span>;</div>
                      <div className="flex gap-4"><span className="opacity-20">7</span>{"}"}</div>
                   </div>
                   <div className="absolute top-6 right-6">
                      <div className="px-4 py-1.5 rounded-full bg-[#00d4bc]/10 text-[#00d4bc] text-xs font-bold border border-[#00d4bc]/20 uppercase tracking-widest shadow-lg">
                         Accepted
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* feature list */}
        <div className="max-w-6xl mx-auto w-full mt-40 pb-20 grid grid-cols-1 md:grid-cols-3 gap-16 px-6">
          {[
            {
              title: "AI Track Generation",
              desc: "Instant creation of professional coding tracks tailored to your target company or skill gap.",
              icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            },
            {
              title: "Modern Judge Engine",
              desc: "Lightning fast local execution with deterministic verdicts and detailed performance metrics.",
              icon: <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            },
            {
              title: "Seamless Experience",
              desc: "Zero-latency UI designed for focus. No server round-trips for compilation or testing.",
              icon: <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            }
          ].map((f, i) => (
            <div key={i} className="group space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--surface-glass-border)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent-primary)] fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-[var(--surface-glass-border)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
             <span className="text-xl font-bold">
               Job<span className="Welcome-text font-extrabold">Perfect</span>
             </span>
             <p className="text-xs font-semibold text-[var(--text-muted)] tracking-widest uppercase">
               Premium Judge Platform. Zero Latency.
             </p>
          </div>
          <div className="flex gap-12">
            {["GitHub", "Tracks", "Docs", "Privacy"].map(link => (
              <a key={link} href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">{link}</a>
            ))}
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            © {new Date().getFullYear()} JobPerfect.
          </p>
        </div>
      </footer>
    </div>
  );
}

