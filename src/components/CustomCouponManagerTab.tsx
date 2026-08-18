import React, { useState } from 'react';
import { CustomCoupon } from '../types';
import { Ticket, Plus, Save, Trash2, Edit3, CheckCircle2, Sparkles, Globe } from 'lucide-react';

interface CustomCouponManagerTabProps {
  coupons: CustomCoupon[];
  onSaveCoupons: (updated: CustomCoupon[]) => void;
}

export const CustomCouponManagerTab: React.FC<CustomCouponManagerTabProps> = ({ coupons, onSaveCoupons }) => {
  const [localCoupons, setLocalCoupons] = useState<CustomCoupon[]>(coupons);
  const [editingCoupon, setEditingCoupon] = useState<Partial<CustomCoupon> | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Handle Save / Add Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.brandName || !editingCoupon?.code || !editingCoupon?.targetUrl) {
      alert('Please fill in Brand Name, Promo Code, and Target Registration URL.');
      return;
    }

    let updated: CustomCoupon[];
    if (editingCoupon.id) {
      // Edit existing
      updated = localCoupons.map(c => (c.id === editingCoupon.id ? ({ ...c, ...editingCoupon } as CustomCoupon) : c));
    } else {
      // Create new
      const newCoupon: CustomCoupon = {
        id: `coupon_${Date.now()}`,
        brandName: editingCoupon.brandName || 'Partner Brand',
        title: editingCoupon.title || `${editingCoupon.brandName} Special Promo`,
        code: editingCoupon.code || 'SPECIAL500',
        description: editingCoupon.description || 'Get exclusive welcome bonus on sign-up.',
        targetUrl: editingCoupon.targetUrl || 'https://example.com/signup',
        category: editingCoupon.category || 'Special Offer',
        badgeText: editingCoupon.badgeText || 'HOT PROMO',
        isActive: editingCoupon.isActive !== undefined ? editingCoupon.isActive : true,
        metaTitle: editingCoupon.metaTitle || `${editingCoupon.brandName} Promo Code ${editingCoupon.code} 2026`,
        metaDescription: editingCoupon.metaDescription || `Official promo code for ${editingCoupon.brandName}.`,
        clicksCount: 0,
        copiesCount: 0
      };
      updated = [newCoupon, ...localCoupons];
    }

    setLocalCoupons(updated);
    onSaveCoupons(updated);
    setEditingCoupon(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const updated = localCoupons.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setLocalCoupons(updated);
    onSaveCoupons(updated);
  };

  // Delete coupon
  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this custom coupon code?')) return;
    const updated = localCoupons.filter(c => c.id !== id);
    setLocalCoupons(updated);
    onSaveCoupons(updated);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-[200] bg-emerald-500 text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Custom Coupon details saved and updated live on main website!</span>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Standalone Event & Custom Coupon Management</span>
          </div>
          <h2 className="text-xl font-black text-white">Custom Standalone Coupon Manager</h2>
          <p className="text-xs text-slate-300">
            Add custom promo codes for any brand or special event (IPL, Cricket, Slots). All added coupons automatically display on the main website with SEO indexation.
          </p>
        </div>

        <button
          onClick={() => setEditingCoupon({
            brandName: '',
            title: '',
            code: '',
            description: '',
            targetUrl: 'https://',
            category: 'Cricket & Sports',
            badgeText: 'SPECIAL EVENT',
            isActive: true
          })}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Custom Coupon</span>
        </button>
      </div>

      {/* Edit / Add Modal Form */}
      {editingCoupon && (
        <form onSubmit={handleSaveCoupon} className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{editingCoupon.id ? 'Edit Custom Coupon' : 'Create New Standalone Custom Coupon'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingCoupon(null)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name (e.g. Megapari, Melbet, 1xBet)</label>
              <input
                type="text"
                required
                value={editingCoupon.brandName || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, brandName: e.target.value })}
                placeholder="e.g. Megapari"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-bold focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Promotional Code</label>
              <input
                type="text"
                required
                value={editingCoupon.code || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                placeholder="e.g. MEGACRICKET500"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono text-xs font-black focus:border-purple-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Coupon Title Headline</label>
              <input
                type="text"
                required
                value={editingCoupon.title || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, title: e.target.value })}
                placeholder="e.g. IPL 2026 Special 100% Free Bet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-bold focus:border-purple-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Registration Target URL (Affiliate / Landing Page Link)</label>
              <input
                type="url"
                required
                value={editingCoupon.targetUrl || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, targetUrl: e.target.value })}
                placeholder="https://brand.com/register?affiliate_ref=123"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category Tag</label>
              <input
                type="text"
                value={editingCoupon.category || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, category: e.target.value })}
                placeholder="e.g. Cricket & Sports, Casino, Slots"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Badge Text</label>
              <input
                type="text"
                value={editingCoupon.badgeText || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, badgeText: e.target.value })}
                placeholder="e.g. LIMITED TIME, IPL 2026, EXCLUSIVE"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:border-purple-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Coupon Description / Offer Details</label>
              <textarea
                rows={2}
                value={editingCoupon.description || ''}
                onChange={e => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                placeholder="Describe the offer (e.g. Get 100% free bet up to ₹10,000 + 50 free spins)."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs leading-relaxed focus:border-purple-500 outline-none"
              />
            </div>

            {/* SEO Sub-section */}
            <div className="sm:col-span-2 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-extrabold text-purple-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>SEO Meta Tags for this Coupon</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={editingCoupon.metaTitle || ''}
                  onChange={e => setEditingCoupon({ ...editingCoupon, metaTitle: e.target.value })}
                  placeholder="SEO Title (e.g. Megapari Promo Code MEGACRICKET500)"
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-white text-xs"
                />
                <input
                  type="text"
                  value={editingCoupon.metaDescription || ''}
                  onChange={e => setEditingCoupon({ ...editingCoupon, metaDescription: e.target.value })}
                  placeholder="SEO Meta Description"
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingCoupon(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Coupon Details</span>
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 gap-4">
        {localCoupons.map(c => (
          <div
            key={c.id}
            className={`bg-slate-900 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              c.isActive ? 'border-slate-800 hover:border-purple-500/50' : 'border-slate-800/40 opacity-60 bg-slate-950/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">{c.brandName}</span>
                <span className="bg-purple-950 border border-purple-500/40 text-amber-300 font-mono font-black text-xs px-2 py-0.5 rounded">
                  {c.code}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  c.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {c.isActive ? 'ACTIVE ON SITE' : 'DISABLED'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-200">{c.title}</h4>
              <p className="text-[11px] text-slate-400 truncate max-w-xl">{c.description}</p>
              <a href={c.targetUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline font-mono">
                🔗 {c.targetUrl}
              </a>
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <button
                onClick={() => handleToggleActive(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                  c.isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {c.isActive ? 'Disable' : 'Enable'}
              </button>

              <button
                onClick={() => setEditingCoupon(c)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 cursor-pointer"
                title="Edit Coupon"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-rose-400 cursor-pointer"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
