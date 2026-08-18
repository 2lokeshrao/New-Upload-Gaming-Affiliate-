# 🚀 High-Converting iGaming Affiliate Portal & Partner Management System

An enterprise-grade, high-converting iGaming Affiliate Platform designed for promoting casino and sports betting brands, affiliate link redirection, promo code tracking, sub-partner onboarding, and real-time commission analytics.

---

## 📌 Feature Summary & Core Capabilities

- **High-Converting Landing Experience**:
  - Top announcement banner with urgency timer & direct claim triggers.
  - Interactive **Top 3 Platforms Carousel** and high-contrast **Gaming Offers Grid**.
  - Custom filtering by category (All, Sportsbook, Casino, Poker, Crypto, Crash Games).
  - Copy-to-clipboard promo codes with instant feedback toast notifications.
  - Interactive **Lucky Wheel Spin Modal** and **Email Verification Offer Checker**.

- **Dynamic SEO Engine & Health Manager**:
  - Automatically generates and injects dynamic `FAQPage` JSON-LD schema into the document `<head>`.
  - Search engine crawler friendly with platform-specific promo code and payout speed metadata.
  - **NEW:** SEO Health Limits Tab to monitor and bulk fix meta tags exceeding recommended character limits (60 for titles, 160 for descriptions).

- **Admin Control Center**:
  - Protected by a dedicated passcode dialog .
  - Full CRUD operations for Gaming Platforms (add, edit, toggle active status, adjust min deposit, promo codes, and affiliate URLs).
  - Sub-partner application review system (approve/reject sub-affiliates).
  - Custom coupon manager, global site announcement controls, and live analytics dashboard.

- **Partner API Integration & Postback Engine**:
  - Dedicated **Partner API Sync** panel in the Admin Center.
  - Configure unique API keys, partner tracking tokens, and server-to-server (S2S) postback webhook URLs for platforms like **1Win, Mostbet, Pin-Up, 1xBet, Stake**, and more.

- **Responsive Mobile First Design**:
  - Mobile drawer navigation with hamburger toggle.
  - Responsive single-row flex-wrap social media bar.

---

## ⚙️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion animations.
- **Backend**: Express.js server (`server.ts`) with Vite dev middleware and bundled CommonJS (`dist/server.cjs`) via `esbuild`.
- **Data Persistence**: Local JSON state persistence with API route endpoints.

---

## 🔑 Admin Security & Configuration

### How to Access the Admin Center
1. Click the lock icon in the header or footer of the application.
2. Enter the admin passcode in the prompt.

### Configuration via Environment Variables
For security, the application uses environment variables instead of hardcoded secrets. You must set these in your deployment environment (e.g., in AI Studio Secrets or Vercel Environment Variables):
- `ADMIN_PASSCODE`: The password required to log into the Admin panel.
- `JWT_SECRET`: A secure random string used to sign authentication tokens.

**Note on Firebase:** Ensure that your `firebase-applet-config.json` containing real production keys is not committed to public version control. It is safe to use within your secure environment.

---

## 🛡️ Recent Security Enhancements
- **Rate Limiting:** `express-rate-limit` prevents brute force and spam requests.
- **HTTP Security Headers:** X-XSS-Protection, Referrer-Policy, X-Frame-Options, and X-Content-Type-Options properly enforced.
- **JWT Lifespan:** Admin session tokens restricted to a secure 8-hour expiry.
- **S2S Webhook Security:** Sub-partner postback routes now require valid secret keys to authorize metric logging and tracking.

---

## 🛠️ Step-by-Step Deployment Guide

### Option 1: Vercel + Supabase Deployment
If you wish to host your data on Supabase instead of local file persistence:
1. Sign in to [Supabase](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **Anon Key** from `Settings -> API`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment settings.
4. Push your code to a GitHub repository and link it to Vercel.

### Option 2: Cloud Run / AI Studio Deployment (Default)
1. Click **Deploy / Share** in the top menu bar.
2. Select **Deploy to Cloud Run**.

---

## 🧪 Verification & Build Commands

Before pushing or deploying:
```bash
npm run lint
npm run build
npm start
```

*Built with Google AI Studio Build.*
