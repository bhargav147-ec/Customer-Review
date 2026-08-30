import React, { useState, useEffect, useRef } from 'react';
import { Review, AiDraftTone, ReviewStatus } from '../types';
import { PlatformBadge, SentimentBadge, CategoryBadge, UrgencyBadge, StarRating } from './Badge';
import { SideBySideCompareView } from './SideBySideCompareView';
import { ResponseTimeIndicator } from './ResponseTimeIndicator';
import { AiInsightBadge } from './AiInsightBadge';
import { getSavedDraft, saveDraftToStorage, clearSavedDraft } from '../utils/draftStorage';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  Sliders, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Scale,
  ChevronDown,
  Save,
  Undo2
} from 'lucide-react';

interface ReviewDetailProps {
  review: Review | null;
  compareReviews?: Review[] | null;
  allReviews?: Review[];
  onCloseComparison?: () => void;
  onFocusSingleReview?: (reviewId: string) => void;
  onSelectCompareReview?: (reviewIdA: string, reviewIdB: string) => void;
  onPostReply: (reviewId: string, replyText: string, tone: AiDraftTone) => void;
  onToggleStatus: (reviewId: string, newStatus: ReviewStatus) => void;
  onRegenerateDraft: (reviewId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'urgent') => void;
  onAutoCategorize?: (targetIds?: string[]) => Promise<void>;
  isAutoCategorizing?: boolean;
}

interface SingleReviewDetailProps {
  review: Review;
  allReviews: Review[];
  onSelectCompareReview?: (reviewIdA: string, reviewIdB: string) => void;
  onPostReply: (reviewId: string, replyText: string, tone: AiDraftTone) => void;
  onToggleStatus: (reviewId: string, newStatus: ReviewStatus) => void;
  onRegenerateDraft: (reviewId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'urgent') => void;
  onAutoCategorize?: (targetIds?: string[]) => Promise<void>;
  isAutoCategorizing?: boolean;
}

