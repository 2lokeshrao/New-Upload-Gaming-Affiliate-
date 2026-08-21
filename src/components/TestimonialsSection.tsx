import React from 'react';
import { PlatformFeedback } from '../types';
import { Star, MessageSquareQuote } from 'lucide-react';

interface TestimonialsSectionProps {
  feedbacks: PlatformFeedback[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) return null;

  // Show only approved, high-rating recent feedbacks (max 6)
  const topFeedbacks = feedbacks
    .filter(f => f.isApproved && f.rating >= 4)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (topFeedbacks.length === 0) return null;

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center justify-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-amber-400" />
            Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Reviews</span>
          </h2>
          <p className="text-slate-400 mt-3 font-medium">Real experiences from our community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topFeedbacks.map(fb => (
            <div key={fb.id} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-amber-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-slate-200">{fb.userName}</div>
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">{fb.platformName}</div>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                  <span className="text-sm font-bold text-amber-400">{fb.rating}.0</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm italic leading-relaxed">"{fb.comment}"</p>
              <div className="text-[10px] font-mono text-slate-600 mt-4">
                {new Date(fb.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
