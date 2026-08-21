import re

with open('src/components/OfferGrid.tsx', 'r') as f:
    content = f.read()

old_button = """{onOpenFeedbackModal && (
                  <button
                    onClick={() => onOpenFeedbackModal(p)}
                    title="Community Reviews & Feedback"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}"""

new_button = """{onOpenFeedbackModal && (
                  <button
                    onClick={() => onOpenFeedbackModal(p)}
                    title="Community Reviews & Feedback"
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-bold">Reviews</span>
                  </button>
                )}"""

if "Star className" not in content:
    content = content.replace("import { CheckCircle2, ChevronRight, Copy, ExternalLink, MessageSquare, QrCode } from 'lucide-react';", "import { CheckCircle2, ChevronRight, Copy, ExternalLink, MessageSquare, QrCode, Star } from 'lucide-react';")
    content = content.replace(old_button, new_button)

with open('src/components/OfferGrid.tsx', 'w') as f:
    f.write(content)
