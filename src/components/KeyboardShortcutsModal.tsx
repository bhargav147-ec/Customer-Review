import React from 'react';
import { 
  Keyboard, 
  X, 
  CornerDownLeft, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  CheckSquare, 
  Layers
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups = [
    {
      title: 'Navigation & Inbox',
      shortcuts: [
        {
          keys: ['↑', '↓'],
          altKeys: ['k', 'j'],
          description: 'Navigate up and down through review list',
          icon: <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />,
        },
        {
          keys: ['/'],
          description: 'Focus search bar in inbox list',
          icon: <Search className="w-3.5 h-3.5 text-indigo-400" />,
        },
        {
          keys: ['x'],
          description: 'Toggle select/checkbox on highlighted review',
          icon: <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />,
        },
        {
          keys: ['Esc'],
          description: 'Close modals, clear search, or deselect comparisons',
          icon: <X className="w-3.5 h-3.5 text-zinc-400" />,
        },
      ],
    },
    {
      title: 'Response & AI Dispatch',
      shortcuts: [
        {
          keys: [modKey, 'Enter'],
          description: 'Post / publish reply to customer review platform',
          icon: <CornerDownLeft className="w-3.5 h-3.5 text-amber-400" />,
        },
        {
          keys: ['1', '2', '3', '4'],
          description: 'Switch draft tone (Professional, Empathetic, Direct, Enthusiastic)',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
        },
        {
          keys: ['e'],
          altKeys: ['r'],
          description: 'Toggle review status between Pending and Replied',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        },
        {
          keys: ['c'],
          description: 'Copy response draft text to clipboard',
          icon: <Copy className="w-3.5 h-3.5 text-sky-400" />,
        },
        {
          keys: ['g'],
          description: 'Regenerate multi-tone AI draft responses',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
        },
      ],
    },
    {
      title: 'General & Help',
      shortcuts: [
        {
          keys: ['?'],
          altKeys: ['Shift', '/'],
          description: 'Open this keyboard shortcuts cheat-sheet',
          icon: <Keyboard className="w-3.5 h-3.5 text-amber-300" />,
        },
        {
          keys: ['s'],
          description: 'Open Simulate New Review dialog',
          icon: <Layers className="w-3.5 h-3.5 text-rose-400" />,
        },
      ],
    },
  ];

  return (
    <div 
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-main)] font-display">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Streamline review triage, drafting, and dispatch workflows
              </p>
            </div>
          </div>
          <button
            id="close-shortcuts-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-dim)] font-mono">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.shortcuts.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[var(--bg-input)]/80 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-[var(--text-main)] font-medium truncate">
                        {item.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <kbd className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 text-[11px] font-mono font-bold rounded-md bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-strong)] shadow-xs">
                            {k}
                          </kbd>
                          {kIdx < item.keys.length - 1 && (
                            <span className="text-zinc-500 font-mono text-[10px]">+</span>
                          )}
                        </React.Fragment>
                      ))}

                      {item.altKeys && item.altKeys.length > 0 && (
                        <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono ml-1">
                          <span>or</span>
                          {item.altKeys.map((ak, akIdx) => (
                            <kbd 
                              key={akIdx} 
                              className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-[var(--bg-surface)] text-zinc-400 border border-zinc-700/60"
                            >
                              {ak}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px]">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px]">?</kbd> to toggle this dialog anytime</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[var(--bg-input)] hover:bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors cursor-pointer text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