const SingleReviewDetail: React.FC<SingleReviewDetailProps> = ({
  review,
  allReviews,
  onSelectCompareReview,
  onPostReply,
  onToggleStatus,
  onRegenerateDraft,
  onShowToast,
  onAutoCategorize,
  isAutoCategorizing = false,
}) => {
  const [draftText, setDraftText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<AiDraftTone>('professional');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [isCompareDropdownOpen, setIsCompareDropdownOpen] = useState<boolean>(false);
  const [isRestoredFromAutoSave, setIsRestoredFromAutoSave] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);

  // Synchronize draft text whenever review changes or status updates, with localStorage auto-save recovery
  useEffect(() => {
    if (review) {
      if (review.status === 'replied' && review.reply && !isEditingExisting) {
        setDraftText(review.reply.text);
        setSelectedTone(review.reply.toneUsed || review.aiDraft.selectedTone);
        setIsRestoredFromAutoSave(false);
      } else {
        // Check for an autosaved local draft
        const saved = getSavedDraft(review.id);
        const defaultAiText = review.aiDraft.tones[review.aiDraft.selectedTone] || review.aiDraft.currentText;

        if (saved && saved.text && saved.text.trim().length > 0 && saved.text !== defaultAiText) {
          setDraftText(saved.text);
          setSelectedTone(saved.tone || review.aiDraft.selectedTone);
          setIsRestoredFromAutoSave(true);
          setLastSavedTimestamp(saved.updatedAt || Date.now());
          setAutoSaveStatus('saved');
        } else {
          setSelectedTone(review.aiDraft.selectedTone);
          const toneKey = review.aiDraft.selectedTone;
          setDraftText(review.aiDraft.tones[toneKey] || review.aiDraft.currentText);
          setIsRestoredFromAutoSave(false);
          setAutoSaveStatus('idle');
        }
      }
      setIsSuccessAnimated(false);
      setIsCompareDropdownOpen(false);
    }
  }, [review?.id, review?.status, isEditingExisting]);

  const isUrgent = review.urgency === 'high';
  const isReplied = review.status === 'replied' && !isEditingExisting;

  const handleDraftChange = (newText: string) => {
    setDraftText(newText);
    if (!isReplied) {
      saveDraftToStorage(review.id, newText, selectedTone);
      setAutoSaveStatus('saved');
      setLastSavedTimestamp(Date.now());
    }
  };

  const handleToneSelect = (tone: AiDraftTone) => {
    setSelectedTone(tone);
    if (review.aiDraft.tones[tone]) {
      const toneText = review.aiDraft.tones[tone];
      setDraftText(toneText);
      saveDraftToStorage(review.id, toneText, tone);
      setAutoSaveStatus('saved');
      setLastSavedTimestamp(Date.now());
      setIsRestoredFromAutoSave(false);
      onShowToast(`Applied tone: ${tone.toUpperCase()}`, 'info');
    }
  };

  const handleResetToAiDefault = () => {
    clearSavedDraft(review.id);
    const defaultText = review.aiDraft.tones[selectedTone] || review.aiDraft.currentText;
    setDraftText(defaultText);
    setIsRestoredFromAutoSave(false);
    setAutoSaveStatus('idle');
    onShowToast('Draft reset to original AI draft', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    onShowToast('Draft response copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleResolvedState = () => {
    const nextStatus: ReviewStatus = review.status === 'replied' ? 'pending' : 'replied';
    onToggleStatus(review.id, nextStatus);
    onShowToast(
      nextStatus === 'replied' ? 'Review marked as Resolved' : 'Review reopened to Pending',
      nextStatus === 'replied' ? 'success' : 'info'
    );
  };

  const handlePost = () => {
    if (!draftText.trim()) return;
    setIsPosting(true);
    // Clear autosave draft on submit
    clearSavedDraft(review.id);
    setTimeout(() => {
      onPostReply(review.id, draftText.trim(), selectedTone);
      setIsPosting(false);
      setIsEditingExisting(false);
      setIsSuccessAnimated(true);
      setIsRestoredFromAutoSave(false);
      onShowToast(`Response dispatched to ${review.platform.toUpperCase()}`, 'success');
      setTimeout(() => setIsSuccessAnimated(false), 3500);
    }, 550);
  };

  const handleRegenerate = () => {
    clearSavedDraft(review.id);
    setIsRestoredFromAutoSave(false);
    onRegenerateDraft(review.id);
    onShowToast('Regenerating multi-tone drafts with AI...', 'info');
  };

  const handleCompareWith = (targetReviewId: string) => {
    if (onSelectCompareReview) {
      onSelectCompareReview(review.id, targetReviewId);
      setIsCompareDropdownOpen(false);
      onShowToast('Entering Side-by-Side Comparison Mode', 'info');
    }
  };

  // Keyboard shortcut listener for Reply and Review actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // 1. Post reply: Cmd+Enter (Mac) or Ctrl+Enter (Win/Linux)
      if (isCmdOrCtrl && e.key === 'Enter') {
        if (!isReplied && draftText.trim() && !isPosting) {
          e.preventDefault();
          handlePost();
          return;
        }
      }

      // Ignore single-key shortcuts when typing in an input, textarea, or select element
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return;
      }

      // 2. Draft Tone Selection (1: Empathetic, 2: Formal, 3: Conciliatory, 4: Appreciative)
      if (!isReplied) {
        const tones: AiDraftTone[] = ['empathetic', 'professional', 'conciliatory', 'appreciative'];
        if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          const index = parseInt(e.key, 10) - 1;
          if (tones[index]) {
            handleToneSelect(tones[index]);
          }
          return;
        }
      }

      // 3. Mark Resolved / Toggle Status: 'e' or 'r'
      if ((e.key === 'e' || e.key === 'r') && !isCmdOrCtrl) {
        e.preventDefault();
        handleToggleResolvedState();
        return;
      }

      // 4. Copy Draft: 'c'
      if (e.key === 'c' && !isCmdOrCtrl && !e.altKey) {
        e.preventDefault();
        handleCopy();
        return;
      }

      // 5. Regenerate AI Draft: 'g'
      if (e.key === 'g' && !isReplied && !isCmdOrCtrl) {
        e.preventDefault();
        handleRegenerate();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftText, isReplied, isPosting, review?.id, selectedTone]);

  return (
    <div 
      id={`review-detail-card-${review.id}`}
      className={`flex flex-col h-full bg-[var(--bg-card)] border rounded-2xl overflow-hidden shadow-lg transition-all ${
        isUrgent && !isReplied 
          ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.12)]' 
          : 'border-[var(--border-subtle)]'
      }`}
    >
      
      {/* Detail Header: Author, Platform, Rating & Satisfying Status Toggle */}
      <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--text-main)] text-sm font-mono">
            {review.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="detail-author-name" className="text-base font-semibold text-[var(--text-main)] font-display">
                {review.author}
              </h2>
              <PlatformBadge platform={review.platform} size="md" />
              {review.verifiedCustomer && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono bg-[var(--bg-input)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  Verified Patron
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)] font-mono flex-wrap">
              <StarRating rating={review.rating} size="md" />
              <span>{review.rating}.0 / 5.0</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--text-dim)]" />
                {review.date}
              </span>
              <span>•</span>
              <ResponseTimeIndicator review={review} variant="compact" />
              {review.orderReference && (
                <>
                  <span>•</span>
                  <span>Ref: {review.orderReference}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Compare Dropdown */}
          {allReviews.length > 1 && (
            <div className="relative">
              <button
                id="open-compare-dropdown-btn"
                onClick={() => setIsCompareDropdownOpen(!isCompareDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                title="Compare this review side-by-side with another"
              >
                <Scale className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Compare</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-dim)]" />
              </button>

              {isCompareDropdownOpen && (
                <div 
                  id="compare-picker-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xl shadow-2xl p-2 z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold text-[var(--text-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <span>Select Review to Compare</span>
                    <span className="text-[10px] text-[var(--accent-primary)]">Side-by-Side</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {allReviews
                      .filter((r) => r.id !== review.id)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleCompareWith(r.id)}
                          className="w-full text-left p-2 rounded-lg hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-subtle)] transition-all flex items-center justify-between gap-2 cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-[var(--text-main)] truncate">
                                {r.author}
                              </span>
                              <span className="text-[10px] text-[var(--text-dim)] uppercase">
                                ({r.platform})
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[180px]">
                              {r.text}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-[var(--accent-primary)]">
                            <span>{r.rating}★</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Satisfying Resolved / Pending Interactive Toggle Switch */}
          <div className="flex items-center gap-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {review.status === 'replied' ? 'Resolved' : 'Pending'}
            </span>
            <button
              id="toggle-resolved-status-btn"
              role="switch"
              aria-checked={review.status === 'replied'}
              onClick={handleToggleResolvedState}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                review.status === 'replied' ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  review.status === 'replied' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

      </div>

      {/* Main Review Inspection Area (scrolls internally, never displaces action footer) */}
      <div className="p-4 sm:p-5 flex-1 min-h-0 overflow-y-auto space-y-4">
        
        {/* Urgent Risk Escalation Banner if high urgency */}
        {isUrgent && (
          <div 
            id="urgent-escalation-banner"
            className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-xs shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-200">
                High Urgency / Operational Liability Alert
              </span>
              <p className="text-rose-300/90 leading-relaxed font-mono text-[11px]">
                {review.urgencyReason || 'Critical negative feedback requires swift managerial acknowledgment.'}
              </p>
            </div>
          </div>
        )}

        {/* Full Review Text Quote Box (scrolls if very long 200+ words, nicely proportioned if short) */}
        <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2 min-h-[72px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>Customer Feedback</span>
            <span className="text-[11px] text-[var(--text-dim)]">Channel: {review.platform.toUpperCase()}</span>
          </div>
          <div className="max-h-56 overflow-y-auto pr-1">
            <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed italic break-words">
              "{review.text}"
            </p>
          </div>
        </div>

        {/* AI Insight Badge: Single-sentence summary of primary customer intent or emotional nuance */}
        <AiInsightBadge review={review} />

        {/* Uncategorized Review Action Prompt Card */}
        {review.category === 'uncategorized' && onAutoCategorize && (
          <div 
            id="detail-uncategorized-banner"
            className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in duration-200"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-900/60 border border-amber-500/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="font-semibold text-amber-100 block sm:inline">Uncategorized Customer Feedback:</span>
                <span className="text-amber-200/80 text-[11px] sm:ml-1 block sm:inline">
                  Let Gemini analyze the review content and assign the most appropriate operational issue category.
                </span>
              </div>
            </div>
            <button
              id="detail-auto-categorize-single-btn"
              onClick={() => onAutoCategorize([review.id])}
              disabled={isAutoCategorizing}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAutoCategorizing ? 'animate-spin' : ''}`} />
              <span>{isAutoCategorizing ? 'Categorizing...' : 'Auto-Categorize'}</span>
            </button>
          </div>
        )}

        {/* Triage Tag Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[var(--text-dim)] font-mono text-[11px]">Triage Tags:</span>
            <SentimentBadge sentiment={review.sentiment} size="md" />
            <CategoryBadge category={review.category} size="md" isAutoCategorized={review.isAutoCategorized} />
            <UrgencyBadge urgency={review.urgency} size="md" />
          </div>

          {/* AI Category Classification Reasoning Pill */}
          {review.categoryReasoning && (
            <div className="text-[11px] text-[var(--text-muted)] font-mono bg-[var(--bg-input)] px-3 py-2 rounded-lg border border-[var(--border-subtle)] flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-[var(--text-main)]">AI Categorization:</strong> {review.categoryReasoning}
                </span>
              </div>
              {typeof review.categoryConfidence === 'number' && (
                <span className="shrink-0 text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/40">
                  {Math.round(review.categoryConfidence * 100)}% Confidence
                </span>
              )}
            </div>
          )}
        </div>

        {/* AI Reply Generation / Audit Trail Section */}
        <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
          
          {/* AI Section Top Bar: Confidence score + Tone Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-main)] font-display">
                {isReplied ? 'Dispatched Response Record' : 'Assisted Reply Draft'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                {Math.round((review.aiDraft.confidenceScore || 0.95) * 100)}% Confidence
              </span>
            </div>

            {/* Tone Selector Tabs with Shortcut numbers */}
            {!isReplied && (
              <div className="flex items-center bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs gap-1">
                {([
                  { key: 'empathetic', label: 'Empathetic', num: '1' },
                  { key: 'professional', label: 'Formal', num: '2' },
                  { key: 'conciliatory', label: 'Conciliatory', num: '3' },
                  { key: 'appreciative', label: 'Appreciative', num: '4' },
                ] as const).map((item) => (
                  <button
                    key={item.key}
                    id={`tone-select-btn-${item.key}`}
                    onClick={() => handleToneSelect(item.key)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      selectedTone === item.key
                        ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] font-semibold shadow-sm border border-[var(--border-strong)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    title={`Switch tone to ${item.label} (Press ${item.num})`}
                  >
                    <span>{item.label}</span>
                    <kbd className="hidden md:inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-mono rounded bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-subtle)]">
                      {item.num}
                    </kbd>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rationale explanation */}
          <div className="text-[11px] text-[var(--text-muted)] font-mono bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
            <strong className="text-[var(--text-main)]">AI Strategy:</strong> {review.aiDraft.rationale}
          </div>

          {/* Success Checkmark Banner after posting */}
          {isSuccessAnimated && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Response successfully published to customer's review thread on {review.platform.toUpperCase()}.</span>
            </div>
          )}

          {/* Restored draft notice banner */}
          {isRestoredFromAutoSave && !isReplied && (
            <div 
              id="draft-autosave-restored-banner"
              className="px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-2 text-xs text-cyan-200 animate-in fade-in"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Save className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Restored your auto-saved working draft from localStorage.</span>
              </div>
              <button
                id="reset-to-ai-default-btn"
                onClick={handleResetToAiDefault}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-900/60 hover:bg-cyan-850 text-[11px] font-mono text-cyan-100 border border-cyan-500/40 cursor-pointer shrink-0 transition-colors"
                title="Discard localStorage changes and revert to the original AI generated response"
              >
                <Undo2 className="w-3 h-3" />
                <span>Reset to AI</span>
              </button>
            </div>
          )}

          {/* Editable Draft Textarea / Read-only history */}
          <div className="relative">
            <textarea
              id="draft-response-textarea"
              rows={4}
              value={draftText}
              disabled={isReplied}
              onChange={(e) => handleDraftChange(e.target.value)}
              onKeyDown={(e) => {
                const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (!isReplied && draftText.trim() && !isPosting) {
                    handlePost();
                  }
                }
              }}
              placeholder="Type or customize your response here... (Press Cmd+Enter to post)"
              className={`w-full p-3.5 text-xs sm:text-sm rounded-xl leading-relaxed transition-all focus:outline-none min-h-[110px] max-h-[220px] ${
                isReplied
                  ? 'bg-[var(--bg-input)] border border-emerald-500/30 text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-ring)]'
              }`}
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-dim)] px-1 mt-1">
              <span>{draftText.length} characters</span>
              <div className="flex items-center gap-3">
                {!isReplied && (
                  <span 
                    id="draft-autosave-indicator"
                    className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]"
                    title="Your edits are continuously saved locally to prevent work loss"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-saved
                  </span>
                )}
                <span>Direct dispatch integration ready</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Action Footer Bar (fixed shrink-0 at bottom) */}
      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            id="copy-draft-btn"
            onClick={handleCopy}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
            title="Copy response text (Press 'c')"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
            <kbd className="hidden sm:inline-block px-1 text-[9px] font-mono text-[var(--text-dim)] bg-[var(--bg-surface)] rounded border border-[var(--border-subtle)]">c</kbd>
          </button>

          {!isReplied && (
            <button
              id="regenerate-draft-btn"
              onClick={handleRegenerate}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
              title="Regenerate with AI (Press 'g')"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Regenerate</span>
              <kbd className="hidden sm:inline-block px-1 text-[9px] font-mono text-[var(--text-dim)] bg-[var(--bg-surface)] rounded border border-[var(--border-subtle)]">g</kbd>
            </button>
          )}

          {!isReplied && isRestoredFromAutoSave && (
            <button
              id="reset-draft-footer-btn"
              onClick={handleResetToAiDefault}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-[var(--bg-input)] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/30 transition-colors cursor-pointer"
              title="Reset to initial AI suggestion"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Reset to AI</span>
            </button>
          )}

          {isReplied && (
            <button
              id="edit-posted-reply-btn"
              onClick={() => setIsEditingExisting(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Edit Response</span>
            </button>
          )}
        </div>

        {/* Main Post Reply / Published Confirmation Button */}
        <div>
          {isReplied ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Replied & Resolved</span>
            </div>
          ) : (
            <button
              id="post-reply-submit-btn"
              onClick={handlePost}
              disabled={isPosting || !draftText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 active:scale-95 text-zinc-950 font-semibold text-xs disabled:opacity-50 transition-all shadow-md cursor-pointer"
              title="Post Reply (Cmd+Enter or Ctrl+Enter)"
            >
              {isPosting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Post Reply to {review.platform.toUpperCase()}</span>
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-950/20 text-zinc-950 border border-zinc-950/30 ml-1">
                    {typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}↵
                  </kbd>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  compareReviews,
  allReviews = [],
  onCloseComparison,
  onFocusSingleReview,
  onSelectCompareReview,
  onPostReply,
  onToggleStatus,
  onRegenerateDraft,
  onShowToast,
  onAutoCategorize,
  isAutoCategorizing = false,
}) => {
  // 1. If two reviews are selected for comparison, render SideBySideCompareView
  if (compareReviews && compareReviews.length === 2) {
    return (
      <SideBySideCompareView
        reviewA={compareReviews[0]}
        reviewB={compareReviews[1]}
        onCloseComparison={onCloseComparison || (() => {})}
        onFocusSingleReview={onFocusSingleReview || (() => {})}
        onPostReply={onPostReply}
        onToggleStatus={onToggleStatus}
        onRegenerateDraft={onRegenerateDraft}
        onShowToast={onShowToast}
      />
    );
  }

  // 2. If no review is selected, render empty placeholder
  if (!review) {
    return (
      <div id="no-review-selected-panel" className="h-full flex flex-col items-center justify-center p-8 bg-[#0d131f] border border-zinc-800 rounded-2xl text-center space-y-3 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
          <Bot className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-300 font-display">No Review Selected</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Select an incoming customer review from the inbox to inspect triage tags, audit urgency, and review or dispatch AI-assisted replies.
          </p>
        </div>
      </div>
    );
  }

  // 3. Render single review inspection
  return (
    <SingleReviewDetail
      review={review}
      allReviews={allReviews}
      onSelectCompareReview={onSelectCompareReview}
      onPostReply={onPostReply}
      onToggleStatus={onToggleStatus}
      onRegenerateDraft={onRegenerateDraft}
      onShowToast={onShowToast}
      onAutoCategorize={onAutoCategorize}
      isAutoCategorizing={isAutoCategorizing}
    />
  );
};
