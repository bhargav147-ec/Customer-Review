import React from 'react';
import { Review, Sentiment } from '../types';
import { Sparkles, BrainCircuit, HeartHandshake, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AiInsightBadgeProps {
  review: Review;
  variant?: 'badge' | 'card' | 'compact';
  className?: string;
}

/**
 * Derives a sharp, single-sentence customer intent / emotional nuance insight if not already explicitly provided
 */
export function getReviewAiInsight(review: Review): string {
  if (review.aiInsight) {
    return review.aiInsight;
  }

  // Smart fallback synthesis based on review text, sentiment, urgency and category
  const text = (review.text || '').toLowerCase();
  
  if (review.sentiment === 'positive') {
    if (text.includes('regular') || text.includes('weekly') || text.includes('always')) {
      return 'Customer expresses genuine delight and strong brand advocacy, eager to establish recurring loyalty.';
    }
    if (text.includes('fast') || text.includes('quick') || text.includes('efficient')) {
      return 'Customer is highly impressed by operational speed and attentive front-line execution.';
    }
    return 'Customer shares enthusiastic appreciation for culinary quality and exceptional guest hospitality.';
  }

  if (review.urgency === 'high') {
    if (text.includes('allergy') || text.includes('hospital') || text.includes('emergency') || text.includes('epipen') || text.includes('hazard')) {
      return 'Customer is alarmed by a critical health safety hazard, demanding urgent managerial accountability.';
    }
    if (text.includes('charge') || text.includes('fraud') || text.includes('bank') || text.includes('billed')) {
      return 'Customer is anxious and frustrated over financial billing errors, seeking immediate payment reconciliation.';
    }
    if (text.includes('anniversary') || text.includes('birthday') || text.includes('reservation')) {
      return 'Customer feels deeply let down during a high-stakes milestone celebration due to reservation failure.';
    }
    return 'Customer is severely distressed by an operational breakdown, requiring urgent de-escalation.';
  }

  if (review.sentiment === 'negative') {
    if (review.category === 'staff') {
      return 'Customer feels disrespected by indifferent staff interaction, emphasizing the importance of hospitable first impressions.';
    }
    if (review.category === 'quality') {
      return 'Customer is disappointed by unexpected culinary inconsistency relative to expected quality standards.';
    }
    if (review.category === 'pricing') {
      return 'Customer perceives poor portion-to-price value and seeks reassurance regarding pricing standards.';
    }
    if (review.category === 'cleanliness') {
      return 'Customer expects prompt sanitation maintenance and higher attention to facility hygiene.';
    }
    return 'Customer feels dissatisfied with the overall dining experience and desires direct acknowledgment.';
  }

  // Neutral
  return 'Customer shares balanced constructive feedback, recognizing core strengths while noting specific pacing and portion friction.';
}

export const AiInsightBadge: React.FC<AiInsightBadgeProps> = ({
  review,
  variant = 'badge',
  className = '',
}) => {
  const insight = getReviewAiInsight(review);

  // Intent icon and color styling based on sentiment and urgency
  const isHighUrgency = review.urgency === 'high';
  const isPositive = review.sentiment === 'positive';
  const isNegative = review.sentiment === 'negative';

  const accentColor = isHighUrgency
    ? 'text-rose-400 border-rose-500/30 bg-rose-950/40'
    : isPositive
    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    : isNegative
    ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
    : 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';

  const iconBg = isHighUrgency
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : isPositive
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : isNegative
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

  if (variant === 'compact') {
    return (
      <div 
        id={`ai-insight-badge-${review.id}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${accentColor} ${className}`}
        title={`AI Insight: ${insight}`}
      >
        <Sparkles className="w-3 h-3 shrink-0" />
        <span className="truncate max-w-[280px] font-sans font-normal text-zinc-200">
          {insight}
        </span>
      </div>
    );
  }

  // Standard badge / banner in ReviewDetail
  return (
    <div
      id={`ai-insight-badge-${review.id}`}
      className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs shadow-sm transition-all animate-in fade-in duration-200 ${
        isHighUrgency
          ? 'bg-gradient-to-r from-rose-950/30 via-zinc-900/60 to-zinc-900/40 border-rose-500/30'
          : isPositive
          ? 'bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-900/40 border-emerald-500/30'
          : isNegative
          ? 'bg-gradient-to-r from-amber-950/25 via-zinc-900/60 to-zinc-900/40 border-amber-500/30'
          : 'bg-gradient-to-r from-cyan-950/30 via-zinc-900/60 to-indigo-950/25 border-cyan-500/30'
      } ${className}`}
      role="region"
      aria-label="AI Customer Intent Insight"
    >
      <div 
        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}
      >
        <Sparkles className="w-3 h-3" />
      </div>

      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isHighUrgency ? 'text-rose-300' : isPositive ? 'text-emerald-300' : isNegative ? 'text-amber-300' : 'text-cyan-300'
            }`}
          >
            AI Insight
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
            Emotional Nuance & Intent
          </span>
        </div>
        <p className="text-xs text-zinc-200 leading-snug font-normal">
          {insight}
        </p>
      </div>
    </div>
  );
};
