import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, Check, ArrowRight, ExternalLink, Download, Sparkles, FileText } from 'lucide-react';
import { useDataStore } from '../services/store';
import { CommentSection } from '../components/CommentSection';
import { Article } from '../types';
import { downloadArticleAsWord } from '../utils/documentExport';

interface ArticleDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug, onNavigate, onOpenAuth }) => {
  const store = useDataStore();
  const article = store.getArticleBySlug(slug);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (article) {
      store.incrementArticleViews(slug);
    }
  }, [slug]);

  // Track scroll progress for reading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-[#171717]">Article Not Found</h2>
        <p className="text-sm text-[#625D57]">The requested article does not exist or may have been unlisted.</p>
        <button
          onClick={() => onNavigate('/articles')}
          className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
        >
          Return to Articles Archive
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find related resources and motions
  const relatedResources = (article.related_resource_slugs || [])
    .map((s) => store.getResourceBySlug(s))
    .filter(Boolean);

  const relatedMotions = (article.related_motion_slugs || [])
    .map((s) => store.getMotionBySlug(s))
    .filter(Boolean);

  return (
    <div>
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#681F2B] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('/articles')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#625D57] hover:text-[#681F2B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Article Header (Academic Broadsheet Style) */}
        <header className="max-w-4xl border-b border-[#D8CCBB] pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#681F2B] uppercase tracking-widest">
            <span>{article.category}</span>
            <span>·</span>
            <span>{article.format}</span>
            <span>·</span>
            <span>{article.difficulty} Level</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] leading-[1.18] text-balance">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#625D57] font-serif italic leading-relaxed">
            "{article.subtitle}"
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#625D57] border-t border-[#D8CCBB]/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#171717]">{article.author_name}</span>
              <span>·</span>
              <span>{article.author_institution}</span>
              <span>·</span>
              <span>Published {article.published_at}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.reading_time_minutes} min read</span>
              </span>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded hover:bg-[#EFE8DA] text-[#625D57] hover:text-[#171717] flex items-center gap-1"
                title="Copy share link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Two-Column Grid: Main Reading Column + Sticky Meta Rail */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Reading Column (8 cols, max-w-prose / 65-75ch) */}
          <div className="lg:col-span-8 max-w-prose space-y-6 text-[#171717] leading-relaxed">
            {/* Executive Overview & Abstract Banner */}
            <div className="p-5 rounded-lg bg-[#EFE8DA] border-l-4 border-[#681F2B] border-y border-r border-[#D8CCBB] space-y-3 mb-6 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-editorial font-bold text-[#681F2B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B79558]" />
                  <span>Executive Overview & Abstract</span>
                </span>
                <span className="text-[11px] font-mono text-[#625D57] bg-white px-2 py-0.5 rounded border border-[#D8CCBB]">
                  ~{article.body.trim().split(/\s+/).length.toLocaleString()} words · {article.reading_time_minutes} min read
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#171717] leading-relaxed font-serif italic">
                "{article.excerpt}"
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#D8CCBB]/60 text-xs">
                <span className="text-[11px] text-[#625D57]">
                  Target Format: <strong className="text-[#171717]">{article.format}</strong> · Level: <strong className="text-[#171717]">{article.difficulty}</strong>
                </span>
                <button
                  onClick={() => downloadArticleAsWord(article)}
                  className="px-3.5 py-1.5 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download complete article formatted for Microsoft Word and Google Docs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Article (.doc for Word)</span>
                </button>
              </div>
            </div>

            {/* Opening Drop-Cap Paragraph */}
            <div className="text-base sm:text-lg leading-relaxed drop-cap font-sans">
              {article.body.trim().split('\n\n')[0].replace(/^#.*\n/, '')}
            </div>

            {/* Render Remaining Formatted Markdown Sections */}
            <div className="space-y-6 text-sm sm:text-base leading-relaxed font-sans text-[#171717]">
              {article.body
                .trim()
                .split('\n\n')
                .slice(1)
                .map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="font-editorial text-2xl font-bold text-[#171717] pt-6 pb-1 border-b border-[#D8CCBB]/50"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-editorial text-lg font-bold text-[#681F2B] pt-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote
                        key={idx}
                        className="py-4 px-6 my-6 bg-[#EFE8DA] border-y border-[#D8CCBB] font-editorial italic text-lg text-[#681F2B]"
                      >
                        {paragraph.replace('> ', '').replace(/"/g, '')}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const codeContent = paragraph.replace(/```[a-z]*\n?/g, '').trim();
                    return (
                      <pre
                        key={idx}
                        className="p-4 my-4 rounded-md bg-[#171717] text-[#EFE8DA] font-mono text-xs overflow-x-auto"
                      >
                        {codeContent}
                      </pre>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map((li) => li.replace('- ', ''));
                    return (
                      <ul key={idx} className="space-y-1.5 list-disc list-inside text-sm">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
            </div>

            {/* Citations & Further Reading */}
            {article.citations && article.citations.length > 0 && (
              <div className="mt-12 pt-6 border-t border-[#D8CCBB] space-y-2">
                <h4 className="font-editorial text-xs uppercase tracking-widest text-[#681F2B] font-bold">
                  Sources & Recommended Scholarship
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-[#625D57]">
                  {article.citations.map((cite, i) => (
                    <li key={i}>{cite}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Threaded Commentary */}
            <CommentSection contentType="article" contentSlug={article.slug} onOpenAuth={onOpenAuth} />
          </div>

          {/* Sticky Meta Rail (4 cols) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-8">
            {/* Quick Actions & Word Download */}
            <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                Article Tools & Export
              </div>
              <button
                onClick={() => downloadArticleAsWord(article)}
                className="w-full px-4 py-2.5 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Download (.doc for Word)</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 bg-white hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5 text-[#681F2B]" />}
                <span>{copiedLink ? 'Link Copied' : 'Share Article Link'}</span>
              </button>
            </div>

            {/* Author Biography Box */}
            <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                About the Author
              </div>
              <div className="font-editorial text-lg font-bold text-[#171717]">
                {article.author_name}
              </div>
              <p className="text-xs text-[#625D57] leading-relaxed">
                {article.author_title}. Member of {article.author_institution}.
              </p>
            </div>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <div className="p-5 rounded-lg bg-[#EFE8DA]/80 border border-[#D8CCBB] space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                  Associated Handouts & Tools
                </div>
                <div className="space-y-2.5">
                  {relatedResources.map((res: any) => (
                    <button
                      key={res.id}
                      onClick={() => onNavigate(`/resources/${res.slug}`)}
                      className="w-full text-left p-2.5 rounded bg-white/70 border border-[#D8CCBB] hover:border-[#681F2B] transition-colors group"
                    >
                      <div className="text-xs font-bold text-[#171717] group-hover:text-[#681F2B] line-clamp-1">
                        {res.title}
                      </div>
                      <div className="text-[10px] text-[#625D57] mt-0.5">
                        {res.resource_type} · {res.format}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Motions for Sparring */}
            {relatedMotions.length > 0 && (
              <div className="p-5 rounded-lg bg-[#EFE8DA]/80 border border-[#D8CCBB] space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                  Motions for Practicing This Concept
                </div>
                <div className="space-y-2.5">
                  {relatedMotions.map((mot: any) => (
                    <button
                      key={mot.id}
                      onClick={() => onNavigate(`/motions/${mot.slug}`)}
                      className="w-full text-left p-2.5 rounded bg-white/70 border border-[#D8CCBB] hover:border-[#681F2B] transition-colors group"
                    >
                      <div className="text-xs font-medium text-[#171717] group-hover:text-[#681F2B] line-clamp-2">
                        "{mot.wording}"
                      </div>
                      <div className="text-[10px] text-[#B79558] mt-1 font-semibold">
                        {mot.format} · {mot.tournament}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
};
