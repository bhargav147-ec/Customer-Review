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
  Flame,
  Smartphone,
  Play,
  ShieldCheck,
  Globe,
  Share2,
  Compass
} from 'lucide-react';

export const PlatformBadge: React.FC<{ 
  platform: Platform; 
  size?: 'sm' | 'md';
  showIconOnly?: boolean;
}> = ({ platform, size = 'sm', showIconOnly = false }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconOnlyClasses = size === 'sm' ? 'p-1 text-[11px]' : 'p-1.5 text-xs';
  const iconSize = size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3';
  
  switch (platform) {
    case 'appstore':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Apple App Store"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#0c2238] text-sky-200 border border-sky-500/35 hover:border-sky-400/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Smartphone className={`${iconSize} text-sky-400 shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">App Store</span>}
        </span>
      );
    case 'googleplay':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Google Play Store"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#062c24] text-emerald-200 border border-emerald-500/35 hover:border-emerald-400/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Play className={`${iconSize} text-emerald-400 fill-emerald-400/30 shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Google Play</span>}
        </span>
      );
    case 'trustpilot':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Trustpilot Verified Reviews"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#03261a] text-[#42e89f] border border-[#00b67a]/45 hover:border-[#00b67a]/70 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <ShieldCheck className={`${iconSize} text-[#00b67a] shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Trustpilot</span>}
        </span>
      );
    case 'google':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Google Business Profile"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#13233c] text-[#93c5fd] border border-[#3b82f6]/35 hover:border-[#3b82f6]/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Globe className={`${iconSize} text-[#60a5fa] shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Google</span>}
        </span>
      );
    case 'yelp':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Yelp Local"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#2c1317] text-[#fca5a5] border border-[#ef4444]/35 hover:border-[#ef4444]/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Flame className={`${iconSize} text-[#f87171] fill-[#f87171]/20 shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Yelp</span>}
        </span>
      );
    case 'facebook':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Facebook Recommendations"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#131f3c] text-[#bfdbfe] border border-[#2563eb]/35 hover:border-[#2563eb]/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Share2 className={`${iconSize} text-[#60a5fa] shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Facebook</span>}
        </span>
      );
    case 'tripadvisor':
      return (
        <span 
          id={`platform-badge-${platform}`}
          title="Source: Tripadvisor"
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#062c26] text-[#a7f3d0] border border-[#10b981]/35 hover:border-[#10b981]/60 shadow-xs transition-colors shrink-0 ${showIconOnly ? iconOnlyClasses : sizeClasses}`}
        >
          <Compass className={`${iconSize} text-[#34d399] shrink-0`} />
          {!showIconOnly && <span className="font-semibold tracking-tight">Tripadvisor</span>}
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

export const CategoryBadge: React.FC<{ category: IssueCategory; isAutoCategorized?: boolean }> = ({ category, isAutoCategorized }) => {
  const getIcon = () => {
    switch (category) {
      case 'service': return <Wrench className="w-3 h-3" />;
      case 'quality': return <Sparkles className="w-3 h-3" />;
      case 'pricing': return <DollarSign className="w-3 h-3" />;
      case 'staff': return <Users className="w-3 h-3" />;
      case 'cleanliness': return <Sparkles className="w-3 h-3" />;
      case 'uncategorized': return <HelpCircle className="w-3 h-3 text-amber-400" />;
      default: return <HelpCircle className="w-3 h-3" />;
    }
  };

  const labels: Record<IssueCategory, string> = {
    service: 'Service',
    quality: 'Quality',
    pricing: 'Pricing',
    staff: 'Staff',
    cleanliness: 'Cleanliness',
    uncategorized: 'Uncategorized',
  };

  if (category === 'uncategorized') {
    return (
      <span 
        id={`category-badge-${category}`}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-xs"
        title="Uncategorized review - ready for AI Auto-Categorize"
      >
        {getIcon()}
        <span>Uncategorized</span>
      </span>
    );
  }

  return (
    <span 
      id={`category-badge-${category}`}
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-all ${
        isAutoCategorized
          ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-500/50 shadow-xs'
          : 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60'
      }`}
      title={isAutoCategorized ? 'Auto-categorized by Gemini AI' : undefined}
    >
      {getIcon()}
      {labels[category] || category}
      {isAutoCategorized && (
        <Sparkles className="w-2.5 h-2.5 text-cyan-400 ml-0.5 shrink-0" />
      )}
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
