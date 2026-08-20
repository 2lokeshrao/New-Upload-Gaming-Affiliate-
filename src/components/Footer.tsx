import DOMPurify from 'dompurify';
import React from 'react';
import { ShieldCheck, Users, Smartphone } from 'lucide-react';
import { GamingPlatform, GlobalConfig, CustomPage } from '../types';
import { SocialMediaBar } from './SocialMediaBar';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  platforms: GamingPlatform[];
  customPages: CustomPage[];
  geo: any;
  config: GlobalConfig;
  setShowSubPartnerModal: (val: boolean) => void;
  setShowReferModal: (val: boolean) => void;
  setShowPwaModal?: (val: boolean) => void;
  setShowAdminLogin: (val: boolean) => void;
  adminToken: string | null;
  setViewingAdmin: (val: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  platforms,
  customPages,
  geo,
  config,
  setShowSubPartnerModal,
  setShowReferModal,
  setShowPwaModal,
  setShowAdminLogin,
  adminToken,
  setViewingAdmin
}) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 border-t border-slate-800/80 py-10 px-4 text-center text-slate-400 text-xs">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Dynamic Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto py-6 border-b border-slate-800/80 mb-6">
            {(config.footerColumns || []).map(col => (
              <div key={col.id}>
                <h4 className="text-white font-bold mb-3 uppercase text-[10px] tracking-wider">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url}
                         onClick={(e) => { 
                           if (link.url.startsWith('/')) {
                             e.preventDefault(); 
                             window.history.pushState({}, '', link.url); 
                             window.dispatchEvent(new PopStateEvent('popstate')); 
                           }
                         }}
                         className="text-slate-400 hover:text-emerald-400 transition-colors"
                         target={link.url.startsWith('http') ? '_blank' : '_self'}
                         rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(config.copyrightText || `BonusPromoCode.in Affiliate Portal &copy; ${new Date().getFullYear()}` || '', {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
              })
            }} />
</div>
          </div>


          {/* Social Media Footer Icons */}
          <div className="flex justify-center py-2">
            <SocialMediaBar config={config} variant="footer" />
          </div>

                    <p className="max-w-3xl mx-auto leading-relaxed text-slate-400 text-[11px]">
            {config.footerDisclaimerText || 'This site is an independent gaming review and affiliate portal. We provide promotional bonus codes and reviews for licensed online gaming and sports platforms. Please gamble responsibly. 18+ Only.'} <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/privacy-policy'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="underline hover:text-amber-400 ml-2">{t('footer.privacy')}</a> | <a href="/terms" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terms'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="underline hover:text-amber-400 ml-2">{t('footer.terms')}</a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] pt-2">
            <button
              onClick={() => setShowSubPartnerModal(true)}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-cyan-500/30 whitespace-nowrap"
            >
              <Users className="w-3 h-3" /> {t('footer.subPartner')}
            </button>

            <button
              onClick={() => setShowReferModal(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-emerald-500/30 whitespace-nowrap"
            >
              {t('footer.refer')}
            </button>
            {setShowPwaModal && (
              <button
                onClick={() => setShowPwaModal(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-amber-500/30 whitespace-nowrap"
              >
                <Smartphone className="w-3 h-3" /> {t('nav.getApp')}
              </button>
            )}

            {/* Stealth Admin Access - Completely invisible but clickable for mobile admins */}
            <button
              onClick={() => {
                if (adminToken) {
                  setViewingAdmin(true);
                } else {
                  setShowAdminLogin(true);
                }
              }}
              className="w-10 h-10 opacity-0 bg-transparent cursor-default"
              aria-hidden="true"
            />
          </div>
      </footer>
  );
};
