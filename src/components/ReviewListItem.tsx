import React from 'react';
import { Review } from '../types';
import { PlatformBadge, SentimentBadge, CategoryBadge, UrgencyBadge, StarRating } from './Badge';
import { ShieldAlert, CheckCircle2, Clock, CornerDownRight } from 'lucide-react';
import { ResponseTimeIndicator } from './ResponseTimeIndicator';

interface ReviewListItemProps {
  review: Review;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
  isChecked?: boolean;
  onToggleCheck?: (id: string, e: React.MouseEvent) => void;
}

export const ReviewListItem = React.memo<ReviewListItemProps>(({
  review,
  isSelected,
  onSelect,
  index,
  isChecked = false,
  onToggleCheck,
}) => {
  const isHighUrgent = review.urgency === 'high';
  const isPending = review.status === 'pending';

  return (
    <div
      id={`review-item-${review.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(review.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(review.id);
        }
      }}
      className={`group relative p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 outline-none text-left border ${
        isChecked
          ? 'bg-cyan-950/30 border-cyan-500/70 ring-1 ring-cyan-500/30'
          : isSelected
          ? 'bg-zinc-850/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
          : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-850/60 hover:border-zinc-700'
      } ${
        isHighUrgent && isPending
          ? 'border-l-4 border-l-rose-500'
          : ''
      }`}
    >
      {/* Signature Detail: Pulsing Beacon for High Urgent Reviews */}
      {isHighUrgent && isPending && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-zinc-900"></span>
        </span>
      )}

      {/* Header Line: Checkbox, Author, Platform, Stars, Time */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* Bulk Action Checkbox */}
          {onToggleCheck && (
            <div 
              id={`checkbox-wrapper-${review.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCheck(review.id, e);
              }}
              className="shrink-0 flex items-center justify-center cursor-pointer p-0.5"
              title={isChecked ? "Deselect review" : "Select for bulk action"}
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                isChecked
                  ? 'bg-cyan-500 border-cyan-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900/90 border-zinc-700 group-hover:border-zinc-500 text-transparent'
              }`}>
                <CheckCircle2 className={`w-3 h-3 ${isChecked ? 'stroke-[3.5]' : 'opacity-0'}`} />
              </div>
            </div>
          )}

          <span className="font-semibold text-xs sm:text-sm text-zinc-100 truncate font-display">
            {review.author}
          </span>
          <PlatformBadge platform={review.platform} size="sm" />
        </div>
        
        <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-zinc-400">
          <StarRating rating={review.rating} size="sm" />
          <ResponseTimeIndicator review={review} variant="compact" />
        </div>
      </div>

      {/* Text preview */}
      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2.5">
        {review.text}
      </p>

      {/* Footer Tags & Status Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-zinc-800/60 text-[11px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <SentimentBadge sentiment={review.sentiment} />
          <CategoryBadge category={review.category} />
          {isHighUrgent && <UrgencyBadge urgency="high" />}
        </div>

        <div>
          {review.status === 'replied' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              Replied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
              <Clock className="w-3 h-3 text-amber-400" />
              Needs Reply
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ReviewListItem.displayName = 'ReviewListItem';
