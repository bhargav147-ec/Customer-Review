import React from 'react';
import { Review, UrgencyLevel } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { 
  Star, 
  ShieldAlert, 
  Clock, 
  TrendingDown, 
  MessageSquareText, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface SummaryBarProps {
  reviews: Review[];
  onSelectUrgencyFilter: (urgency: UrgencyLevel | 'all') => void;
  onSelectSentimentFilter: (sentiment: 'negative' | 'all') => void;
  onSelectStatusFilter: (status: 'pending' | 'all') => void;
  activeUrgencyFilter: string;
  activeSentimentFilter: string;
  activeStatusFilter: string;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  reviews,
  onSelectUrgencyFilter,
  onSelectSentimentFilter,
  onSelectStatusFilter,
  activeUrgencyFilter,
  activeSentimentFilter,
  activeStatusFilter,
}) => {
  const total = reviews.length;
  const avgRating = total > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / total 
    : 0;
  
  const negativeCount = reviews.filter((r) => r.sentiment === 'negative').length;
  const negativePercent = total > 0 ? (negativeCount / total) * 100 : 0;

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const urgentPendingCount = reviews.filter((r) => r.urgency === 'high' && r.status === 'pending').length;

  return (
    <div 
      id="summary-metrics-bar" 
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full"
    >
      
      {/* 1. Total Reviews Counter */}
      <div 
        id="metric-card-total-reviews"
        className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col justify-between hover:border-[var(--border-strong)] transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Total Reviews</span>
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
            <MessageSquareText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-main)]">
            <AnimatedCounter value={total} duration={800} />
          </span>
          <span className="text-[11px] font-mono text-[var(--text-dim)]">synced</span>
        </div>
        <span className="text-[10px] text-[var(--text-dim)] font-mono mt-1">Google • Yelp • Facebook</span>
      </div>

      {/* 2. Average Rating Counter */}
      <div 
        id="metric-card-avg-rating"
        className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col justify-between hover:border-amber-500/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Average Rating</span>
          <div className="w-7 h-7 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-display text-amber-300 flex items-center gap-1.5">
            <AnimatedCounter value={avgRating} decimals={1} duration={900} />
            <span className="text-sm font-normal text-[var(--text-dim)]">/ 5.0</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-mono mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Rolling satisfaction score</span>
        </div>
      </div>

      {/* 3. % Negative Reviews Counter */}
      <div 
        id="metric-card-pct-negative"
        onClick={() => onSelectSentimentFilter(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-md flex flex-col justify-between transition-all cursor-pointer group ${
          activeSentimentFilter === 'negative'
            ? 'bg-rose-950/30 border-rose-500 ring-1 ring-rose-500/20'
            : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-rose-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-rose-300 transition-colors">
            % Negative Reviews
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-display text-rose-400 flex items-center">
            <AnimatedCounter value={negativePercent} decimals={0} suffix="%" duration={850} />
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            ({negativeCount} reviews)
          </span>
        </div>
        <span className="text-[10px] text-rose-400/90 font-mono mt-1 flex items-center gap-1 group-hover:underline">
          {activeSentimentFilter === 'negative' ? 'Filtering negative' : 'Click to filter negative'}
        </span>
      </div>

      {/* 4. Average Response Time Counter */}
      <div 
        id="metric-card-avg-response-time"
        onClick={() => onSelectStatusFilter(activeStatusFilter === 'pending' ? 'all' : 'pending')}
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-md flex flex-col justify-between transition-all cursor-pointer group ${
          activeStatusFilter === 'pending'
            ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/20'
            : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-amber-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-amber-300 transition-colors">
            Avg Response Time
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-display text-[var(--accent-primary)] font-mono">
            <AnimatedCounter value={14} suffix=" min" duration={750} />
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            -82% vs SLA
          </span>
        </div>
        <span className="text-[10px] text-amber-400/90 font-mono mt-1 flex items-center gap-1">
          {pendingCount > 0 ? `${pendingCount} pending reply (${urgentPendingCount} urgent)` : 'All replied'}
        </span>
      </div>

    </div>
  );
};
