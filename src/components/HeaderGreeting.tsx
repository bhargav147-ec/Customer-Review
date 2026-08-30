import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset, Coffee } from 'lucide-react';

interface HeaderGreetingProps {
  userName?: string;
  className?: string;
  compact?: boolean;
}

interface GreetingData {
  greeting: string;
  subtext: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  Icon: React.ElementType;
  iconColor: string;
  badgeBg: string;
}

export function getGreetingData(date: Date = new Date()): GreetingData {
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return {
      greeting: 'Good morning',
      subtext: 'Ready for today’s triage queue',
      period: 'morning',
      Icon: Sunrise,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
    };
  } else if (hours >= 12 && hours < 17) {
    return {
      greeting: 'Good afternoon',
      subtext: 'Monitoring active customer feedback',
      period: 'afternoon',
      Icon: Sun,
      iconColor: 'text-yellow-400',
      badgeBg: 'bg-yellow-950/40 border-yellow-500/30 text-yellow-300',
    };
  } else if (hours >= 17 && hours < 22) {
    return {
      greeting: 'Good evening',
      subtext: 'Reviewing daily resolution performance',
      period: 'evening',
      Icon: Sunset,
      iconColor: 'text-orange-400',
      badgeBg: 'bg-orange-950/40 border-orange-500/30 text-orange-300',
    };
  } else {
    return {
      greeting: 'Good evening',
      subtext: 'Night shift auto-triage active',
      period: 'night',
      Icon: Moon,
      iconColor: 'text-indigo-300',
      badgeBg: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300',
    };
  }
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({
  userName,
  className = '',
  compact = false,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update local time every 30 seconds to maintain exact clock accuracy
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const { greeting, subtext, Icon, iconColor, badgeBg } = getGreetingData(currentTime);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (compact) {
    return (
      <div 
        id="header-dynamic-greeting-compact"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono backdrop-blur-sm ${badgeBg} ${className}`}
        title={`Local Time: ${formattedTime} • ${subtext}`}
      >
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        <span className="font-semibold text-zinc-100">{greeting}{userName ? `, ${userName}` : ''}</span>
        <span className="opacity-40 text-[10px]">•</span>
        <span className="text-[11px] opacity-80">{formattedTime}</span>
      </div>
    );
  }

  return (
    <div 
      id="header-dynamic-greeting"
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 text-xs text-[var(--text-main)] shadow-sm transition-all ${className}`}
      title={`Local Time: ${formattedTime} • ${subtext}`}
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className="font-medium tracking-tight text-[var(--text-main)]">
          {greeting}{userName ? `, ${userName}` : ''}
        </span>
        <span className="text-[11px] font-mono text-[var(--text-dim)]">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
