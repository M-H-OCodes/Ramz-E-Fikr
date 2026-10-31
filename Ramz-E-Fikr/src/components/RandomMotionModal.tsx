import React, { useState } from 'react';
import { Shuffle, ArrowRight, X, Sparkles, BookOpen } from 'lucide-react';
import { Motion } from '../types';
import { useDataStore } from '../services/store';

interface RandomMotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMotion: (slug: string) => void;
  initialFormat?: string;
  initialDifficulty?: string;
  initialTopic?: string;
}

export const RandomMotionModal: React.FC<RandomMotionModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMotion,
  initialFormat = 'All',
  initialDifficulty = 'All',
  initialTopic = 'All'
}) => {
  const store = useDataStore();
  const [format, setFormat] = useState(initialFormat);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [topic, setTopic] = useState(initialTopic);
  const [currentMotion, setCurrentMotion] = useState<Motion | null>(() => {
    return store.getRandomMotion(
      initialFormat !== 'All' ? initialFormat : undefined,
      initialDifficulty !== 'All' ? initialDifficulty : undefined,
      initialTopic !== 'All' ? initialTopic : undefined
    );
  });

  const handleGenerate = () => {
    const m = store.getRandomMotion(
      format !== 'All' ? format : undefined,
      difficulty !== 'All' ? difficulty : undefined,
      topic !== 'All' ? topic : undefined
    );
    setCurrentMotion(m);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#D8CCBB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#171717]">
                Random Motion Generator
              </h3>
              <p className="text-xs text-[#625D57]">
                Generate an authentic motion matching your sparring criteria
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#625D57] hover:text-[#171717] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#EFE8DA] border border-[#D8CCBB] rounded text-[#171717]"
            >
              <option value="All">All Formats</option>
              <option value="BP">BP (British Parl.)</option>
              <option value="WSDC">WSDC (World Schools)</option>
              <option value="AP">AP (Asian Parl.)</option>
              <option value="Australs">Australs</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#EFE8DA] border border-[#D8CCBB] rounded text-[#171717]"
            >
              <option value="All">All Tiers</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#625D57] mb-1">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#EFE8DA] border border-[#D8CCBB] rounded text-[#171717]"
            >
              <option value="All">All Topics</option>
              <option value="Economics">Economics</option>
              <option value="International">IR & Security</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Law">Law & Rights</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
        </div>

        {/* Motion Card Display */}
        <div className="mt-5 p-5 rounded bg-[#EFE8DA] border border-[#D8CCBB] min-h-[160px] flex flex-col justify-between">
          {currentMotion ? (
            <>
              <div>
                <div className="flex items-center gap-2 text-[11px] text-[#625D57] mb-2">
                  <span className="font-semibold text-[#681F2B]">{currentMotion.format}</span>
                  <span>·</span>
                  <span>{currentMotion.topic}</span>
                  <span>·</span>
                  <span>{currentMotion.difficulty}</span>
                </div>
                <h4 className="font-editorial text-lg font-bold text-[#171717] leading-snug">
                  "{currentMotion.wording}"
                </h4>
                {currentMotion.info_slide && (
                  <p className="mt-2 text-xs text-[#625D57] italic line-clamp-2">
                    <strong>Info Slide:</strong> {currentMotion.info_slide}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#D8CCBB]/60 flex items-center justify-between text-[11px] text-[#625D57]">
                <span>{currentMotion.tournament} ({currentMotion.year}) · {currentMotion.round}</span>
                <span className="text-[#B79558] font-medium">{currentMotion.motion_type}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-sm text-[#625D57]">
              No motions match the selected criteria. Try broadening your filter selections.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-xs font-semibold text-[#681F2B] bg-[#EFE8DA] hover:bg-[#D8CCBB] border border-[#D8CCBB] rounded-md transition-colors flex items-center gap-2"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Generate Another Motion</span>
          </button>

          {currentMotion && (
            <button
              onClick={() => {
                onClose();
                onNavigateToMotion(currentMotion.slug);
              }}
              className="px-5 py-2 text-xs font-semibold text-[#F7F3EA] bg-[#681F2B] hover:bg-[#48151E] rounded-md transition-colors flex items-center gap-2"
            >
              <span>Open Motion & Spar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
