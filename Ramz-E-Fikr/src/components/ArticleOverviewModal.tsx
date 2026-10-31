import React from 'react';
import {
  X,
  BookOpen,
  Clock,
  ArrowRight,
  Shield,
  Award,
  CheckCircle2,
  Share2,
  FileText,
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Article } from '../types';
import { downloadArticleAsWord } from '../utils/documentExport';

interface ArticleOverviewModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const ArticleOverviewModal: React.FC<ArticleOverviewModalProps> = ({
  article,
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen || !article) return null;

  // Approximate word count calculation
  const wordCount = article.body.trim().split(/\s+/).length;

  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleReadFullArticle = () => {
    onClose();
    onNavigate(`/articles/${article.slug}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/articles/${article.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle decorative gold corner wash */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B79558]/15 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#D8CCBB] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#681F2B]">
              <span>{article.category}</span>
              <span>·</span>
              <span>{article.format}</span>
              <span>·</span>
              <span>{article.difficulty} Level</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717] mt-1 leading-snug">
              {article.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#625D57] font-serif italic mt-1">
              "{article.subtitle}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#625D57] hover:text-[#171717] rounded-md transition-colors shrink-0"
            aria-label="Close overview modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Metadata Byline Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-[#EFE8DA] border border-[#D8CCBB] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#171717]">{article.author_name}</span>
              <span className="text-[#625D57]">({article.author_institution})</span>
            </div>
            <div className="flex items-center gap-4 text-[#625D57]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#681F2B]" />
                <strong className="text-[#171717]">{article.reading_time_minutes} min read</strong>
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#D8CCBB]">
                ~{wordCount.toLocaleString()} words
              </span>
            </div>
          </div>

          {/* Executive Overview & Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#681F2B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B79558]" />
              <span>Article Overview & Central Problem</span>
            </h3>
            <div className="p-4 rounded-md bg-white border border-[#D8CCBB] text-[#171717] leading-relaxed space-y-2.5">
              <p className="font-medium text-[#171717]">
                {article.excerpt}
              </p>
              <p className="text-xs text-[#625D57] leading-relaxed">
                This comprehensive treatise guides competitive debaters and adjudicators through the rigorous theoretical foundations, mechanism construction, and ballot-winning execution required in top-tier rooms.
              </p>
            </div>
          </div>

          {/* Key Strategic Takeaways */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#681F2B] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Core Themes & Strategic Takeaways</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded bg-white border border-[#D8CCBB] space-y-1">
                <div className="font-semibold text-xs text-[#171717]">1. Structural Framing</div>
                <div className="text-[11px] text-[#625D57] leading-relaxed">
                  Establish non-negotiable evaluative criteria that force adjudicators to view opposing harms as secondary or contingent.
                </div>
              </div>
              <div className="p-3 rounded bg-white border border-[#D8CCBB] space-y-1">
                <div className="font-semibold text-xs text-[#171717]">2. Mechanistic Depth</div>
                <div className="text-[11px] text-[#625D57] leading-relaxed">
                  Replace superficial assertions with human incentives, institutional frictions, and behavioral incentives.
                </div>
              </div>
              <div className="p-3 rounded bg-white border border-[#D8CCBB] space-y-1">
                <div className="font-semibold text-xs text-[#171717]">3. Comparative Weighing</div>
                <div className="text-[11px] text-[#625D57] leading-relaxed">
                  Out-weigh rival claims across reversibility, vulnerability, and preconditionality metrics.
                </div>
              </div>
              <div className="p-3 rounded bg-white border border-[#D8CCBB] space-y-1">
                <div className="font-semibold text-xs text-[#171717]">4. Speech Application</div>
                <div className="text-[11px] text-[#625D57] leading-relaxed">
                  Practical timeline, verbatim phrasing, and common pitfalls to avoid in 7-minute parliamentary speeches.
                </div>
              </div>
            </div>
          </div>

          {/* Subject Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EFE8DA] text-[#681F2B] font-medium border border-[#D8CCBB]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer with "Read Full Article" Redirection Button */}
        <div className="p-4 sm:p-5 border-t border-[#D8CCBB] bg-[#EFE8DA]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadArticleAsWord(article)}
              className="px-3 py-2 bg-white hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download entire article as Microsoft Word (.doc) document"
            >
              <Download className="w-3.5 h-3.5 text-[#681F2B]" />
              <span>Download (.doc for Word)</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-white hover:bg-[#D8CCBB] text-[#625D57] hover:text-[#171717] border border-[#D8CCBB] rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#681F2B]" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-transparent hover:bg-black/5 text-[#625D57] text-xs font-medium rounded transition-colors text-center"
            >
              Dismiss
            </button>

            {/* The primary "Read More / Read Full Article" button that redirects */}
            <button
              onClick={handleReadFullArticle}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-semibold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
