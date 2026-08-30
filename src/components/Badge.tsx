import React from 'react';
import { Platform, Sentiment, IssueCategory, UrgencyLevel } from '../types';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Wrench, 
  DollarSign, 
  Users, 
  ShieldAlert,
  Flame
} from 'lucide-react';

export const PlatformBadge: React.FC<{ platform: Platform; size?: 'sm' | 'md' }> = ({ platform, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  
  switch (platform) {
    case 'google':
      return (
        <span 
          id={`platform-badge-${platform}`}
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#1e293b] text-[#93c5fd] border border-[#3b82f6]/30 ${sizeClasses}`}
        >
          <span className="font-bold text-[#60a5fa]">G</span> Google
        </span>
      );
    case 'yelp':
      return (
        <span 
          id={`platform-badge-${platform}`}
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#2a1215] text-[#fca5a5] border border-[#ef4444]/30 ${sizeClasses}`}
        >
          <Flame className="w-3 h-3 text-[#f87171]" /> Yelp
        </span>
      );
    case 'facebook':
      return (
        <span 
          id={`platform-badge-${platform}`}
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#172554] text-[#bfdbfe] border border-[#2563eb]/30 ${sizeClasses}`}
        >
          <span className="font-bold text-[#3b82f6]">f</span> Facebook
        </span>
      );
    default:
      return null;
  }
};

export const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  switch (sentiment) {
    case 'positive':
      return (
        <span 
          id="sentiment-badge-positive"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Positive
        </span>
      );
    case 'negative':
      return (
        <span 
          id="sentiment-badge-negative"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30"
        >
          <AlertCircle className="w-3 h-3 text-rose-400" />
          Negative
        </span>
      );
    case 'neutral':
    default:
      return (
        <span 
          id="sentiment-badge-neutral"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600/40"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          Neutral
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: IssueCategory }> = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case 'service': return <Wrench className="w-3 h-3" />;
      case 'quality': return <Sparkles className="w-3 h-3" />;
      case 'pricing': return <DollarSign className="w-3 h-3" />;
      case 'staff': return <Users className="w-3 h-3" />;
      case 'cleanliness': return <Sparkles className="w-3 h-3" />;
    }
  };

  const labels: Record<IssueCategory, string> = {
    service: 'Service',
    quality: 'Quality',
    pricing: 'Pricing',
    staff: 'Staff',
    cleanliness: 'Cleanliness',
  };

  return (
    <span 
      id={`category-badge-${category}`}
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60"
    >
      {getIcon()}
      {labels[category]}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel; hasGlow?: boolean }> = ({ urgency, hasGlow = false }) => {
  switch (urgency) {
    case 'high':
      return (
        <span 
          id="urgency-badge-high"
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-200 border border-rose-500/50 ${hasGlow ? 'shadow-[0_0_8px_rgba(244,63,94,0.35)]' : ''}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          High Urgency
        </span>
      );
    case 'medium':
      return (
        <span 
          id="urgency-badge-medium"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Med Urgency
        </span>
      );
    case 'low':
    default:
      return (
        <span 
          id="urgency-badge-low"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/40"
        >
          Low Urgency
        </span>
      );
  }
};

export const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'sm' }) => {
  const starSize = size === 'lg' ? 'w-4 h-4' : size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3';
  return (
    <div id="star-rating-container" className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${starSize} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-800 text-zinc-700'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
