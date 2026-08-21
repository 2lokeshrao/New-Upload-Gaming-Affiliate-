import re

with open('src/components/TopThreeCarousel.tsx', 'r') as f:
    content = f.read()

old_button = """{onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(p)}
                      title="Community Reviews & Feedback"
                      className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}"""

new_button = """{onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(p)}
                      title="Community Reviews & Feedback"
                      className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-bold">Reviews</span>
                    </button>
                  )}"""

if "Star className" not in content:
    content = content.replace("import { CheckCircle2, Copy, ExternalLink, QrCode, MessageSquare } from 'lucide-react';", "import { CheckCircle2, Copy, ExternalLink, QrCode, MessageSquare, Star } from 'lucide-react';")
    content = content.replace(old_button, new_button)

with open('src/components/TopThreeCarousel.tsx', 'w') as f:
    f.write(content)
