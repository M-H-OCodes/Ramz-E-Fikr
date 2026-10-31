import React from 'react';
import { Download } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSupabase: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabase }) => {
  return (
    <footer className="bg-[#EFE8DA] border-t border-[#D8CCBB] text-[#171717] mt-24">
      {/* Decorative hairline accent in Antique Gold */}
      <div className="h-1 bg-gradient-to-r from-[#681F2B] via-[#B79558] to-[#48151E]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center font-urdu text-lg font-bold">
                ف
              </div>
              <div>
                <div className="font-urdu text-xl text-[#681F2B] font-semibold leading-none">
                  رمزِ فکر
                </div>
                <div className="font-editorial text-xs tracking-[0.2em] uppercase text-[#171717] font-bold">
                  RAMZ-E-FIKR
                </div>
              </div>
            </div>

            <p className="font-editorial italic text-base text-[#681F2B] max-w-md">
              "Where thought becomes argument."
            </p>

            <p className="text-sm text-[#625D57] max-w-md leading-relaxed">
              Ramz-e-Fikr is an open-access digital publication and knowledge archive for debaters,
              thinkers, coaches, adjudicators, and scholars. We preserve, categorize, and advance
              argumentation theory and competitive discourse across international circuits.
            </p>
          </div>

          {/* Archive Navigation */}
          <div className="space-y-3">
            <h4 className="font-editorial text-xs uppercase tracking-widest text-[#681F2B] font-bold">
              The Archive
            </h4>
            <ul className="space-y-2 text-sm text-[#625D57]">
              <li>
                <button
                  onClick={() => onNavigate('/articles')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Articles & Scholarship
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/resources')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Resource Library & PDFs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/motions')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Motion Database & Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/glossary')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Debate Glossary (A–Z)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/search')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Full Archive Search
                </button>
              </li>
            </ul>
          </div>

          {/* Publication & Contributing */}
          <div className="space-y-3">
            <h4 className="font-editorial text-xs uppercase tracking-widest text-[#681F2B] font-bold">
              Publication & Admin
            </h4>
            <ul className="space-y-2 text-sm text-[#625D57]">
              <li>
                <button
                  onClick={() => onNavigate('/submit')}
                  className="hover:text-[#681F2B] font-medium transition-colors"
                >
                  Submit an Essay / Article
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  About Ramz-e-Fikr & Editorial Board
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-[#681F2B] transition-colors flex items-center gap-1.5"
                >
                  <span>Editorial CMS & Review Queue</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupabase}
                  className="hover:text-[#681F2B] transition-colors"
                >
                  Supabase Database Sync
                </button>
              </li>
              <li>
                <a
                  href="/assets/ramz-e-fikr-github-ready.zip"
                  download="ramz-e-fikr-github-ready.zip"
                  className="hover:text-[#681F2B] transition-colors flex items-center gap-1.5 font-medium text-[#681F2B]"
                  title="Download complete GitHub-ready repository zip archive"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Codebase (.ZIP)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline Divider & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#D8CCBB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#625D57] gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 Ramz-e-Fikr. Open-access intellectual commons under CC BY-NC 4.0.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-urdu text-sm text-[#681F2B]">فکر و مباحثہ</span>
            <span>·</span>
            <span>British Parliamentary & World Schools Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
