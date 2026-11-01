import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Compass,
  Shuffle,
  Clock,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  Play
} from 'lucide-react';
import { useDataStore } from '../services/store';
import { MotionPrepDrawer } from '../components/MotionPrepDrawer';
import { RandomMotionModal } from '../components/RandomMotionModal';
import { ArticleOverviewModal } from '../components/ArticleOverviewModal';
import { Article, Motion, ResourceItem } from '../types';
import { getResourceCoverImage } from '../utils/resourceCover';
import { assetUrl } from '../utils/assetUrl';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const store = useDataStore();
  const articles = store.getArticles();
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 4);
  const resources = store.getResources().slice(0, 5);
  const motions = store.getMotions();
  const featuredMotion = motions.find((m) => m.featured) || motions[0];

  const [isPrepDrawerOpen, setIsPrepDrawerOpen] = useState(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [selectedArticleForOverview, setSelectedArticleForOverview] = useState<Article | null>(null);

  const archiveTopics = [
    { name: 'Argumentation', count: '14 entries', path: '/articles?category=Argumentation' },
    { name: 'Rebuttal', count: '9 entries', path: '/articles?category=Rebuttal' },
    { name: 'Case Building', count: '18 entries', path: '/articles?category=Case+Building' },
    { name: 'Research & Dossiers', count: '12 entries', path: '/resources?skill=Research' },
    { name: 'Adjudication', count: '11 entries', path: '/articles?category=Adjudication' },
    { name: 'Public Speaking', count: '7 entries', path: '/articles?category=Public+Speaking' },
    { name: 'Closing Strategy', count: '15 entries', path: '/articles?category=Strategy' },
    { name: 'Logic & First Principles', count: '16 entries', path: '/glossary' }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* =========================================================================
          HERO SECTION (Editorial Broadsheet Anchor)
         ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 border-b border-[#D8CCBB] pb-16 overflow-hidden">
        {/* Subtle decorative background imagery with high-contrast scrim */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img
            src={assetUrl('/assets/images/hero_debate_chamber_1791952563761.jpg')}
            alt="Historic debate hall"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Editorial Kicker */}
          <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#681F2B]">
            <span className="font-urdu text-base font-normal">رمزِ فکر</span>
            <span>·</span>
            <span>Open Access Debate Archive</span>
            <span>·</span>
            <span>Vol. I · 2026</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight text-balance leading-[1.12]">
            Where thought becomes argument.
          </h1>

          {/* Supporting Statement */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#625D57] leading-relaxed text-balance">
            Ramz-e-Fikr is an open archive of debate resources, ideas, motions, strategy, and analysis
            built for people who want to think more sharply, argue more rigorously, and debate better.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/articles')}
              className="px-6 py-3 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-sm font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/resources')}
              className="px-6 py-3 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-sm font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#681F2B]" />
              <span>Browse Resources</span>
            </button>

            <button
              onClick={() => onNavigate('/motions')}
              className="px-6 py-3 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-sm font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#B79558]" />
              <span>Find a Motion</span>
            </button>
          </div>

          {/* Subtle Editorial Ornament */}
          <div className="pt-6 flex items-center justify-center gap-4 text-[#B79558]/60">
            <div className="w-16 h-px bg-[#B79558]/40" />
            <span className="font-urdu text-lg select-none text-[#681F2B]">فکر</span>
            <div className="w-16 h-px bg-[#B79558]/40" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: FEATURED ARTICLES (Lead Story + Editorial Grid)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D8CCBB]">
          <div>
            <div className="font-urdu text-sm text-[#681F2B] font-semibold">مضامینِ منتخب</div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
              Featured Articles & Scholarship
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/articles')}
            className="text-xs font-semibold text-[#681F2B] hover:underline flex items-center gap-1"
          >
            <span>View All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lead Story + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Feature (7 cols) */}
          {featuredArticles[0] && (
            <div
              onClick={() => setSelectedArticleForOverview(featuredArticles[0])}
              className="lg:col-span-7 group cursor-pointer p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#B79558] transition-all"
            >
              <div className="aspect-[16/9] w-full overflow-hidden rounded bg-[#D8CCBB] mb-5">
                <img
                  src={assetUrl(featuredArticles[0].cover_image_url)}
                  alt={featuredArticles[0].title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Zero-Pill Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#625D57] mb-2.5">
                <span className="font-semibold text-[#681F2B]">{featuredArticles[0].category}</span>
                <span>·</span>
                <span>{featuredArticles[0].format}</span>
                <span>·</span>
                <span>{featuredArticles[0].reading_time_minutes} min read</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                {featuredArticles[0].title}
              </h3>

              <p className="mt-3 text-sm text-[#625D57] leading-relaxed line-clamp-3">
                {featuredArticles[0].excerpt}
              </p>

              <div className="mt-5 pt-4 border-t border-[#D8CCBB]/60 flex items-center justify-between text-xs text-[#625D57]">
                <div>
                  <span className="font-medium text-[#171717]">{featuredArticles[0].author_name}</span>
                  <span className="mx-1.5">·</span>
                  <span>{featuredArticles[0].author_institution}</span>
                </div>
                <span className="text-[#681F2B] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Overview & Read More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* Secondary Stack (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {featuredArticles.slice(1, 4).map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleForOverview(art)}
                className="group cursor-pointer p-5 rounded-lg bg-[#EFE8DA]/60 border border-[#D8CCBB] hover:border-[#B79558] transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-[#625D57] mb-1.5">
                  <span className="font-semibold text-[#681F2B]">{art.category}</span>
                  <span>·</span>
                  <span>{art.reading_time_minutes} min read</span>
                  <span>·</span>
                  <span>{art.difficulty}</span>
                </div>

                <h4 className="font-editorial text-lg font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                  {art.title}
                </h4>

                <p className="mt-2 text-xs text-[#625D57] line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#625D57]">
                  <span>By {art.author_name}</span>
                  <span className="text-[#681F2B] font-medium flex items-center gap-0.5">
                    Overview & Read More <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EXPLORE THE ARCHIVE (3 Pillars)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div
            onClick={() => onNavigate('/articles')}
            className="group cursor-pointer p-8 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all relative overflow-hidden"
          >
            <div className="text-[11px] font-semibold text-[#681F2B] uppercase tracking-widest mb-3">
              Pillar 01
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors">
              ARTICLES
            </h3>
            <p className="font-editorial italic text-base text-[#681F2B] mt-1">
              "Read. Question. Reconsider."
            </p>
            <p className="mt-3 text-xs text-[#625D57] leading-relaxed">
              Long-form treatise on comparative weighing, extension mechanics, state framing, and
              adjudication standards.
            </p>
            <div className="mt-6 flex items-center text-xs font-semibold text-[#681F2B] group-hover:translate-x-1 transition-transform">
              <span>Enter Articles Archive</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onNavigate('/resources')}
            className="group cursor-pointer p-8 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all relative overflow-hidden"
          >
            <div className="text-[11px] font-semibold text-[#B79558] uppercase tracking-widest mb-3">
              Pillar 02
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors">
              RESOURCES
            </h3>
            <p className="font-editorial italic text-base text-[#681F2B] mt-1">
              "Everything you need to debate better."
            </p>
            <p className="mt-3 text-xs text-[#625D57] leading-relaxed">
              Curated official manuals, preparation workflow grids, economic matrices, and decision
              tree cheatsheets.
            </p>
            <div className="mt-6 flex items-center text-xs font-semibold text-[#681F2B] group-hover:translate-x-1 transition-transform">
              <span>Browse Resource Vault</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onNavigate('/motions')}
            className="group cursor-pointer p-8 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all relative overflow-hidden"
          >
            <div className="text-[11px] font-semibold text-[#681F2B] uppercase tracking-widest mb-3">
              Pillar 03
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors">
              MOTIONS
            </h3>
            <p className="font-editorial italic text-base text-[#681F2B] mt-1">
              "Find the motion. Build the clash."
            </p>
            <p className="mt-3 text-xs text-[#625D57] leading-relaxed">
              Searchable database with tournament pedigree, contextual info slides, preparation
              timers, and sparring notes.
            </p>
            <div className="mt-6 flex items-center text-xs font-semibold text-[#681F2B] group-hover:translate-x-1 transition-transform">
              <span>Explore Motion Database</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURED MOTION (The Clash Focal Point)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-xl bg-gradient-to-br from-[#48151E] to-[#681F2B] text-[#F7F3EA] shadow-xl relative overflow-hidden">
          {/* Subtle watermark text in Urdu */}
          <div className="absolute right-4 bottom-2 font-urdu text-8xl text-white/5 pointer-events-none select-none">
            مباحثہ
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B79558]">
                <span>FEATURED MOTION OF THE WEEK</span>
                <span>·</span>
                <span>{featuredMotion.format} FORMAT</span>
              </div>
              <button
                onClick={() => setIsRandomModalOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F7F3EA] rounded text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#B79558]" />
                <span>Spin Random Motion</span>
              </button>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
              "{featuredMotion.wording}"
            </h3>

            {featuredMotion.info_slide && (
              <div className="p-4 rounded bg-black/20 border border-white/10 text-xs sm:text-sm text-[#F7F3EA]/90 leading-relaxed">
                <span className="font-semibold text-[#B79558]">Info Slide: </span>
                {featuredMotion.info_slide}
              </div>
            )}

            {/* Metadata Definition List */}
            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-[#F7F3EA]/80">
              <div>
                <span className="text-[#B79558]">Topic: </span>
                {featuredMotion.topic}
              </div>
              <div>
                <span className="text-[#B79558]">Tournament: </span>
                {featuredMotion.tournament} ({featuredMotion.year})
              </div>
              <div>
                <span className="text-[#B79558]">Difficulty: </span>
                {featuredMotion.difficulty}
              </div>
              <div>
                <span className="text-[#B79558]">Round: </span>
                {featuredMotion.round}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(`/motions/${featuredMotion.slug}`)}
                className="px-5 py-2.5 bg-[#F7F3EA] text-[#681F2B] font-semibold text-xs rounded hover:bg-white transition-colors flex items-center gap-2"
              >
                <span>View Full Motion & Discussion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsPrepDrawerOpen(true)}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-[#F7F3EA] border border-white/25 font-semibold text-xs rounded transition-colors flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-[#B79558]" />
                <span>Launch 15-Minute Prep Sparring</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LATEST RESOURCES (Download Vault)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D8CCBB]">
          <div>
            <div className="font-urdu text-sm text-[#681F2B] font-semibold">ذخیرہ وسائل</div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
              Latest Debate Resources & Handouts
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/resources')}
            className="text-xs font-semibold text-[#681F2B] hover:underline flex items-center gap-1"
          >
            <span>View All Resources</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              onClick={() => onNavigate(`/resources/${res.slug}`)}
              className="group cursor-pointer p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden rounded bg-[#D8CCBB] mb-4 shadow-2xs">
                  <img
                    src={getResourceCoverImage(res)}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#625D57] mb-3">
                  <div className="flex items-center gap-1.5 font-semibold text-[#681F2B]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{res.resource_type}</span>
                  </div>
                  <span>{res.format}</span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="mt-2 text-xs text-[#625D57] line-clamp-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#D8CCBB]/60 flex items-center justify-between text-[11px] text-[#625D57]">
                <span>{res.downloads_count.toLocaleString()} downloads</span>
                <span className="text-[#681F2B] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Access <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FROM THE ARCHIVE (Topic Clouds)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pb-3 border-b border-[#D8CCBB]">
          <div className="font-urdu text-sm text-[#681F2B] font-semibold">موضوعات و اصطلاحات</div>
          <h2 className="font-editorial text-2xl font-bold text-[#171717]">
            Core Debate Disciplines
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {archiveTopics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => onNavigate(topic.path)}
              className="p-4 rounded bg-[#EFE8DA]/80 border border-[#D8CCBB] hover:border-[#B79558] hover:bg-[#EFE8DA] transition-all text-left group"
            >
              <div className="font-editorial text-base font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors">
                {topic.name}
              </div>
              <div className="text-xs text-[#625D57] mt-1">{topic.count}</div>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WHY RAMZ-E-FIKR? (Editorial Statement)
         ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-xl bg-[#EFE8DA] border border-[#D8CCBB] text-center space-y-4">
          <div className="font-urdu text-xl text-[#681F2B] font-bold">لماذا رمزِ فکر؟</div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
            Why Ramz-e-Fikr Exists
          </h3>
          <p className="text-base text-[#171717] leading-relaxed max-w-2xl mx-auto">
            "Debate knowledge is often scattered across forgotten Google Drives, dead tournament tabs,
            archived Facebook groups, and oral institutional lore.
          </p>
          <p className="text-sm text-[#625D57] leading-relaxed max-w-2xl mx-auto">
            Ramz-e-Fikr exists to gather this scholarship into one open, searchable, and rigorously
            curated public library. Because argument is not merely a competitive game—it is how
            human societies refine truth."
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/about')}
              className="text-xs font-semibold text-[#681F2B] hover:underline"
            >
              Read Our Full Editorial Charter & Constitution →
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <MotionPrepDrawer
        motion={featuredMotion}
        isOpen={isPrepDrawerOpen}
        onClose={() => setIsPrepDrawerOpen(false)}
      />
      <RandomMotionModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        onNavigateToMotion={(slug) => onNavigate(`/motions/${slug}`)}
      />
      <ArticleOverviewModal
        article={selectedArticleForOverview}
        isOpen={Boolean(selectedArticleForOverview)}
        onClose={() => setSelectedArticleForOverview(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
