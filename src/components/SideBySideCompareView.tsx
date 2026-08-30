import React, { useState, useEffect } from 'react';
import { Review, AiDraftTone, ReviewStatus } from '../types';
import { PlatformBadge, SentimentBadge, CategoryBadge, UrgencyBadge, StarRating } from './Badge';
import { ResponseTimeIndicator } from './ResponseTimeIndicator';
import { AiInsightBadge } from './AiInsightBadge';
import { getSavedDraft, saveDraftToStorage, clearSavedDraft } from '../utils/draftStorage';
import { 
  Columns, 
  X, 
  ArrowRightLeft, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Copy, 
  Send, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Equal,
  Maximize2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Save
} from 'lucide-react';

interface SideBySideCompareViewProps {
  reviewA: Review;
  reviewB: Review;
  onCloseComparison: () => void;
  onFocusSingleReview: (reviewId: string) => void;
  onPostReply: (reviewId: string, replyText: string, tone: AiDraftTone) => void;
  onToggleStatus: (reviewId: string, newStatus: ReviewStatus) => void;
  onRegenerateDraft: (reviewId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'urgent') => void;
}

export const SideBySideCompareView: React.FC<SideBySideCompareViewProps> = ({
  reviewA: initialA,
  reviewB: initialB,
  onCloseComparison,
  onFocusSingleReview,
  onPostReply,
  onToggleStatus,
  onRegenerateDraft,
  onShowToast,
}) => {
  // Allow swapping sides A <-> B
  const [isSwapped, setIsSwapped] = useState(false);
  const reviewA = isSwapped ? initialB : initialA;
  const reviewB = isSwapped ? initialA : initialB;

  // Local reply draft states for both reviews with localStorage recovery
  const [draftA, setDraftA] = useState<string>(() => {
    const saved = getSavedDraft(reviewA.id);
    if (saved && saved.text && reviewA.status !== 'replied') {
      return saved.text;
    }
    return reviewA.status === 'replied' && reviewA.reply
      ? reviewA.reply.text
      : reviewA.aiDraft.tones[reviewA.aiDraft.selectedTone] || reviewA.aiDraft.currentText;
  });
  const [toneA, setToneA] = useState<AiDraftTone>(() => {
    const saved = getSavedDraft(reviewA.id);
    return saved?.tone || reviewA.aiDraft.selectedTone;
  });
  const [isPostingA, setIsPostingA] = useState(false);
  const [copiedA, setCopiedA] = useState(false);

  const [draftB, setDraftB] = useState<string>(() => {
    const saved = getSavedDraft(reviewB.id);
    if (saved && saved.text && reviewB.status !== 'replied') {
      return saved.text;
    }
    return reviewB.status === 'replied' && reviewB.reply
      ? reviewB.reply.text
      : reviewB.aiDraft.tones[reviewB.aiDraft.selectedTone] || reviewB.aiDraft.currentText;
  });
  const [toneB, setToneB] = useState<AiDraftTone>(() => {
    const saved = getSavedDraft(reviewB.id);
    return saved?.tone || reviewB.aiDraft.selectedTone;
  });
  const [isPostingB, setIsPostingB] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  // Sync drafts when reviews change or are swapped
  useEffect(() => {
    const savedA = getSavedDraft(reviewA.id);
    if (savedA && savedA.text && reviewA.status !== 'replied') {
      setDraftA(savedA.text);
      setToneA(savedA.tone || reviewA.aiDraft.selectedTone);
    } else if (reviewA.status === 'replied' && reviewA.reply) {
      setDraftA(reviewA.reply.text);
      setToneA(reviewA.reply.toneUsed || reviewA.aiDraft.selectedTone);
    } else {
      setDraftA(reviewA.aiDraft.tones[reviewA.aiDraft.selectedTone] || reviewA.aiDraft.currentText);
      setToneA(reviewA.aiDraft.selectedTone);
    }

    const savedB = getSavedDraft(reviewB.id);
    if (savedB && savedB.text && reviewB.status !== 'replied') {
      setDraftB(savedB.text);
      setToneB(savedB.tone || reviewB.aiDraft.selectedTone);
    } else if (reviewB.status === 'replied' && reviewB.reply) {
      setDraftB(reviewB.reply.text);
      setToneB(reviewB.reply.toneUsed || reviewB.aiDraft.selectedTone);
    } else {
      setDraftB(reviewB.aiDraft.tones[reviewB.aiDraft.selectedTone] || reviewB.aiDraft.currentText);
      setToneB(reviewB.aiDraft.selectedTone);
    }
  }, [reviewA.id, reviewB.id, isSwapped]);

  // Rating Delta calculation
  const ratingDelta = reviewB.rating - reviewA.rating;
  const isRatingEqual = ratingDelta === 0;

  // Sentiment Contrast
  const isSentimentEqual = reviewA.sentiment === reviewB.sentiment;
  const sentimentScoreMap = { positive: 3, neutral: 2, negative: 1 };
  const sentimentShift = sentimentScoreMap[reviewB.sentiment] - sentimentScoreMap[reviewA.sentiment];

  // Category Contrast
  const isCategoryEqual = reviewA.category === reviewB.category;

  // Urgency Contrast
  const urgencyWeight = { high: 3, medium: 2, low: 1 };
  const isUrgencyEqual = reviewA.urgency === reviewB.urgency;

  // Tone handlers
  const handleToneSelectA = (tone: AiDraftTone) => {
    setToneA(tone);
    if (reviewA.aiDraft.tones[tone]) {
      const text = reviewA.aiDraft.tones[tone];
      setDraftA(text);
      saveDraftToStorage(reviewA.id, text, tone);
      onShowToast(`Review A Tone: ${tone.toUpperCase()}`, 'info');
    }
  };

  const handleToneSelectB = (tone: AiDraftTone) => {
    setToneB(tone);
    if (reviewB.aiDraft.tones[tone]) {
      const text = reviewB.aiDraft.tones[tone];
      setDraftB(text);
      saveDraftToStorage(reviewB.id, text, tone);
      onShowToast(`Review B Tone: ${tone.toUpperCase()}`, 'info');
    }
  };

  const handleDraftChangeA = (text: string) => {
    setDraftA(text);
    if (reviewA.status !== 'replied') {
      saveDraftToStorage(reviewA.id, text, toneA);
    }
  };

  const handleDraftChangeB = (text: string) => {
    setDraftB(text);
    if (reviewB.status !== 'replied') {
      saveDraftToStorage(reviewB.id, text, toneB);
    }
  };

  // Copy handlers
  const handleCopyA = () => {
    navigator.clipboard.writeText(draftA);
    setCopiedA(true);
    onShowToast(`Review A draft copied`, 'info');
    setTimeout(() => setCopiedA(false), 2000);
  };

  const handleCopyB = () => {
    navigator.clipboard.writeText(draftB);
    setCopiedB(true);
    onShowToast(`Review B draft copied`, 'info');
    setTimeout(() => setCopiedB(false), 2000);
  };

  // Post handlers
  const handlePostA = () => {
    if (!draftA.trim()) return;
    setIsPostingA(true);
    clearSavedDraft(reviewA.id);
    setTimeout(() => {
      onPostReply(reviewA.id, draftA.trim(), toneA);
      setIsPostingA(false);
      onShowToast(`Reply dispatched to ${reviewA.author} (${reviewA.platform.toUpperCase()})`, 'success');
    }, 500);
  };

  const handlePostB = () => {
    if (!draftB.trim()) return;
    setIsPostingB(true);
    clearSavedDraft(reviewB.id);
    setTimeout(() => {
      onPostReply(reviewB.id, draftB.trim(), toneB);
      setIsPostingB(false);
      onShowToast(`Reply dispatched to ${reviewB.author} (${reviewB.platform.toUpperCase()})`, 'success');
    }, 500);
  };

  return (
    <div 
      id="side-by-side-comparison-container"
      className="flex flex-col h-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xl"
    >
      
      {/* 1. Comparison Header & Control Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 flex items-center justify-center text-[var(--accent-primary)]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="comparison-view-title" className="text-sm sm:text-base font-semibold text-[var(--text-main)] font-display">
                Side-by-Side Review Comparison
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-input)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                2 Selected
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Comparing sentiment, rating, categorization & response strategy
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="swap-comparison-sides-btn"
            onClick={() => setIsSwapped(!isSwapped)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
            title="Swap Left and Right reviews"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap Sides</span>
          </button>

          <button
            id="close-comparison-mode-btn"
            onClick={onCloseComparison}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
            title="Exit comparison and return to single view"
          >
            <X className="w-3.5 h-3.5" />
            <span>Single View</span>
          </button>
        </div>
      </div>

      {/* 2. Differential Analysis Delta Banner */}
      <div 
        id="comparison-differential-banner"
        className="p-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0 text-xs"
      >
        {/* Rating Difference */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Rating Delta:</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold">
            {isRatingEqual ? (
              <span className="text-zinc-400 flex items-center gap-1">
                <Equal className="w-3.5 h-3.5" />
                Equal ({reviewA.rating}★)
              </span>
            ) : ratingDelta > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{ratingDelta.toFixed(1)}★ (B is higher)
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                {ratingDelta.toFixed(1)}★ (A is higher)
              </span>
            )}
          </div>
        </div>

        {/* Sentiment Contrast */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Sentiment:</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {isSentimentEqual ? (
              <span className="text-zinc-300 font-semibold">
                Match ({reviewA.sentiment.toUpperCase()})
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                {reviewA.sentiment.toUpperCase()} <span className="text-zinc-500">vs</span> {reviewB.sentiment.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Category Cross-Domain */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Category:</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {isCategoryEqual ? (
              <span className="text-cyan-300 font-semibold">
                Same Topic ({reviewA.category.toUpperCase()})
              </span>
            ) : (
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                {reviewA.category.toUpperCase()} <span className="text-zinc-500">≠</span> {reviewB.category.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Dual Columns Side-by-Side Body */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* COLUMN A: Review A */}
        <div 
          id={`compare-column-review-a-${reviewA.id}`}
          className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-4 space-y-3.5 relative"
        >
          {/* Column A Top Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[var(--accent-primary)] text-zinc-950 font-bold text-[10px] font-mono">
                REVIEW A
              </span>
              <button
                onClick={() => onFocusSingleReview(reviewA.id)}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center gap-1 font-mono cursor-pointer"
                title="Focus only this review in single view"
              >
                <Maximize2 className="w-3 h-3" />
                Focus
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                reviewA.status === 'replied'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}>
                {reviewA.status === 'replied' ? 'Resolved' : 'Needs Reply'}
              </span>
            </div>
          </div>

          {/* Author, Platform & Star Rating */}
          <div className="flex items-start justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-[var(--text-main)] font-display">
                  {reviewA.author}
                </h3>
                <PlatformBadge platform={reviewA.platform} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--text-dim)]" />
                  <span>{reviewA.date}</span>
                </span>
                <span>•</span>
                <ResponseTimeIndicator review={reviewA} variant="compact" />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <StarRating rating={reviewA.rating} size="sm" />
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {reviewA.rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Triage Pills for Review A */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <SentimentBadge sentiment={reviewA.sentiment} size="sm" />
            <CategoryBadge category={reviewA.category} size="sm" />
            <UrgencyBadge urgency={reviewA.urgency} size="sm" />
          </div>

          {/* Review Text Quote */}
          <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] italic leading-relaxed">
            "{reviewA.text}"
          </div>

          {/* AI Insight Badge */}
          <AiInsightBadge review={reviewA} />

          {/* AI Strategy & Confidence */}
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Strategy A
              </span>
              <span>{Math.round((reviewA.aiDraft.confidenceScore || 0.95) * 100)}% Match</span>
            </div>
            <p className="text-[var(--text-muted)] text-[10px] bg-[var(--bg-input)] p-2 rounded border border-[var(--border-subtle)]">
              {reviewA.aiDraft.rationale}
            </p>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] text-[10px]">
            {(['empathetic', 'professional', 'conciliatory', 'appreciative'] as AiDraftTone[]).map((t) => (
              <button
                key={t}
                onClick={() => handleToneSelectA(t)}
                className={`flex-1 py-1 rounded transition-all cursor-pointer font-mono ${
                  toneA === t
                    ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] font-bold shadow border border-[var(--border-strong)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.slice(0, 4)}
              </button>
            ))}
          </div>

          {/* Draft Reply Area */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-end">
            <textarea
              id={`compare-draft-textarea-a-${reviewA.id}`}
              rows={3}
              value={draftA}
              onChange={(e) => handleDraftChangeA(e.target.value)}
              placeholder="Response draft..."
              className="w-full p-2.5 text-xs rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none resize-none"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                id={`compare-copy-a-btn-${reviewA.id}`}
                onClick={handleCopyA}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs cursor-pointer"
              >
                {copiedA ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedA ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                id={`compare-post-a-btn-${reviewA.id}`}
                onClick={handlePostA}
                disabled={isPostingA || !draftA.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:opacity-90 text-zinc-950 font-semibold text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isPostingA ? 'Sending...' : 'Post Reply A'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN B: Review B */}
        <div 
          id={`compare-column-review-b-${reviewB.id}`}
          className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-4 space-y-3.5 relative"
        >
          {/* Column B Top Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-400 text-zinc-950 font-bold text-[10px] font-mono">
                REVIEW B
              </span>
              <button
                onClick={() => onFocusSingleReview(reviewB.id)}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center gap-1 font-mono cursor-pointer"
                title="Focus only this review in single view"
              >
                <Maximize2 className="w-3 h-3" />
                Focus
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                reviewB.status === 'replied'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}>
                {reviewB.status === 'replied' ? 'Resolved' : 'Needs Reply'}
              </span>
            </div>
          </div>

          {/* Author, Platform & Star Rating */}
          <div className="flex items-start justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-[var(--text-main)] font-display">
                  {reviewB.author}
                </h3>
                <PlatformBadge platform={reviewB.platform} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--text-dim)]" />
                  <span>{reviewB.date}</span>
                </span>
                <span>•</span>
                <ResponseTimeIndicator review={reviewB} variant="compact" />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <StarRating rating={reviewB.rating} size="sm" />
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {reviewB.rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Triage Pills for Review B */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <SentimentBadge sentiment={reviewB.sentiment} size="sm" />
            <CategoryBadge category={reviewB.category} size="sm" />
            <UrgencyBadge urgency={reviewB.urgency} size="sm" />
          </div>

          {/* Review Text Quote */}
          <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] italic leading-relaxed">
            "{reviewB.text}"
          </div>

          {/* AI Insight Badge */}
          <AiInsightBadge review={reviewB} />

          {/* AI Strategy & Confidence */}
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-purple-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Strategy B
              </span>
              <span>{Math.round((reviewB.aiDraft.confidenceScore || 0.95) * 100)}% Match</span>
            </div>
            <p className="text-[var(--text-muted)] text-[10px] bg-[var(--bg-input)] p-2 rounded border border-[var(--border-subtle)]">
              {reviewB.aiDraft.rationale}
            </p>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] text-[10px]">
            {(['empathetic', 'professional', 'conciliatory', 'appreciative'] as AiDraftTone[]).map((t) => (
              <button
                key={t}
                onClick={() => handleToneSelectB(t)}
                className={`flex-1 py-1 rounded transition-all cursor-pointer font-mono ${
                  toneB === t
                    ? 'bg-[var(--bg-surface)] text-purple-400 font-bold shadow border border-[var(--border-strong)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.slice(0, 4)}
              </button>
            ))}
          </div>

          {/* Draft Reply Area */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-end">
            <textarea
              id={`compare-draft-textarea-b-${reviewB.id}`}
              rows={3}
              value={draftB}
              onChange={(e) => handleDraftChangeB(e.target.value)}
              placeholder="Response draft..."
              className="w-full p-2.5 text-xs rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-purple-400 focus:outline-none resize-none"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                id={`compare-copy-b-btn-${reviewB.id}`}
                onClick={handleCopyB}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs cursor-pointer"
              >
                {copiedB ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedB ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                id={`compare-post-b-btn-${reviewB.id}`}
                onClick={handlePostB}
                disabled={isPostingB || !draftB.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-400 hover:bg-purple-300 text-zinc-950 font-semibold text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isPostingB ? 'Sending...' : 'Post Reply B'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
