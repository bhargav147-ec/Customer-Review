import React, { useState } from 'react';
import { Platform } from '../types';
import { analyzeReviewOffline } from '../data/mockReviews';
import { X, Sparkles, AlertTriangle, Send, Zap } from 'lucide-react';

interface SimulateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: ReturnType<typeof analyzeReviewOffline>) => void;
}

export const SimulateReviewModal: React.FC<SimulateReviewModalProps> = ({
  isOpen,
  onClose,
  onAddReview,
}) => {
  const [author, setAuthor] = useState('');
  const [platform, setPlatform] = useState<Platform>('google');
  const [rating, setRating] = useState<number>(1);
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const presets = [
    {
      title: '🚨 Severe Food Allergy / Legal Risk',
      author: 'Jonathan Ward',
      platform: 'google' as Platform,
      rating: 1,
      text: 'WARNING: I told the server I have a lethal dairy allergy. The chef used real butter anyway and I spent 6 hours in the ER. We are notifying the local health inspector and filing a claim!',
    },
    {
      title: '💳 Overcharged Credit Card',
      author: 'Melissa Briggs',
      platform: 'yelp' as Platform,
      rating: 2,
      text: 'My credit card was charged twice for the same dinner receipt. I tried calling customer support three times with no response. Please refund the duplicate transaction immediately.',
    },
    {
      title: '👥 Unfriendly Hostess Pacing',
      author: 'Lucas Garcia',
      platform: 'facebook' as Platform,
      rating: 2,
      text: 'The host acted annoyed when our party of 5 arrived on time. Waited 30 minutes past our reservation time while empty tables sat unbussed.',
    },
    {
      title: '⭐ 5-Star Rave & Staff Compliment',
      author: 'Hannah Kim',
      platform: 'google' as Platform,
      rating: 5,
      text: 'Absolute perfection! The handmade pasta was sublime, drinks were fast, and Marcus went above and beyond to make our family celebration unforgettable.',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setAuthor(p.author);
    setPlatform(p.platform);
    setRating(p.rating);
    setText(p.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newReview = analyzeReviewOffline(
      text.trim(),
      rating,
      author.trim() || 'Guest User',
      platform
    );

    onAddReview(newReview);
    onClose();
    // Reset form
    setAuthor('');
    setText('');
    setRating(1);
  };

  return (
    <div 
      id="simulate-review-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        id="simulate-review-modal"
        className="w-full max-w-lg bg-[#0d131f] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#111827] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Simulate Incoming Review</h3>
              <p className="text-[11px] text-zinc-400">Test real-time AI auto-tagging, risk scoring & reply drafting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Quick Test Scenarios:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2 text-left rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition-all cursor-pointer truncate"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Author Name */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                <option value="google">Google Reviews</option>
                <option value="yelp">Yelp</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Star Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                <option value={1}>★ 1 Star (Critical)</option>
                <option value={2}>★★ 2 Stars (Poor)</option>
                <option value={3}>★★★ 3 Stars (Average)</option>
                <option value={4}>★★★★ 4 Stars (Good)</option>
                <option value={5}>★★★★★ 5 Stars (Excellent)</option>
              </select>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-1">
            <label className="block text-zinc-300 font-medium">Customer Feedback Text</label>
            <textarea
              rows={4}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write customer feedback to test AI auto-classification and response drafting..."
              className="w-full p-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 leading-relaxed font-sans"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold transition-all shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Process & Triage Review
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
