import React, { useState } from 'react';
import { PlatformFeedback } from '../types';
import { MessageSquare, Check, Trash2, Star, Clock, CheckCircle2, Plus, Sparkles } from 'lucide-react';

interface FeedbackApprovalTabProps {
  feedbacks: PlatformFeedback[];
  onUpdateFeedbacks: (updated: PlatformFeedback[]) => void;
}

export const FeedbackApprovalTab: React.FC<FeedbackApprovalTabProps> = ({
  feedbacks,
  onUpdateFeedbacks
}) => {
  const [localFeedbacks, setLocalFeedbacks] = useState<PlatformFeedback[]>(feedbacks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrand, setNewBrand] = useState('1win');
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const pendingList = localFeedbacks.filter(f => !f.isApproved);
  const approvedList = localFeedbacks.filter(f => f.isApproved);

  const handleApprove = (id: string) => {
    const updated = localFeedbacks.map(f => (f.id === id ? { ...f, isApproved: true } : f));
    setLocalFeedbacks(updated);
    onUpdateFeedbacks(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this user feedback?')) return;
    const updated = localFeedbacks.filter(f => f.id !== id);
    setLocalFeedbacks(updated);
    onUpdateFeedbacks(updated);
  };

  const handleAddManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: PlatformFeedback = {
      id: `fb_admin_${Date.now()}`,
      platformId: newBrand,
      platformName: newBrand.toUpperCase(),
      userName: newName.trim(),
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
      isApproved: true
    };

    const updated = [newRev, ...localFeedbacks];
    setLocalFeedbacks(updated);
    onUpdateFeedbacks(updated);

    setNewName('');
    setNewComment('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Community Moderation Queue</span>
          </div>
          <h2 className="text-xl font-black text-white">Platform Feedback & Review Approvals</h2>
          <p className="text-xs text-slate-300">
            Review user-submitted star ratings and comments before publishing them to the public website.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Manual Review Modal */}
      {showAddModal && (
        <form onSubmit={handleAddManualReview} className="bg-slate-900 border border-purple-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Add Admin-Verified Testimonial Review</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Platform ID</label>
              <select
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-bold"
              >
                <option value="1win">1Win</option>
                <option value="mostbet">Mostbet</option>
                <option value="stake">Stake.com</option>
                <option value="bcgame">BC.Game</option>
                <option value="pinup">Pin-Up Casino</option>
                <option value="parimatch">Parimatch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Player Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. David B."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Rating (1-5)</label>
              <select
                value={newRating}
                onChange={e => setNewRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-bold"
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1">Review Text</label>
              <textarea
                rows={2}
                required
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write review..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black uppercase"
            >
              Publish Review
            </button>
          </div>
        </form>
      )}

      {/* Pending Approval Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Approval Queue ({pendingList.length})</span>
        </h3>

        {pendingList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400">
            ✓ Approval queue is clear! All user feedback has been moderated.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingList.map(rev => (
              <div key={rev.id} className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{rev.userName}</span>
                    <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                      FOR: {rev.platformName || rev.platformId}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-200">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-900 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Reviews Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Live Approved Reviews ({approvedList.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {approvedList.map(rev => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs">{rev.userName}</span>
                  <span className="bg-purple-950 border border-purple-500/30 text-purple-300 font-bold text-[9px] px-1.5 py-0.5 rounded">
                    {rev.platformName || rev.platformId}
                  </span>
                </div>

                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
