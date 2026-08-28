import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, ShieldCheck, Copy, ExternalLink, Sparkles, QrCode, Wallet } from "lucide-react";
import { AdContainer } from "./AdContainer";
import { useLanguage } from "../i18n/LanguageContext";
import { formatLocalizedBonus } from "../utils/currency";
import { injectCategoryMetaTags } from "../utils/seo";
const OfferGrid = ({
  platforms,
  geo,
  onClaimClick,
  onCopyCode,
  onSubPartnerClick,
  onOpenQrModal,
  onOpenFeedbackModal
}) => {
  const { language, t } = useLanguage();
  const topPlatformsIds = new Set(
    platforms.filter((p) => p.isActive !== false && p.isFeatured).sort((a, b) => (a.featuredRank || 99) - (b.featuredRank || 99)).slice(0, 3).map((p) => p.id)
  );
  const activePlatforms = platforms.filter(
    (p) => p.isActive !== false && !topPlatformsIds.has(p.id)
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  useEffect(() => {
    const countryName = geo?.country || (geo?.countryCode === "IN" ? "India" : geo?.countryCode === "BR" ? "Brazil" : "Global");
    injectCategoryMetaTags(selectedCategory, countryName);
  }, [selectedCategory, geo]);
  const isFinancePlatform = (p) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return cat.includes("loan") || cat.includes("card") || cat.includes("bank") || cat.includes("demat") || cat.includes("invest") || cat.includes("hosting") || cat.includes("finance") || name.includes("hostinger") || name.includes("bharatpe") || name.includes("gromo") || name.includes("loan");
  };
  const isCryptoPlatform = (p) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return cat.includes("crypto") || cat.includes("exchange") || cat.includes("wallet") || name.includes("bybit") || name.includes("binance") || name.includes("stake");
  };
  const isGamingPlatform = (p) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    if (isFinancePlatform(p)) return false;
    if (cat.includes("crypto exchange") || cat.includes("crypto wallet") || name.includes("bybit") || name.includes("binance") || name.includes("hostinger")) {
      return false;
    }
    return true;
  };
  const filteredByCategory = activePlatforms.filter((p) => {
    if (selectedCategory === "gaming") return isGamingPlatform(p);
    if (selectedCategory === "finance") return isFinancePlatform(p);
    if (selectedCategory === "crypto") return isCryptoPlatform(p);
    return true;
  });
  const sortedPlatforms = [...filteredByCategory].sort((a, b) => {
    if (geo?.countryCode === "IN") {
      const aIsLocal = a.name.toLowerCase().includes("1win") || a.name.toLowerCase().includes("parimatch") || a.name.toLowerCase().includes("melbet");
      const bIsLocal = b.name.toLowerCase().includes("1win") || b.name.toLowerCase().includes("parimatch") || b.name.toLowerCase().includes("melbet");
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
    }
    return 0;
  });
  const [copiedId, setCopiedId] = useState(null);
  const handleCopy = async (p, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.promoCode);
    setCopiedId(p.id);
    onCopyCode(p);
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedId(null), 2500);
  };
  return /* @__PURE__ */ jsxs("section", { id: "offers-list", className: "py-12 px-4 max-w-7xl mx-auto scroll-mt-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4 border-b border-slate-800 pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase mb-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-cyan-400" }),
          /* @__PURE__ */ jsx("span", { children: t("grid.title") })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold text-white", children: t("grid.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-slate-400 text-xs font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Showing ",
          sortedPlatforms.length,
          " Active Verified Partners"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory("all"),
          className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${selectedCategory === "all" ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"}`,
          children: [
            "\u{1F525} All Verified Offers (",
            activePlatforms.length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory("gaming"),
          className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${selectedCategory === "gaming" ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" : "bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800"}`,
          children: [
            "\u{1F3B0} Gaming Brands (",
            activePlatforms.filter(isGamingPlatform).length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory("finance"),
          className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${selectedCategory === "finance" ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20" : "bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800"}`,
          children: [
            "\u{1F4B3} Finance Hub (",
            activePlatforms.filter(isFinancePlatform).length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory("crypto"),
          className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${selectedCategory === "crypto" ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20" : "bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800"}`,
          children: [
            "\u26A1 Crypto (",
            activePlatforms.filter(isCryptoPlatform).length,
            ")"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch", children: sortedPlatforms.map((p, index) => {
      const rankLabel = `#${index + 1} VERIFIED PARTNER`;
      const badgeBg = "from-slate-700 via-slate-800 to-slate-900";
      const cardGlow = "border-slate-700/50 shadow-xl shadow-slate-900/20";
      return /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `relative bg-slate-900/90 rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${cardGlow}`,
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-wider text-slate-300 bg-gradient-to-r shadow-md flex items-center gap-1.5 uppercase ${badgeBg}`,
                  children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }),
                    /* @__PURE__ */ jsx("span", { children: rankLabel })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2 mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: p.logoUrl || void 0,
                        alt: p.name,
                        width: "56",
                        height: "56",
                        loading: index < 2 ? "eager" : "lazy",
                        className: "w-14 h-14 rounded-xl border-2 border-slate-700/80 shadow-md bg-slate-800 object-cover",
                        onError: (e) => {
                          console.error("Image failed to load:", p.logoUrl);
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-lg text-white leading-tight flex items-center gap-1.5", children: p.name }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-bold", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${i < Math.floor(p.averageUserRating || p.starRating) ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"}` }, i)) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
                          "(",
                          (p.totalReviewsCount || 10500).toLocaleString(),
                          ")"
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 block font-medium uppercase tracking-wider", children: t("card.globalRating") }),
                    /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-emerald-400", children: [
                      p.averageUserRating?.toFixed(1) || p.starRating,
                      ".0",
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-emerald-600", children: "/5" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-950/80 to-slate-950 border border-purple-500/40 rounded-xl p-3.5 my-4 text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-purple-300 uppercase tracking-widest block", children: t("card.exclusiveOffer") }) }),
                  /* @__PURE__ */ jsx("div", { className: "text-base sm:text-lg font-black text-amber-300 leading-tight", children: formatLocalizedBonus(p.bonusText, language) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-emerald-400 font-bold", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: t("badge.verified") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-indigo-400 font-bold", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: t("badge.fastWithdraw") })
                  ] }),
                  p.badges.map((b, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-300 font-medium", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400/50 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: b })
                  ] }, idx))
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wider", children: [
                    /* @__PURE__ */ jsx(Wallet, { className: "w-3 h-3" }),
                    " ",
                    t("payment.local")
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-[10px] font-bold text-slate-300", children: [
                    language === "pt" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]", children: "Pix" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700", children: "PicPay" })
                    ] }),
                    language === "hi" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]", children: "UPI" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400", children: "Paytm" })
                    ] }),
                    language === "ru" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]", children: "Bitcoin" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400", children: "Mir" })
                    ] }),
                    language === "es" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700", children: "Mercado Pago" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400", children: "OXXO" })
                    ] }),
                    ["en", "fr", "de", "it", "pl"].includes(language) && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]", children: "Crypto" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400", children: "Visa / MC" })
                    ] }),
                    ["zh-CN", "ja", "ko", "vi", "th", "id", "ar", "tr"].includes(language) && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]", children: "Tether (USDT)" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]", children: "Bitcoin" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700", children: "Bank Transfer" })
                    ] }),
                    language === "unmatched_now" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]", children: "Crypto" }),
                      /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400", children: "Visa / MC" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border border-slate-800 rounded-xl p-2.5 mb-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold text-slate-400 block", children: t("card.promoCode") }),
                    /* @__PURE__ */ jsx("span", { className: "font-mono font-black text-amber-400 text-sm tracking-wider notranslate", translate: "no", children: p.promoCode })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: (e) => handleCopy(p, e),
                      className: "px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: copiedId === p.id ? t("card.copied") : t("card.copy") })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => onClaimClick(p),
                      className: "flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 group cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx("span", { children: t("card.claimBonus") }),
                        /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" })
                      ]
                    }
                  ),
                  onOpenQrModal && /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => onOpenQrModal(p),
                      title: "Scan Mobile QR Code",
                      className: "p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer shrink-0",
                      children: /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4" })
                    }
                  ),
                  onOpenFeedbackModal && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => onOpenFeedbackModal(p),
                      title: "Community Reviews & Feedback",
                      className: "px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-amber-400" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Reviews" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        (index + 1) % 3 === 0 && index !== sortedPlatforms.length - 1 && /* @__PURE__ */ jsx("div", { className: "col-span-1 md:col-span-3 py-2 w-full", children: /* @__PURE__ */ jsx(AdContainer, { slotId: "offer_grid_inline_" + index }) })
      ] }, p.id);
    }) })
  ] });
};
export {
  OfferGrid
};
