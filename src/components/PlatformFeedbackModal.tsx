import React, { useState } from 'react';
import { GamingPlatform, PlatformFeedback } from '../types';
import { Star, MessageSquare, Send, CheckCircle2, X, Sparkles } from 'lucide-react';

interface PlatformFeedbackModalProps {
  platform: GamingPlatform | null;
  approvedFeedbacks: PlatformFeedback[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: Omit<PlatformFeedback, 'id' | 'createdAt' | 'isApproved'>) => void;
}

export const PlatformFeedbackModal: React.FC<PlatformFeedbackModalProps> = ({
  platform,
  approvedFeedbacks,
  isOpen,
  onClose,
  onSubmitFeedback
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !platform) return null;

  const platformReviews = approvedFeedbacks.filter(f => f.platformId === platform.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert('Please enter your name and a comment.');
      return;
    }

    onSubmitFeedback({
      platformId: platform.id,
      platformName: platform.name,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      rating,
      comment: comment.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setUserName('');
      setUserEmail('');
      setComment('');
      setRating(5);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <img 
            loading="lazy" 
            decoding="async" 
            src={platform.logoUrl}
            alt={platform.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
          />
          <div>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
              VERIFIED COMMUNITY FEEDBACK
            </span>
            <h2 className="text-xl font-black text-white">{platform.name} Reviews & Rating</h2>
          </div>
        </div>

        {/* Existing Approved Reviews List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Community Feedback ({platformReviews.length})</span>
          </h3>

          {platformReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
              No approved reviews yet for {platform.name}. Be the first player to leave feedback below!
            </p>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {platformReviews.map(rev => (
                <div key={rev.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1">
                      {rev.userName}
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                        ✓ Verified Player
                      </span>
                    </span>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Submission Form */}
        <div className="pt-2 border-t border-slate-800">
          {submitted ? (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-center space-y-2 text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-extrabold text-sm">Thank you for your feedback!</h4>
              <p className="text-xs text-emerald-200/80">
                Your review for {platform.name} has been submitted to the Admin Approval Queue and will be published shortly after verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Leave a Star Rating & Review</span>
              </h3>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Rating</label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-600 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-300 ml-2">{hoverRating || rating} / 5 Stars</span>
                </div>
              </div>

              {/* Name & Optional Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Name / Username</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="e.g. Alex M."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-bold focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email (Optional, Private)</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="e.g. alex@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Review / Comment</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your payout experience, bonus activation, or general feedback..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs leading-relaxed focus:border-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Review for Admin Approval</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
