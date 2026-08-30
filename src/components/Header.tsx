import React from 'react';
import { Review, ThemePalette } from '../types';
import { HeaderGreeting } from './HeaderGreeting';
import { 
  ShieldAlert, 
  Clock, 
  Star, 
  MessageSquarePlus, 
  Activity,
  Bot,
  Settings,
  Palette,
  Keyboard
} from 'lucide-react';

interface HeaderProps {
  reviews: Review[];
  onOpenSimulateModal: () => void;
  onOpenSettingsModal?: () => void;
  onOpenShortcutsModal?: () => void;
  currentTheme?: ThemePalette;
  filterUrgency?: string;
  onFilterUrgencySelect?: (urgency: 'high' | 'all') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  reviews, 
  onOpenSimulateModal,
  onOpenSettingsModal,
  onOpenShortcutsModal,
  currentTheme = 'deep-space',
  onFilterUrgencySelect 
}) => {
  const total = reviews.length;
  const highUrgent = reviews.filter((r) => r.urgency === 'high' && r.status === 'pending').length;
  const pending = reviews.filter((r) => r.status === 'pending').length;
  const replied = reviews.filter((r) => r.status === 'replied').length;
  const avgRating = total > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
    : '0.0';
  const responseRate = total > 0 ? Math.round((replied / total) * 100) : 0;

  const themeLabelMap: Record<ThemePalette, string> = {
    'deep-space': 'Deep Space',
    'midnight-fog': 'Midnight Fog',
    'obsidian': 'Obsidian',
  };

  return (
    <header 
      id="app-header" 
      className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-header)]/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 py-3.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Generic Unbranded Title and Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)]">
            <Bot className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 id="page-title" className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-main)]">
                Customer Review Management
              </h1>
              <HeaderGreeting compact={true} />
              <span 
                id="agent-status-pill"
                className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Agent Active
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Auto-triage, sentiment tagging & assisted response dispatch
            </p>
          </div>
        </div>

        {/* Center: Live Overview Metrics */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
          
          {/* Urgent Risk counter */}
          <button
            id="metric-urgent-reviews"
            onClick={() => onFilterUrgencySelect && onFilterUrgencySelect(highUrgent > 0 ? 'high' : 'all')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              highUrgent > 0 
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 hover:bg-rose-950/60 shadow-[0_0_10px_rgba(244,63,94,0.15)] cursor-pointer' 
                : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${highUrgent > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-500'}`} />
            <span className="font-medium">Urgent Risk:</span>
            <span className={`font-mono font-bold ${highUrgent > 0 ? 'text-rose-300' : 'text-[var(--text-muted)]'}`}>
              {highUrgent}
            </span>
          </button>

          {/* Pending Response Counter */}
          <div 
            id="metric-pending-reviews"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)]"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[var(--text-muted)]">Needs Reply:</span>
            <span className="font-mono font-bold text-amber-300">{pending}</span>
          </div>

          {/* Average Rating */}
          <div 
            id="metric-avg-rating"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)]"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-[var(--text-muted)]">Avg Rating:</span>
            <span className="font-mono font-bold text-[var(--text-main)]">{avgRating} / 5</span>
          </div>

          {/* Response Rate */}
          <div 
            id="metric-response-rate"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)]"
          >
            <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="font-medium text-[var(--text-muted)]">Resolution:</span>
            <span className="font-mono font-bold text-[var(--accent-primary)]">{responseRate}%</span>
          </div>
        </div>

        {/* Right: Settings, Shortcuts and Simulation trigger */}
        <div className="flex items-center gap-2">
          {/* Keyboard Shortcuts Helper Button */}
          {onOpenShortcutsModal && (
            <button
              id="btn-open-shortcuts"
              onClick={onOpenShortcutsModal}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
              title="Keyboard Shortcuts (?)"
              aria-label="View Keyboard Shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              <kbd className="hidden md:inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-[var(--bg-input)] text-zinc-300 border border-zinc-700/60">
                ?
              </kbd>
            </button>
          )}

          {/* Settings / Theme Picker Button */}
          {onOpenSettingsModal && (
            <button
              id="btn-open-settings"
              onClick={onOpenSettingsModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
              title="Open Workspace Settings & Theme Selector"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {themeLabelMap[currentTheme]}
              </span>
              <Settings className="w-3.5 h-3.5 text-[var(--text-muted)] ml-0.5" />
            </button>
          )}

          <button
            id="btn-simulate-review"
            onClick={onOpenSimulateModal}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-primary)] text-zinc-950 hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer font-semibold"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-zinc-950" />
            <span>Simulate Review</span>
          </button>
        </div>

      </div>
    </header>
  );
};
