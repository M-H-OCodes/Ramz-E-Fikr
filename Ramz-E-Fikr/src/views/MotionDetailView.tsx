import React, { useState } from 'react';
import { ArrowLeft, Play, Share2, Check, BookOpen, Clock, Compass, FileText } from 'lucide-react';
import { useDataStore } from '../services/store';
import { MotionPrepDrawer } from '../components/MotionPrepDrawer';
import { CommentSection } from '../components/CommentSection';

interface MotionDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const MotionDetailView: React.FC<MotionDetailViewProps> = ({ slug, onNavigate, onOpenAuth }) => {
  const store = useDataStore();
  const motion = store.getMotionBySlug(slug);

  const [isPrepOpen, setIsPrepOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!motion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-[#171717]">Motion Not Found</h2>
        <p className="text-sm text-[#625D57]">The requested motion could not be located in our archive.</p>
        <button
          onClick={() => onNavigate('/motions')}
          className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
        >
          Return to Motion Database
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${motion.wording}" — ${motion.tournament} (${motion.year})\nhttps://ramz-e-fikr.org/motions/${motion.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const relatedArticles = (motion.related_article_slugs || [])
    .map((s) => store.getArticleBySlug(s))
    .filter(Boolean);

  const relatedResources = (motion.related_resource_slugs || [])
    .map((s) => store.getResourceBySlug(s))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Back Link */}
      <div>
        <button
          onClick={() => onNavigate('/motions')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#625D57] hover:text-[#681F2B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Motions</span>
        </button>
      </div>

      {/* Hero Motion Presentation */}
      <section className="p-8 sm:p-10 rounded-xl bg-[#EFE8DA] border border-[#D8CCBB] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#681F2B] uppercase tracking-wider">
            <span>{motion.format} Format</span>
            <span>·</span>
            <span>{motion.motion_type}</span>
            <span>·</span>
            <span>{motion.difficulty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-[#D8CCBB] hover:border-[#681F2B] text-[#171717] rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5 text-[#681F2B]" />}
              <span>{copiedLink ? 'Copied Wording' : 'Share Motion'}</span>
            </button>
          </div>
        </div>

        {/* Master Motion Text */}
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] leading-tight text-balance">
          "{motion.wording}"
        </h1>

        {/* Info Slide */}
        {motion.info_slide && (
          <div className="p-5 rounded-md bg-white/80 border border-[#D8CCBB] space-y-1 text-sm text-[#171717]">
            <span className="font-bold text-[#681F2B] uppercase text-xs tracking-wider">
              Context / Info Slide:
            </span>
            <p className="leading-relaxed text-sm text-[#171717] italic">
              {motion.info_slide}
            </p>
          </div>
        )}

        {/* Motion Metadata Row */}
        <div className="pt-4 border-t border-[#D8CCBB]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#625D57]">
          <div>
            <span className="block font-semibold text-[#171717]">Tournament</span>
            <span>{motion.tournament} ({motion.year})</span>
          </div>
          <div>
            <span className="block font-semibold text-[#171717]">Tournament Round</span>
            <span>{motion.round}</span>
          </div>
          <div>
            <span className="block font-semibold text-[#171717]">Circuit Region</span>
            <span>{motion.region}</span>
          </div>
          <div>
            <span className="block font-semibold text-[#171717]">Topic Classification</span>
            <span>{motion.topic}</span>
          </div>
        </div>

        {/* Interactive Prep Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsPrepOpen(true)}
            className="px-6 py-3 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#B79558]" />
            <span>Launch 15-Minute Sparring Prep Room</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Preparation Notes + Related Knowledge Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (8 cols): Strategy Notes & Commentary */}
        <div className="lg:col-span-8 space-y-10">
          {/* Preparation & Clash Analysis */}
          {motion.preparation_notes && (
            <div className="p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3">
              <h3 className="font-editorial text-lg font-bold text-[#171717]">
                Adjudication & Preparation Insight
              </h3>
              <p className="text-sm text-[#625D57] leading-relaxed">
                {motion.preparation_notes}
              </p>
            </div>
          )}

          {/* Commentary */}
          <CommentSection contentType="motion" contentSlug={motion.slug} onOpenAuth={onOpenAuth} />
        </div>

        {/* Right Column (4 cols): Knowledge Graph Connections */}
        <aside className="lg:col-span-4 space-y-6">
          {relatedArticles.length > 0 && (
            <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                Relevant Theoretical Scholarship
              </div>
              <div className="space-y-2.5">
                {relatedArticles.map((art: any) => (
                  <button
                    key={art.id}
                    onClick={() => onNavigate(`/articles/${art.slug}`)}
                    className="w-full text-left p-3 rounded bg-white/70 border border-[#D8CCBB] hover:border-[#681F2B] transition-colors group"
                  >
                    <div className="text-xs font-bold text-[#171717] group-hover:text-[#681F2B] line-clamp-2">
                      {art.title}
                    </div>
                    <div className="text-[10px] text-[#625D57] mt-1">
                      {art.category} · {art.reading_time_minutes} min read
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {relatedResources.length > 0 && (
            <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                Dossiers & Handouts for This Topic
              </div>
              <div className="space-y-2.5">
                {relatedResources.map((res: any) => (
                  <button
                    key={res.id}
                    onClick={() => onNavigate(`/resources/${res.slug}`)}
                    className="w-full text-left p-3 rounded bg-white/70 border border-[#D8CCBB] hover:border-[#681F2B] transition-colors group"
                  >
                    <div className="text-xs font-bold text-[#171717] group-hover:text-[#681F2B] line-clamp-1">
                      {res.title}
                    </div>
                    <div className="text-[10px] text-[#625D57] mt-1">
                      {res.resource_type} · {res.format}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Interactive Prep Room Drawer */}
      <MotionPrepDrawer
        motion={motion}
        isOpen={isPrepOpen}
        onClose={() => setIsPrepOpen(false)}
      />
    </div>
  );
};
