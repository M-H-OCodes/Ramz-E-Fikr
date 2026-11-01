import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowRight, BookOpen, Clock, X, ChevronRight } from 'lucide-react';
import { useDataStore } from '../services/store';
import { Article, DebateFormat, DifficultyLevel } from '../types';
import { ArticleOverviewModal } from '../components/ArticleOverviewModal';
import { assetUrl } from '../utils/assetUrl';

interface ArticlesViewProps {
  onNavigate: (path: string) => void;
  initialParams?: Record<string, string>;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onNavigate, initialParams = {} }) => {
  const store = useDataStore();
  const allArticles = store.getArticles();

  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || 'All');
  const [selectedFormat, setSelectedFormat] = useState(initialParams.format || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialParams.difficulty || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'discussed'>('newest');
  const [selectedArticleForOverview, setSelectedArticleForOverview] = useState<Article | null>(null);

  const categories = [
    'All',
    'Argumentation',
    'Debate Fundamentals',
    'Strategy',
    'Adjudication',
    'Public Speaking',
    'Case Building',
    'Rebuttal'
  ];

  const formats = [
    'All',
    'British Parliamentary',
    'World Schools',
    'Australs',
    'Asian Parliamentary',
    'General'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Update browser URL query params whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedFormat !== 'All') params.set('format', selectedFormat);
    if (selectedDifficulty !== 'All') params.set('difficulty', selectedDifficulty);
    const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [searchQuery, selectedCategory, selectedFormat, selectedDifficulty]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return allArticles
      .filter((art) => {
        const matchesSearch =
          !searchQuery.trim() ||
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'All' || art.category === selectedCategory;

        const matchesFormat =
          selectedFormat === 'All' || art.format === selectedFormat;

        const matchesDifficulty =
          selectedDifficulty === 'All' || art.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesFormat && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.views_count - a.views_count;
        if (sortBy === 'discussed') return b.commentary_count - a.commentary_count;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });
  }, [allArticles, searchQuery, selectedCategory, selectedFormat, selectedDifficulty, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFormat('All');
    setSelectedDifficulty('All');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All' || selectedFormat !== 'All' || selectedDifficulty !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
          <span className="font-urdu text-sm font-normal">مضامین و مقالات</span>
          <span>·</span>
          <span>The Publication Archive</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] mt-1">
          Debate Articles & Scholarship
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#625D57] max-w-3xl leading-relaxed">
          Rigorous analysis of argumentation theory, debate adjudication ethics, closing-half extensions,
          and macroeconomic first principles written by international champions and adjudicators.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by article title, author, argument concept, or tag..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8CCBB] rounded-md text-xs sm:text-sm text-[#171717] focus:border-[#681F2B] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#625D57] hover:text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs shrink-0">
            <span className="text-[#625D57]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#D8CCBB] rounded-md text-[#171717] focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="views">Most Read</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
        </div>

        {/* Multi-Facet Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter and Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D8CCBB]/60 text-xs text-[#625D57]">
          <span>
            Showing <strong>{filteredArticles.length}</strong> of {allArticles.length} articles
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#681F2B] font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Articles Listing */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/60 border border-dashed border-[#D8CCBB] space-y-3">
          <BookOpen className="w-8 h-8 text-[#681F2B] mx-auto" />
          <h3 className="font-editorial text-xl font-bold text-[#171717]">
            No matching articles found
          </h3>
          <p className="text-xs text-[#625D57] max-w-md mx-auto">
            Try adjusting your search criteria, switching debate formats, or clearing active filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticleForOverview(article)}
              className="group cursor-pointer p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Optional Cover image */}
                {article.cover_image_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden rounded bg-[#D8CCBB] mb-4">
                    <img
                      src={assetUrl(article.cover_image_url)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Zero-Pill Inline Metadata */}
                <div className="flex items-center gap-2 text-xs text-[#625D57] mb-2 flex-wrap">
                  <span className="font-semibold text-[#681F2B]">{article.category}</span>
                  <span>·</span>
                  <span>{article.format}</span>
                  <span>·</span>
                  <span className="font-medium">{article.reading_time_minutes} min read</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="mt-2 text-xs text-[#625D57] line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8CCBB]/60 flex items-center justify-between text-[11px] text-[#625D57]">
                <div>
                  <span className="font-medium text-[#171717]">{article.author_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#681F2B] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Overview & Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Overview & Read More Modal */}
      <ArticleOverviewModal
        article={selectedArticleForOverview}
        isOpen={Boolean(selectedArticleForOverview)}
        onClose={() => setSelectedArticleForOverview(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
