import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, FileText, Filter, X, ArrowRight, BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import { useDataStore } from '../services/store';
import { ResourceItem, ResourceType, DebateFormat, SkillArea, DifficultyLevel } from '../types';
import { getResourceCoverImage } from '../utils/resourceCover';

interface ResourcesViewProps {
  onNavigate: (path: string) => void;
  initialParams?: Record<string, string>;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigate, initialParams = {} }) => {
  const store = useDataStore();
  const allResources = store.getResources();

  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [selectedType, setSelectedType] = useState<string>(initialParams.type || 'All');
  const [selectedFormat, setSelectedFormat] = useState<string>(initialParams.format || 'All');
  const [selectedSkill, setSelectedSkill] = useState<string>(initialParams.skill || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(initialParams.difficulty || 'All');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const resourceTypes = ['All', 'PDF', 'Video', 'Guide', 'Cheatsheet', 'Template', 'Paper'];
  const formats = ['All', 'British Parliamentary', 'World Schools', 'Asian Parliamentary', 'Australs', 'General'];
  const skillAreas = [
    'All',
    'Case Building',
    'Argumentation',
    'Rebuttal',
    'Strategy',
    'Weighing',
    'Extensions',
    'Adjudication',
    'Research',
    'POIs',
    'Motion Analysis',
    'Critical Thinking'
  ];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (selectedFormat !== 'All') params.set('format', selectedFormat);
    if (selectedSkill !== 'All') params.set('skill', selectedSkill);
    if (selectedDifficulty !== 'All') params.set('difficulty', selectedDifficulty);
    const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [searchQuery, selectedType, selectedFormat, selectedSkill, selectedDifficulty]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return allResources.filter((res) => {
      const matchesSearch =
        !searchQuery.trim() ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || res.resource_type === selectedType;
      const matchesFormat = selectedFormat === 'All' || res.format === selectedFormat;
      const matchesSkill = selectedSkill === 'All' || res.skill_area === selectedSkill;
      const matchesDifficulty = selectedDifficulty === 'All' || res.difficulty === selectedDifficulty;

      return matchesSearch && matchesType && matchesFormat && matchesSkill && matchesDifficulty;
    });
  }, [allResources, searchQuery, selectedType, selectedFormat, selectedSkill, selectedDifficulty]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedFormat('All');
    setSelectedSkill('All');
    setSelectedDifficulty('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'All' ||
    selectedFormat !== 'All' ||
    selectedSkill !== 'All' ||
    selectedDifficulty !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
            <span className="font-urdu text-sm font-normal">ذخیرہٴ کتب و دستاویزات</span>
            <span>·</span>
            <span>The Open Knowledge Library</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] mt-1">
            Debate Resource Library
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#625D57] max-w-3xl leading-relaxed">
            Downloadable adjudication manuals, 15-minute prep workflows, macroeconomics clash guides,
            and extension formulation grids curated for competitive debaters and coaches.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="md:hidden px-3.5 py-2 bg-[#EFE8DA] border border-[#D8CCBB] rounded-md text-xs font-medium text-[#171717] flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#681F2B]" />
            <span>Filter Resources</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Filter Suite */}
      <div className={`p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title, topic, skill area, or author..."
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

        {/* Multi-Facet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Resource Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {resourceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

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
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">
              Skill Focus
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
            >
              {skillAreas.map((s) => (
                <option key={s} value={s}>
                  {s}
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
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D8CCBB]/60 text-xs text-[#625D57]">
          <span>
            Displaying <strong>{filteredResources.length}</strong> of {allResources.length} curated documents
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#681F2B] font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter Parameters</span>
            </button>
          )}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#EFE8DA]/60 border border-dashed border-[#D8CCBB] space-y-3">
          <FileText className="w-8 h-8 text-[#681F2B] mx-auto" />
          <h3 className="font-editorial text-xl font-bold text-[#171717]">
            No matching resources found
          </h3>
          <p className="text-xs text-[#625D57] max-w-md mx-auto">
            Try broadening your format selection or clearing the active search keyword.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
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

                <div className="flex items-center justify-between text-xs text-[#625D57] mb-2.5">
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

              <div className="mt-6 pt-4 border-t border-[#D8CCBB]/60 space-y-2 text-xs text-[#625D57]">
                <div className="flex items-center justify-between text-[11px]">
                  <span>{res.skill_area} · {res.difficulty}</span>
                  <span className="font-mono">{res.file_size || 'PDF Document'}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#625D57]">{res.downloads_count.toLocaleString()} downloads</span>
                  <span className="text-[#681F2B] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                    Inspect & Download <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
