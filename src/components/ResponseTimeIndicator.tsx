import React from 'react';
import { Review } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

export type SlaTier = 'optimal' | 'warning' | 'critical' | 'resolved';

export interface SlaInfo {
  tier: SlaTier;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  label: string;
  shortLabel: string;
  gaugePercentage: number; // 0 to 100
  description: string;
  isOverdue: boolean;
}

/**
 * Calculates response SLA status and gauge percentage from review relative time and status
 */
export function getResponseSlaInfo(review: Review): SlaInfo {
  if (review.status === 'replied') {
    return {
      tier: 'resolved',
      colorHex: '#10b981',
      badgeBg: 'bg-emerald-950/40',
      badgeBorder: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      label: 'Responded',
      shortLabel: 'Resolved',
      gaugePercentage: 100,
      description: 'Review response has been dispatched',
      isOverdue: false,
    };
  }

  const rel = (review.relativeTime || '').toLowerCase();

  // Parse approximate minutes/hours/days elapsed
  let hoursElapsed = 0;
  if (rel.includes('just now') || rel.includes('now')) {
    hoursElapsed = 0.1;
  } else if (rel.includes('m ago') || rel.includes('min')) {
    const mins = parseInt(rel, 10) || 15;
    hoursElapsed = mins / 60;
  } else if (rel.includes('h ago') || rel.includes('hour')) {
    const hours = parseInt(rel, 10) || 1;
    hoursElapsed = hours;
  } else if (rel.includes('d ago') || rel.includes('day')) {
    const days = parseInt(rel, 10) || 1;
    hoursElapsed = days * 24;
  } else {
    hoursElapsed = 2; // default
  }

  // Tier 1: Optimal / Fresh (< 2 hours) -> Green
  if (hoursElapsed < 2) {
    const gaugePct = Math.min(45, Math.max(15, Math.round((hoursElapsed / 2) * 45)));
    return {
      tier: 'optimal',
      colorHex: '#10b981', // Emerald
      badgeBg: 'bg-emerald-950/50',
      badgeBorder: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      label: 'Optimal SLA (< 2h)',
      shortLabel: '< 2h SLA',
      gaugePercentage: gaugePct,
      description: `Pending for ${review.relativeTime}. Within optimal 2-hour SLA response window.`,
      isOverdue: false,
    };
  }

  // Tier 2: Warning / Approaching SLA (2h - 8h) -> Amber / Yellow
  if (hoursElapsed <= 8) {
    const gaugePct = Math.min(85, Math.max(50, Math.round(50 + ((hoursElapsed - 2) / 6) * 35)));
    return {
      tier: 'warning',
      colorHex: '#f59e0b', // Amber
      badgeBg: 'bg-amber-950/50',
      badgeBorder: 'border-amber-500/40',
      textColor: 'text-amber-400',
      label: 'Approaching SLA (2-8h)',
      shortLabel: '2-8h Warning',
      gaugePercentage: gaugePct,
      description: `Pending for ${review.relativeTime}. Approaching maximum SLA response threshold.`,
      isOverdue: false,
    };
  }

  // Tier 3: Critical / Overdue (> 8h or 1d+) -> Red / Rose
  return {
    tier: 'critical',
    colorHex: '#f43f5e', // Rose
    badgeBg: 'bg-rose-950/60',
    badgeBorder: 'border-rose-500/60',
    textColor: 'text-rose-400',
    label: 'Critical SLA Breach (> 8h)',
    shortLabel: 'Overdue SLA',
    gaugePercentage: 100,
    description: `Pending for ${review.relativeTime}. Critical SLA breach. Requires immediate escalation.`,
    isOverdue: true,
  };
}

