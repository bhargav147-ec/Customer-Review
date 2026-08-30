import React from 'react';
import { ThemePalette } from '../types';
import { 
  X, 
  Palette, 
  Check, 
  Sparkles, 
  Moon, 
  Compass, 
  Layers, 
  Sliders
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemePalette;
  onSelectTheme: (theme: ThemePalette) => void;
}

interface ThemeConfig {
  id: ThemePalette;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  previewColors: {
    bg: string;
    card: string;
    border: string;
    accent: string;
    text: string;
  };
}

const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    tagline: 'Default / Cosmic Indigo',
    description: 'Deep midnight-indigo backdrop with vibrant cyan accents and sharp slate contours.',
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    previewColors: {
      bg: '#070a11',
      card: '#0d131f',
      border: '#1e293b',
      accent: '#06b6d4',
      text: '#f1f5f9',
    },
  },
  {
    id: 'midnight-fog',
    name: 'Midnight Fog',
    tagline: 'Slate & Misty Ocean',
    description: 'Cool atmospheric slate depths paired with soft luminous sky-blue highlights.',
    icon: <Compass className="w-4 h-4 text-sky-400" />,
    previewColors: {
      bg: '#0b1120',
      card: '#141f36',
      border: '#243552',
      accent: '#38bdf8',
      text: '#f8fafc',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    tagline: 'Pitch Black & Violet Titanium',
    description: 'Ultra-deep true pitch-black minimalism framed by refined violet and titanium accents.',
    icon: <Moon className="w-4 h-4 text-purple-400" />,
    previewColors: {
      bg: '#030303',
      card: '#0e0e11',
      border: '#222228',
      accent: '#a78bfa',
      text: '#ffffff',
    },
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="settings-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="settings-modal-container"
        className="relative w-full max-w-xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-main)] font-display">
                Workspace Settings
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Customize appearance and environment preferences
              </p>
            </div>
          </div>

          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section: Workspace Theme Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
                <label className="text-sm font-semibold text-[var(--text-main)]">
                  Workspace Theme
                </label>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Global CSS Variables
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Select a color palette for your triage workstation. The layout, borders, cards, and accent highlights will update instantly.
            </p>

            {/* Theme Options Grid */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    id={`theme-option-${theme.id}`}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)] ring-1 ring-[var(--accent-ring)] shadow-lg'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    
                    {/* Left: Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: theme.previewColors.card,
                          borderColor: theme.previewColors.border,
                        }}
                      >
                        {theme.icon}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[var(--text-main)]">
                            {theme.name}
                          </h4>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-black/40 text-[var(--text-muted)] border-[var(--border-subtle)] font-mono">
                            {theme.tagline}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          {theme.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Color Preview Swatches & Checkmark */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      
                      {/* Swatches */}
                      <div 
                        className="flex items-center p-1 rounded-lg border gap-1 shadow-inner"
                        style={{
                          backgroundColor: theme.previewColors.bg,
                          borderColor: theme.previewColors.border,
                        }}
                        title={`${theme.name} palette preview`}
                      >
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.previewColors.bg }}
                          title="Background"
                        />
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.previewColors.card }}
                          title="Surface Card"
                        />
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.previewColors.border }}
                          title="Border Line"
                        />
                        <div 
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.previewColors.accent }}
                          title="Accent Highlight"
                        />
                      </div>

                      {/* Active Indicator Radio */}
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-zinc-950 font-bold'
                          : 'border-[var(--border-strong)] bg-transparent text-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Banner */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
            <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span>Theme preferences are saved automatically to your local workspace session.</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            id="close-settings-footer-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-primary)] hover:opacity-90 text-zinc-950 shadow transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
