import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Review, 
  FilterState, 
  Platform, 
  UrgencyLevel, 
  Sentiment, 
  IssueCategory, 
  ReviewStatus,
  SortOption 
} from '../types';
import { ReviewListItem } from './ReviewListItem';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ArrowUpDown, 
  Inbox, 
  AlertCircle, 
  SlidersHorizontal,
  Sparkles,
  Keyboard,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  Layers
} from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  selectedReviewId: string | null;
  onSelectReview: (id: string) => void;
  checkedReviewIds?: string[];
  onToggleCheck?: (id: string, e: React.MouseEvent) => void;
  onClearChecked?: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onBatchUpdateStatus?: (reviewIds: string[], newStatus: ReviewStatus) => void;
}

// Helper to parse relative times (e.g. '18m ago', '1h ago', '2d ago') into minutes for SLA sorting
function parseRelativeTimeToMinutes(rel: string): number {
  if (!rel) return 0;
  const str = rel.toLowerCase();
  if (str.includes('just now') || str.includes('now')) return 1;
  if (str.includes('m ago') || str.includes('min')) return parseInt(str, 10) || 10;
  if (str.includes('h ago') || str.includes('hour')) return (parseInt(str, 10) || 1) * 60;
  if (str.includes('d ago') || str.includes('day')) return (parseInt(str, 10) || 1) * 1440;
  return 60;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  selectedReviewId,
  onSelectReview,
  checkedReviewIds = [],
  onToggleCheck,
  onClearChecked,
  filters,
  onFilterChange,
  onResetFilters,
  onBatchUpdateStatus,
}) => {
  // Local search text for debounced updates
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search input by 180ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        onFilterChange({ searchQuery: localSearch });
      }
    }, 180);
    return () => clearTimeout(handler);
  }, [localSearch, filters.searchQuery, onFilterChange]);

  // Keep local search in sync if filters reset externally
  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  // Filter and Sort Logic
  const filteredAndSortedReviews = useMemo(() => {
    let result = reviews.filter((review) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchAuthor = review.author.toLowerCase().includes(q);
        const matchText = review.text.toLowerCase().includes(q);
        const matchCategory = review.category.toLowerCase().includes(q);
        const matchPlatform = review.platform.toLowerCase().includes(q);
        if (!matchAuthor && !matchText && !matchCategory && !matchPlatform) return false;
      }
      // Platform
      if (filters.platform !== 'all' && review.platform !== filters.platform) return false;
      // Urgency
      if (filters.urgency !== 'all' && review.urgency !== filters.urgency) return false;
      // Sentiment
      if (filters.sentiment !== 'all' && review.sentiment !== filters.sentiment) return false;
      // Category
      if (filters.category !== 'all' && review.category !== filters.category) return false;
      // Status
      if (filters.status !== 'all' && review.status !== filters.status) return false;
      // Star Rating
      if (filters.rating !== 'all' && review.rating !== filters.rating) return false;

      return true;
    });

    // Apply Sorting
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'urgent') {
        const urgencyWeight = { high: 3, medium: 2, low: 1 };
        return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      }
      if (filters.sortBy === 'response-time') {
        // Pending reviews first, ordered by longest pending duration (most overdue first)
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return parseRelativeTimeToMinutes(b.relativeTime) - parseRelativeTimeToMinutes(a.relativeTime);
      }
      if (filters.sortBy === 'lowest-rating') {
        return a.rating - b.rating;
      }
      if (filters.sortBy === 'highest-rating') {
        return b.rating - a.rating;
      }
      // default: newest
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [reviews, filters]);

  // Visible IDs
  const visibleReviewIds = useMemo(() => 
    filteredAndSortedReviews.map((r) => r.id),
    [filteredAndSortedReviews]
  );

  const isAllVisibleChecked = 
    visibleReviewIds.length > 0 && 
    visibleReviewIds.every((id) => checkedReviewIds.includes(id));

  const isSomeVisibleChecked = 
    visibleReviewIds.some((id) => checkedReviewIds.includes(id)) && 
    !isAllVisibleChecked;

  // Toggle selection for an individual review
  const handleToggleCheck = (id: string, e: React.MouseEvent) => {
    if (onToggleCheck) {
      onToggleCheck(id, e);
    }
  };

  // Toggle Select All Visible
  const handleToggleSelectAll = () => {
    if (!onToggleCheck) return;
    if (isAllVisibleChecked) {
      if (onClearChecked) onClearChecked();
    } else {
      visibleReviewIds.forEach((id) => {
        if (!checkedReviewIds.includes(id)) {
          onToggleCheck(id, {} as React.MouseEvent);
        }
      });
    }
  };

  // Execute Batch Status Update
  const handleExecuteBatchStatus = (newStatus: ReviewStatus) => {
    if (checkedReviewIds.length === 0) return;
    if (onBatchUpdateStatus) {
      onBatchUpdateStatus(checkedReviewIds, newStatus);
    }
    if (onClearChecked) {
      onClearChecked();
    }
  };

  // Keyboard navigation handler (Up/Down arrow keys + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (filteredAndSortedReviews.length === 0) return;

      const currentIndex = filteredAndSortedReviews.findIndex((r) => r.id === selectedReviewId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < filteredAndSortedReviews.length - 1 && currentIndex >= 0
          ? currentIndex + 1 
          : 0;
        if (filteredAndSortedReviews[nextIndex]) {
          onSelectReview(filteredAndSortedReviews[nextIndex].id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 
          ? currentIndex - 1 
          : filteredAndSortedReviews.length - 1;
        if (filteredAndSortedReviews[prevIndex]) {
          onSelectReview(filteredAndSortedReviews[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredAndSortedReviews, selectedReviewId, onSelectReview]);

  // Synchronize selection if currently selected review gets filtered out
  useEffect(() => {
    if (filteredAndSortedReviews.length > 0) {
      const isSelectedVisible = filteredAndSortedReviews.some((r) => r.id === selectedReviewId);
      if (!isSelectedVisible) {
        onSelectReview(filteredAndSortedReviews[0].id);
      }
    }
  }, [filteredAndSortedReviews, selectedReviewId, onSelectReview]);

  // Check if inbox is completely caught up (all items in the system are replied or pending filter has 0 items)
  const isInboxAllCaughtUp = 
    reviews.length > 0 && 
    (reviews.every((r) => r.status === 'replied') || (filters.status === 'pending' && !reviews.some((r) => r.status === 'pending')));


  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.platform !== 'all' || 
    filters.urgency !== 'all' || 
    filters.sentiment !== 'all' || 
    filters.category !== 'all' || 
    filters.status !== 'all' ||
    filters.rating !== 'all' ||
    filters.sortBy !== 'newest';

  return (
    <div id="review-inbox-container" className="flex flex-col h-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-lg">
      
      {/* Top Search, Tabs & Quick Filters */}
      <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 space-y-3">
        
        {/* Search bar + Sort selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="review-search-input"
              type="text"
              placeholder="Search reviews, names, issue types..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              id="sort-select-dropdown"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              aria-label="Sort reviews"
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest" className="bg-zinc-900 text-zinc-200">Newest First</option>
              <option value="response-time" className="bg-zinc-900 text-zinc-200">Response Time (Overdue first)</option>
              <option value="urgent" className="bg-zinc-900 text-zinc-200">Most Urgent</option>
              <option value="lowest-rating" className="bg-zinc-900 text-zinc-200">Lowest Rating</option>
              <option value="highest-rating" className="bg-zinc-900 text-zinc-200">Highest Rating</option>
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            id="toggle-advanced-filters-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle filter controls"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Status Filter Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center rounded-xl bg-zinc-900/90 p-1 border border-zinc-800">
            <button
              id="filter-status-all"
              onClick={() => onFilterChange({ status: 'all' })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                filters.status === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              id="filter-status-pending"
              onClick={() => onFilterChange({ status: 'pending' })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                filters.status === 'pending'
                  ? 'bg-zinc-800 text-amber-300 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Needs Reply ({reviews.filter(r => r.status === 'pending').length})
            </button>
            <button
              id="filter-status-replied"
              onClick={() => onFilterChange({ status: 'replied' })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                filters.status === 'replied'
                  ? 'bg-zinc-800 text-emerald-300 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Replied ({reviews.filter(r => r.status === 'replied').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                id="reset-all-filters-btn"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/60 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <span className="text-[11px] font-mono text-zinc-400">
              Showing {filteredAndSortedReviews.length} of {reviews.length}
            </span>
          </div>
        </div>

        {/* Collapsible Filter Chips Drawer */}
        {showAdvancedFilters && (
          <div className="pt-2 border-t border-zinc-800 space-y-2 text-[11px] font-mono">
            {/* Row 1: Platforms & Urgency */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Platform:</span>
              {(['all', 'google', 'yelp', 'facebook'] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => onFilterChange({ platform: plat })}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                    filters.platform === plat
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {plat === 'all' ? 'All Channels' : plat.toUpperCase()}
                </button>
              ))}

              <span className="text-zinc-500 text-[10px] uppercase tracking-wider ml-2">Urgency:</span>
              {(['all', 'high', 'medium', 'low'] as const).map((urg) => (
                <button
                  key={urg}
                  onClick={() => onFilterChange({ urgency: urg })}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                    filters.urgency === urg
                      ? urg === 'high'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold'
                        : 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {urg === 'all' ? 'All Urgencies' : urg.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Row 2: Sentiment & Categories */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Sentiment:</span>
              {(['all', 'positive', 'neutral', 'negative'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onFilterChange({ sentiment: s })}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                    filters.sentiment === s
                      ? s === 'positive'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                        : s === 'negative'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold'
                        : 'bg-slate-800 border-slate-600 text-slate-200 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s === 'all' ? 'All Sentiments' : s.toUpperCase()}
                </button>
              ))}

              <span className="text-zinc-500 text-[10px] uppercase tracking-wider ml-2">Rating:</span>
              {(['all', 5, 4, 3, 2, 1] as const).map((r) => (
                <button
                  key={String(r)}
                  onClick={() => onFilterChange({ rating: r })}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                    filters.rating === r
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {r === 'all' ? 'All Stars' : `${r}★`}
                </button>
              ))}
            </div>

            {/* Row 3: Visual Response Time / SLA Priority Legend */}
            <div className="flex items-center gap-3 flex-wrap pt-1.5 border-t border-zinc-800/80 text-[10px]">
              <span className="text-zinc-500 uppercase tracking-wider">Response SLA Gauges:</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>&lt; 2h (Optimal)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                <span>2–8h (Warning)</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>
                <span>&gt; 8h (Critical Overdue)</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Select All & Bulk Action Bar */}
      {checkedReviewIds.length > 0 ? (
        <div id="bulk-action-bar" className="px-3.5 py-2 bg-cyan-950/90 border-b border-cyan-500/40 flex items-center justify-between gap-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="bulk-toggle-all-btn"
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 text-cyan-200 hover:text-white font-medium cursor-pointer"
              title={isAllVisibleChecked ? "Deselect visible" : "Select all visible"}
            >
              <div className="w-4 h-4 rounded border border-cyan-400 bg-cyan-500 text-zinc-950 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-3 h-3 stroke-[3.5]" />
              </div>
              <span className="font-semibold text-xs text-cyan-100">
                {checkedReviewIds.length} Selected
              </span>
              {checkedReviewIds.length === 2 && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-900/80 text-cyan-200 border border-cyan-400/40 text-[10px] font-mono">
                  Side-by-Side Comparison Active
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Batch Mark as Replied / Resolved */}
            <button
              id="bulk-action-mark-replied"
              onClick={() => handleExecuteBatchStatus('replied')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold text-xs shadow-sm transition-all cursor-pointer"
              title="Batch mark selected as replied"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 stroke-[2.5]" />
              <span>Mark Replied</span>
            </button>

            {/* Batch Mark as Pending / Needs Reply */}
            <button
              id="bulk-action-mark-pending"
              onClick={() => handleExecuteBatchStatus('pending')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 text-xs transition-all cursor-pointer"
              title="Batch mark selected as needs reply"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Needs Reply</span>
            </button>

            {/* Clear selection */}
            <button
              id="bulk-action-clear"
              onClick={() => onClearChecked && onClearChecked()}
              className="p-1 rounded-md text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/50 transition-colors cursor-pointer"
              title="Cancel selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Keyboard Navigation & Bulk Select Helper Banner */
        <div className="px-4 py-1.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            {visibleReviewIds.length > 0 && (
              <button
                id="select-all-visible-checkbox-btn"
                onClick={handleToggleSelectAll}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                title="Select all visible reviews for bulk action"
              >
                <div className="w-3.5 h-3.5 rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-900 flex items-center justify-center"></div>
                <span>Select all</span>
              </button>
            )}
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              <Keyboard className="w-3 h-3 text-zinc-400" />
              <span><kbd className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold">↑</kbd> <kbd className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold">↓</kbd> to navigate</span>
            </span>
          </div>
          <span>Press <kbd className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold">Enter</kbd> to inspect</span>
        </div>
      )}

      {/* Review List Scroll Container */}
      <div 
        ref={listContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[580px] sm:max-h-[640px]"
      >
        {filteredAndSortedReviews.length === 0 ? (
          isInboxAllCaughtUp && !hasActiveFilters ? (
            /* Calm All Caught Up State */
            <div id="review-list-all-caught-up-state" className="h-72 flex flex-col items-center justify-center text-center p-6 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="text-sm font-semibold text-zinc-100 font-display flex items-center justify-center gap-1.5">
                  <span>Inbox Zero • All Caught Up!</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every incoming customer review has been reviewed and resolved. Great job maintaining response SLAs!
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="view-resolved-archive-btn"
                  onClick={() => onFilterChange({ status: 'all' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 rounded-xl hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  View All Reviews
                </button>
              </div>
            </div>
          ) : (
            /* Styled Filter Empty State */
            <div id="review-list-empty-state" className="h-72 flex flex-col items-center justify-center text-center p-6 space-y-3.5">
              <div className="w-13 h-13 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="text-sm font-semibold text-zinc-200 font-display">No Reviews Match Criteria</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No customer feedback matches the active filter or search query.
                </p>
              </div>
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs text-[11px] font-mono">
                {filters.searchQuery && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                    Query: "{filters.searchQuery}"
                  </span>
                )}
                {filters.platform !== 'all' && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                    {filters.platform}
                  </span>
                )}
                {filters.urgency !== 'all' && (
                  <span className="px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-500/30">
                    Urgency: {filters.urgency}
                  </span>
                )}
                {filters.sentiment !== 'all' && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {filters.sentiment}
                  </span>
                )}
              </div>
              <button
                id="empty-state-reset-btn"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-xl hover:bg-cyan-900/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters & Search
              </button>
            </div>
          )
        ) : (
          filteredAndSortedReviews.map((review, index) => (
            <ReviewListItem
              key={review.id}
              review={review}
              index={index}
              isSelected={review.id === selectedReviewId}
              isChecked={checkedReviewIds.includes(review.id)}
              onToggleCheck={handleToggleCheck}
              onSelect={onSelectReview}
            />
          ))
        )}
      </div>

    </div>
  );
};