interface ResponseTimeIndicatorProps {
  review: Review;
  variant?: 'icon-only' | 'compact' | 'badge' | 'detailed';
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Dynamic SVG Gauge Component that rotates needle or fills circular progress arc
 */
export const DynamicSlaGaugeIcon: React.FC<{
  sla: SlaInfo;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ sla, size = 'sm', className = '' }) => {
  const pixelSize = size === 'lg' ? 22 : size === 'md' ? 18 : 15;
  const strokeWidth = size === 'lg' ? 2.5 : 2;
  const radius = (pixelSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Circular arc calculation (0 to 100%)
  const strokeDashoffset = circumference - (sla.gaugePercentage / 100) * circumference;

  if (sla.tier === 'resolved') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center text-emerald-400 shrink-0 ${className}`}
        title={sla.description}
      >
        <CheckCircle2 style={{ width: pixelSize, height: pixelSize }} className="stroke-[2.5]" />
      </div>
    );
  }

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      title={sla.description}
    >
      <svg 
        width={pixelSize} 
        height={pixelSize} 
        viewBox={`0 0 ${pixelSize} ${pixelSize}`} 
        className={`-rotate-90 transform transition-transform duration-500 ${sla.isOverdue ? 'animate-pulse' : ''}`}
      >
        {/* Track background circle */}
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-zinc-800"
        />
        {/* Dynamic colored progress gauge */}
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          stroke={sla.colorHex}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Center dynamic needle/dot indicator */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div 
          className="rounded-full transition-all duration-300"
          style={{
            width: size === 'lg' ? 4.5 : size === 'md' ? 3.5 : 2.5,
            height: size === 'lg' ? 4.5 : size === 'md' ? 3.5 : 2.5,
            backgroundColor: sla.colorHex,
            boxShadow: `0 0 4px ${sla.colorHex}`,
          }}
        />
      </div>
    </div>
  );
};

export const ResponseTimeIndicator: React.FC<ResponseTimeIndicatorProps> = ({
  review,
  variant = 'compact',
  showLabel = false,
  className = '',
  size = 'sm',
}) => {
  const sla = getResponseSlaInfo(review);

  // 1. Icon Only
  if (variant === 'icon-only') {
    return (
      <div 
        id={`sla-indicator-${review.id}`}
        className={`inline-flex items-center justify-center cursor-help ${className}`}
        aria-label={`Response SLA: ${sla.label} (${review.relativeTime})`}
        title={`Response Time: ${review.relativeTime} • ${sla.label}\n${sla.description}`}
      >
        <DynamicSlaGaugeIcon sla={sla} size={size} />
      </div>
    );
  }

  // 2. Compact (Icon + Colored relative time text with tooltip)
  if (variant === 'compact') {
    return (
      <div
        id={`sla-indicator-${review.id}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-mono cursor-help transition-colors ${sla.badgeBg} ${sla.badgeBorder} ${sla.textColor} ${className}`}
        title={`Response Time: ${review.relativeTime} • ${sla.label}\n${sla.description}`}
        aria-label={`Response Time: ${review.relativeTime} - ${sla.label}`}
      >
        <DynamicSlaGaugeIcon sla={sla} size="sm" />
        <span className="font-semibold tracking-tight">{review.relativeTime}</span>
        {sla.isOverdue && (
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
        )}
      </div>
    );
  }

  // 3. Badge (Icon + Explicit SLA Status Tag)
  if (variant === 'badge') {
    return (
      <div
        id={`sla-indicator-${review.id}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono shadow-sm transition-all ${sla.badgeBg} ${sla.badgeBorder} ${sla.textColor} ${className}`}
        title={sla.description}
      >
        <DynamicSlaGaugeIcon sla={sla} size={size} />
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{review.relativeTime}</span>
          <span className="opacity-60 text-[10px]">•</span>
          <span className="text-[11px] font-medium">{sla.shortLabel}</span>
        </div>
      </div>
    );
  }

  // 4. Detailed (Comprehensive Panel with SLA Gauge & Progress)
  return (
    <div
      id={`sla-indicator-${review.id}`}
      className={`p-3 rounded-xl border ${sla.badgeBg} ${sla.badgeBorder} space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DynamicSlaGaugeIcon sla={sla} size="md" />
          <div className="text-xs">
            <div className={`font-semibold ${sla.textColor}`}>
              {sla.label}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Pending: {review.relativeTime}
            </div>
          </div>
        </div>
        <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${sla.badgeBg} ${sla.badgeBorder} ${sla.textColor}`}>
          {sla.isOverdue ? 'CRITICAL' : sla.tier === 'warning' ? 'WARN' : sla.tier === 'optimal' ? 'OPTIMAL' : 'DONE'}
        </div>
      </div>
      
      {/* SLA Timeline Track */}
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${sla.gaugePercentage}%`, 
              backgroundColor: sla.colorHex 
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>0h (Target)</span>
          <span>2h (SLA)</span>
          <span>8h+ (Breach)</span>
        </div>
      </div>
    </div>
  );
};
