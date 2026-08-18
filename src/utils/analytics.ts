export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  } else {
    // Fallback or dev logging
    console.log(`[GA4 Event] ${eventName}`, eventParams);
  }
};
