export function formatLocalizedBonus(text: string | undefined, language: string): string {
  if (!text) return '';
  
  let newText = text;
  
  const rules: Record<string, { symbol: string; rate: number; suffix: string }> = {
    en: { symbol: '$', rate: 1, suffix: '' },
    hi: { symbol: '₹', rate: 85, suffix: '' },
    pt: { symbol: 'R$ ', rate: 5, suffix: '' },
    es: { symbol: '€', rate: 0.9, suffix: '' },
    ru: { symbol: '', rate: 90, suffix: ' ₽' },
    'zh-CN': { symbol: '¥', rate: 7.2, suffix: '' },
    ja: { symbol: '¥', rate: 150, suffix: '' },
    ko: { symbol: '₩', rate: 1350, suffix: '' },
    tr: { symbol: '₺', rate: 32, suffix: '' },
    ar: { symbol: '', rate: 3.67, suffix: ' AED' },
    fr: { symbol: '€', rate: 0.9, suffix: '' },
    de: { symbol: '€', rate: 0.9, suffix: '' },
    it: { symbol: '€', rate: 0.9, suffix: '' },
    vi: { symbol: '₫', rate: 25000, suffix: '' },
    th: { symbol: '฿', rate: 36, suffix: '' },
    id: { symbol: 'Rp ', rate: 16000, suffix: '' },
    pl: { symbol: '', rate: 4, suffix: ' zł' },
  };

  const currentRule = rules[language] || rules['en'];
  
  // Normalize all known currencies to a base USD amount to calculate from.
  // We'll replace instances of known currencies with a marker, then apply the conversion.
  
  // Replace ₹ (approx 85 = $1)
  newText = newText.replace(/₹\s*([0-9,]+)/g, (match, p1) => {
    const amount = parseInt(p1.replace(/,/g, ''), 10);
    const usd = amount / 85;
    const converted = Math.round(usd * currentRule.rate);
    return `${currentRule.symbol}${converted.toLocaleString()}${currentRule.suffix}`;
  });

  // Replace € (approx 0.9 = $1)
  newText = newText.replace(/€\s*([0-9,]+)/g, (match, p1) => {
    const amount = parseInt(p1.replace(/,/g, ''), 10);
    const usd = amount / 0.9;
    const converted = Math.round(usd * currentRule.rate);
    return `${currentRule.symbol}${converted.toLocaleString()}${currentRule.suffix}`;
  });

  // Replace $ (1 = $1)
  newText = newText.replace(/\$\s*([0-9,]+)/g, (match, p1) => {
    const amount = parseInt(p1.replace(/,/g, ''), 10);
    const usd = amount;
    const converted = Math.round(usd * currentRule.rate);
    return `${currentRule.symbol}${converted.toLocaleString()}${currentRule.suffix}`;
  });

  // Replace R$ (approx 5 = $1)
  newText = newText.replace(/R\$\s*([0-9,]+)/g, (match, p1) => {
    const amount = parseInt(p1.replace(/,/g, ''), 10);
    const usd = amount / 5;
    const converted = Math.round(usd * currentRule.rate);
    return `${currentRule.symbol}${converted.toLocaleString()}${currentRule.suffix}`;
  });

  return newText;
}
