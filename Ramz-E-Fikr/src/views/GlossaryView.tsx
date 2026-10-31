import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ArrowRight, X, Sparkles } from 'lucide-react';
import { useDataStore } from '../services/store';
import { GlossaryTerm } from '../types';

interface GlossaryViewProps {
  onNavigate: (path: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onNavigate }) => {
  const store = useDataStore();
  const allTerms = store.getGlossaryTerms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredTerms = useMemo(() => {
    return allTerms.filter((term) => {
      const matchesSearch =
        !searchQuery.trim() ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.short_definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.detailed_explanation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLetter =
        selectedLetter === 'All' ||
        term.term.toUpperCase().startsWith(selectedLetter);

      return matchesSearch && matchesLetter;
    });
  }, [allTerms, searchQuery, selectedLetter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
          <span className="font-urdu text-sm font-normal">فرہنگِ مباحثہ</span>
          <span>·</span>
          <span>Lexicon & Definitions</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] mt-1">
          Debate & Argumentation Glossary
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#625D57] max-w-3xl leading-relaxed">
          An authoritative glossary defining competitive parliamentary terminology, adjudication doctrines,
          rhetorical maneuvers, and formal argumentation concepts.
        </p>
      </div>

      {/* Search & Alphabet Index */}
      <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms, definitions, concepts (e.g. Weighing, Fiat, Knife, Burden)..."
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

        {/* Alphabet Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <button
            onClick={() => setSelectedLetter('All')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
              selectedLetter === 'All'
                ? 'bg-[#681F2B] text-[#F7F3EA]'
                : 'text-[#625D57] hover:bg-[#D8CCBB]'
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => {
            const hasTerms = allTerms.some((t) => t.term.toUpperCase().startsWith(letter));
            return (
              <button
                key={letter}
                disabled={!hasTerms}
                onClick={() => setSelectedLetter(letter)}
                className={`w-7 h-7 text-xs font-semibold rounded flex items-center justify-center transition-colors ${
                  selectedLetter === letter
                    ? 'bg-[#681F2B] text-[#F7F3EA]'
                    : hasTerms
                      ? 'text-[#171717] hover:bg-[#D8CCBB]'
                      : 'text-[#625D57]/40 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Accordion/Cards */}
      {filteredTerms.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/60 border border-dashed border-[#D8CCBB] space-y-3">
          <BookOpen className="w-8 h-8 text-[#681F2B] mx-auto" />
          <h3 className="font-editorial text-xl font-bold text-[#171717]">
            No terms match your query
          </h3>
          <p className="text-xs text-[#625D57]">Try clearing the search query or selecting "All" letters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              className="p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-editorial text-2xl font-bold text-[#681F2B]">
                    {term.term}
                  </h3>
                  <span className="text-xs text-[#625D57]">
                    Category: {term.category}
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-[#171717] leading-relaxed">
                {term.short_definition}
              </p>

              <p className="text-xs text-[#625D57] leading-relaxed">
                {term.detailed_explanation}
              </p>

              {term.examples && term.examples.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-[#171717] mb-1">
                    Application Examples:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#625D57]">
                    {term.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
