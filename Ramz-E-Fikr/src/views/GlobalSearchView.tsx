import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowRight, BookOpen, FileText, Compass, BookA, X } from 'lucide-react';
import { useDataStore } from '../services/store';
import { SearchResultItem } from '../types';

interface GlobalSearchViewProps {
  onNavigate: (path: string) => void;
  initialQuery?: string;
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({
  onNavigate,
  initialQuery = ''
}) => {
  const store = useDataStore();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'article' | 'resource' | 'motion' | 'glossary'>('all');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [query]);

  const rawResults = useMemo(() => {
    return store.searchGlobal(query);
  }, [store, query]);

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return rawResults;
    return rawResults.filter((r) => r.type === selectedCategory);
  }, [rawResults, selectedCategory]);

  const counts = useMemo(() => {
    return {
      all: rawResults.length,
      article: rawResults.filter((r) => r.type === 'article').length,
      resource: rawResults.filter((r) => r.type === 'resource').length,
      motion: rawResults.filter((r) => r.type === 'motion').length,
      glossary: rawResults.filter((r) => r.type === 'glossary').length
    };
  }, [rawResults]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-4 h-4 text-[#681F2B]" />;
      case 'resource':
        return <FileText className="w-4 h-4 text-[#B79558]" />;
      case 'motion':
        return <Compass className="w-4 h-4 text-[#681F2B]" />;
      case 'glossary':
        return <BookA className="w-4 h-4 text-[#625D57]" />;
      default:
        return <Search className="w-4 h-4 text-[#681F2B]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="border-b border-[#D8CCBB] pb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
          <span className="font-urdu text-sm font-normal">تلاشِ کلی</span>
          <span>·</span>
          <span>Omni-Archive Search</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717]">
          Search Ramz-e-Fikr
        </h1>

        {/* Search Input Bar */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625D57]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any debate topic, motion wording, concept, author, or keyword..."
            autoFocus
            className="w-full pl-11 pr-10 py-3 bg-[#EFE8DA] border border-[#D8CCBB] rounded-lg text-base font-medium text-[#171717] focus:border-[#681F2B] focus:bg-white focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#625D57] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          All Results ({counts.all})
        </button>

        <button
          onClick={() => setSelectedCategory('article')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedCategory === 'article'
              ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          Articles ({counts.article})
        </button>

        <button
          onClick={() => setSelectedCategory('resource')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedCategory === 'resource'
              ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          Resources & PDFs ({counts.resource})
        </button>

        <button
          onClick={() => setSelectedCategory('motion')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedCategory === 'motion'
              ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          Motions ({counts.motion})
        </button>

        <button
          onClick={() => setSelectedCategory('glossary')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedCategory === 'glossary'
              ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          Glossary Concepts ({counts.glossary})
        </button>
      </div>

      {/* Results List */}
      {!query.trim() ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/50 border border-dashed border-[#D8CCBB] text-xs text-[#625D57] space-y-2">
          <p>Begin typing to instantly search across all articles, motions, resources, and terminology.</p>
          <p className="italic">Popular queries: "Weighing", "Economics", "Extension", "Sanctions", "WSDC", "Healthcare"</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/50 border border-dashed border-[#D8CCBB] space-y-2 text-xs text-[#625D57]">
          <p className="font-editorial text-lg font-bold text-[#171717]">
            No records matched "{query}"
          </p>
          <p>Try searching for broader root terms or switching the category tab above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => onNavigate(result.url)}
              className="group cursor-pointer p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-[#625D57]">
                <div className="flex items-center gap-2">
                  {getIcon(result.type)}
                  <span className="font-semibold text-[#681F2B] capitalize">{result.type}</span>
                  <span>·</span>
                  <span>{result.metadata}</span>
                </div>
                <span className="text-[#681F2B] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px]">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                {result.title}
              </h3>

              <p className="text-xs text-[#625D57] line-clamp-2 leading-relaxed">
                {result.snippet}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
