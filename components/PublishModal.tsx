"use client";

import { useState, KeyboardEvent } from "react";

const TOPIC_SUGGESTIONS = ["Arrays", "Strings", "Dynamic Programming", "Graphs", "BFS", "DFS", "Greedy", "Binary Search", "Hash Table", "Math"];
const COMPANY_SUGGESTIONS = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber", "Adobe"];

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { description: string; companyTags: string[]; tags: string[] }) => Promise<void>;
  problem: any;
}

export default function PublishModal({
  open,
  onClose,
  onConfirm,
  problem,
}: PublishModalProps) {
  const [description, setDescription] = useState(problem?.description || "");
  const [companyTags, setCompanyTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  if (!open) return null;

  const handleAddTag = (tag: string, type: "company" | "topic") => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    if (type === "company") {
      if (!companyTags.includes(trimmed)) setCompanyTags([...companyTags, trimmed]);
    } else {
      if (!tags.includes(trimmed)) setTags([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(inputValue, "topic"); 
    }
  };

  const removeTag = (tag: string, type: "company" | "topic") => {
    if (type === "company") {
      setCompanyTags(companyTags.filter(t => t !== tag));
    } else {
      setTags(tags.filter(t => t !== tag));
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setIsPublishing(true);
    try {
      await onConfirm({ description, companyTags, tags });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
      <div 
        className="glass bg-[var(--bg-secondary)] border-[var(--surface-glass-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[var(--surface-glass-border)] flex items-center justify-between bg-[var(--bg-primary)]/50">
          <h2 className="text-xl font-bold tracking-tight">Publish to <span className="text-[var(--accent-primary)]">Explore</span></h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Display Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary for the explore page..."
              className="input min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Tags & Companies</label>
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type and hit enter..."
                  className="input py-2"
                />
                <button
                  onClick={() => handleAddTag(inputValue, "company")}
                  className="btn btn-ghost btn-sm text-[10px] whitespace-nowrap"
                >
                  + Company
                </button>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-2">Popular Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleAddTag(s, "topic")}
                    className="text-[10px] px-2 py-1 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors border border-[var(--surface-glass-border)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-2">Target Companies</p>
              <div className="flex flex-wrap gap-1.5">
                {COMPANY_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleAddTag(s, "company")}
                    className="text-[10px] px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors border border-blue-500/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {companyTags.map(t => (
                <span key={t} className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 gap-2 pr-1.5">
                  {t}
                  <button onClick={() => removeTag(t, "company")} className="hover:text-white transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </span>
              ))}
              {tags.map(t => (
                <span key={t} className="badge bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 gap-2 pr-1.5">
                  {t}
                  <button onClick={() => removeTag(t, "topic")} className="hover:text-white transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-[var(--bg-primary)]/50 border-t border-[var(--surface-glass-border)] flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost" disabled={isPublishing}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPublishing || !description.trim()}
            className="btn btn-primary min-w-[120px]"
          >
            {isPublishing ? (
              <span className="spinner" style={{ width: 14, height: 14 }} />
            ) : (
              "Publish Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}