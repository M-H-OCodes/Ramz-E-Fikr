import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shuffle, Filter, Play, ArrowRight, X, Compass, ChevronDown, Check } from 'lucide-react';
import { useDataStore } from '../services/store';
import { MotionPrepDrawer } from '../components/MotionPrepDrawer';
import { RandomMotionModal } from '../components/RandomMotionModal';
import { Motion, DebateFormatShort, DifficultyLevel, MotionType } from '../types';

interface MotionsViewProps {
  onNavigate: (path: string) => void;
  initialParams?: Record<string, string>;
}

export const MotionsView: React.FC<MotionsViewProps> = ({ onNavigate, initialParams = {} }) => {
  const store = useDataStore();
  const allMotions = store.getMotions();

  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [selectedFormat, setSelectedFormat] = useState(initialParams.format || 'All');
  const [selectedTopic, setSelectedTopic] = useState(initialParams.topic || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialParams.difficulty || 'All');
  const [selectedType, setSelectedType] = useState(initialParams.type || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'difficulty'>('newest');

  const [activePrepMotion, setActivePrepMotion] = useState<Motion | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const formats = ['All', 'BP', 'WSDC', 'AP', 'Australs'];
  const topics = [
    'All',
    'Economics',
    'International Relations',
    'Healthcare & Welfare',
    'Education',
    'Law & Civil Liberties',
    'Technology & Ethics',
    'Environment & Activism',
    'Gender & Social Justice',
    'Political Theory'
  ];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const motionTypes = [
    'All',
    'Policy (THW)',
    'Value (THBT)',
    'Actor (TH, as...)',
    'Preference (THP)',
    'Regret (THR)'
  ];

  // Sync to URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedFormat !== 'All') params.set('format', selectedFormat);
    if (selectedTopic !== 'All') params.set('topic', selectedTopic);
    if (selectedDifficulty !== 'All') params.set('difficulty', selectedDifficulty);
    if (selectedType !== 'All') params.set('type', selectedType);
    const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [searchQuery, selectedFormat, selectedTopic, selectedDifficulty, selectedType]);

  // Filtered motions
  const filteredMotions = useMemo(() => {
    return allMotions
      .filter((mot) => {
        const matchesSearch =
          !searchQuery.trim() ||
          mot.wording.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (mot.info_slide && mot.info_slide.toLowerCase().includes(searchQuery.toLowerCase())) ||
          mot.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mot.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFormat = selectedFormat === 'All' || mot.format === selectedFormat;
        const matchesTopic =
          selectedTopic === 'All' || mot.topic.toLowerCase().includes(selectedTopic.toLowerCase());
        const matchesDifficulty = selectedDifficulty === 'All' || mot.difficulty === selectedDifficulty;
        const matchesType = selectedType === 'All' || mot.motion_type === selectedType;

        return matchesSearch && matchesFormat && matchesTopic && matchesDifficulty && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return a.year - b.year;
        if (sortBy === 'difficulty') {
          const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
        }
        return b.year - a.year;
      });
  }, [allMotions, searchQuery, selectedFormat, selectedTopic, selectedDifficulty, selectedType, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFormat('All');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedFormat !== 'All' ||
    selectedTopic !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedType !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
            <span className="font-urdu text-sm font-normal">قضایا و موضوعاتِ مناظرہ</span>
            <span>·</span>
            <span>The Motion Index</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] mt-1">
            Debate Motion Database
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#625D57] max-w-3xl leading-relaxed">
            Search hundreds of historical motions from WUDC, WSDC, and continental championships with
            contextual info slides, analytical preparation notes, and sparring timers.
          </p>
        </div>

        {/* Top Actions: Random Motion Generator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRandomModalOpen(true)}
            className="px-4 py-2 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Give Me a Random Motion</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Console */}
      <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search motions by wording, tournament, concept, or region..."
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

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs shrink-0">
            <span className="text-[#625D57]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#D8CCBB] rounded-md text-[#171717] focus:outline-none"
            >
              <option value="newest">Year: Newest</option>
              <option value="oldest">Year: Earliest</option>
              <option value="difficulty">Difficulty Tier</option>
            </select>
          </div>
        </div>

        {/* Multi-facet Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Debate Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'All Formats' : f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Topic Domain
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Difficulty Tier
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

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Motion Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {motionTypes.map((mt) => (
                <option key={mt} value={mt}>
                  {mt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter and Filter Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D8CCBB]/60 text-xs text-[#625D57]">
          <span>
            Indexed Motions: <strong>{filteredMotions.length}</strong> of {allMotions.length}
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#681F2B] font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter Parameters</span>
            </button>
          )}
        </div>
      </div>

      {/* Motions List */}
      {filteredMotions.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/60 border border-dashed border-[#D8CCBB] space-y-3">
          <Compass className="w-8 h-8 text-[#681F2B] mx-auto" />
          <h3 className="font-editorial text-xl font-bold text-[#171717]">
            No motions match this exact intersection
          </h3>
          <p className="text-xs text-[#625D57] max-w-md mx-auto">
            Try resetting your topic filter or expanding to all debate formats.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMotions.map((motion) => (
            <div
              key={motion.id}
              className="group p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#681F2B] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6"
            >
              <div
                onClick={() => onNavigate(`/motions/${motion.slug}`)}
                className="cursor-pointer flex-1 space-y-2.5"
              >
                {/* Zero-Pill Metadata */}
                <div className="flex items-center gap-2 text-xs text-[#625D57] flex-wrap">
                  <span className="font-bold text-[#681F2B]">{motion.format}</span>
                  <span>·</span>
                  <span>{motion.motion_type}</span>
                  <span>·</span>
                  <span>{motion.topic}</span>
                  <span>·</span>
                  <span>{motion.difficulty}</span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#171717] group-hover:text-[#681F2B] transition-colors leading-snug">
                  "{motion.wording}"
                </h3>

                {motion.info_slide && (
                  <p className="text-xs text-[#625D57] italic line-clamp-2 leading-relaxed">
                    <strong>Info Slide: </strong>
                    {motion.info_slide}
                  </p>
                )}

                <div className="pt-2 flex items-center gap-3 text-[11px] text-[#625D57]">
                  <span className="font-medium text-[#171717]">
                    {motion.tournament} ({motion.year})
                  </span>
                  <span>·</span>
                  <span>{motion.round}</span>
                  <span>·</span>
                  <span>{motion.region}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <button
                  onClick={() => onNavigate(`/motions/${motion.slug}`)}
                  className="px-4 py-2 text-xs font-semibold text-[#171717] bg-white border border-[#D8CCBB] hover:border-[#681F2B] rounded transition-colors whitespace-nowrap"
                >
                  View Clash & Notes
                </button>

                <button
                  onClick={() => setActivePrepMotion(motion)}
                  className="px-4 py-2 text-xs font-semibold text-[#F7F3EA] bg-[#681F2B] hover:bg-[#48151E] rounded transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 text-[#B79558]" />
                  <span>Start 15m Prep</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Prep Timer Drawer */}
      {activePrepMotion && (
        <MotionPrepDrawer
          motion={activePrepMotion}
          isOpen={!!activePrepMotion}
          onClose={() => setActivePrepMotion(null)}
        />
      )}

      {/* Random Motion Modal */}
      <RandomMotionModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        onNavigateToMotion={(slug) => onNavigate(`/motions/${slug}`)}
        initialFormat={selectedFormat}
        initialDifficulty={selectedDifficulty}
        initialTopic={selectedTopic}
      />
    </div>
  );
};
