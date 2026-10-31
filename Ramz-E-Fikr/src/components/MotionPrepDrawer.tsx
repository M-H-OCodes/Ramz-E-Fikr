import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Clock, Users, BookOpen, CheckSquare } from 'lucide-react';
import { Motion } from '../types';

interface MotionPrepDrawerProps {
  motion: Motion;
  isOpen: boolean;
  onClose: () => void;
}

export const MotionPrepDrawer: React.FC<MotionPrepDrawerProps> = ({ motion, isOpen, onClose }) => {
  const [prepMinutes, setPrepMinutes] = useState<number>(15);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'timer' | 'roles' | 'scratchpad'>('timer');
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    return localStorage.getItem(`prep_notes_${motion.slug}`) || '';
  });

  // Handle countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) {
              playChime();
            }
            return 0;
          }
          if (prev === 60 && soundEnabled) {
            playChime();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, soundEnabled]);

  // Audio tone generation via Web Audio API (reliable and works without external audio files)
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = (mins = prepMinutes) => {
    setIsRunning(false);
    setSecondsRemaining(mins * 60);
  };

  const handleSelectMinutes = (mins: number) => {
    setPrepMinutes(mins);
    handleReset(mins);
  };

  const handleNotesChange = (text: string) => {
    setScratchpadText(text);
    try {
      localStorage.setItem(`prep_notes_${motion.slug}`, text);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((prepMinutes * 60 - secondsRemaining) / (prepMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#D8CCBB]">
          <div>
            <div className="text-[11px] font-semibold text-[#681F2B] uppercase tracking-wider flex items-center gap-2">
              <span>Debate Sparring Suite</span>
              <span>·</span>
              <span>{motion.format} Format</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#171717] mt-0.5 line-clamp-1">
              Preparation Room: {motion.wording}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#625D57] hover:text-[#171717] rounded"
            aria-label="Close prep room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[#D8CCBB]/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'timer'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prep Timer</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'roles'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Speaker Roles</span>
          </button>
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'scratchpad'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Clash Scratchpad</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="py-4 flex-1 overflow-y-auto">
          {activeTab === 'timer' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              {/* Presets */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#625D57]">Presets:</span>
                {[15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSelectMinutes(mins)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      prepMinutes === mins
                        ? 'bg-[#EFE8DA] border-[#B79558] text-[#681F2B] font-bold'
                        : 'border-[#D8CCBB] text-[#625D57] hover:bg-[#EFE8DA]'
                    }`}
                  >
                    {mins}m ({mins === 15 ? 'BP/WSDC Standard' : `${mins} min`})
                  </button>
                ))}
              </div>

              {/* Big Timer Display */}
              <div className="relative flex flex-col items-center">
                <div className="font-editorial text-6xl sm:text-7xl font-bold tracking-tight text-[#171717] tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="w-64 h-1.5 bg-[#EFE8DA] rounded-full overflow-hidden mt-4 border border-[#D8CCBB]">
                  <div
                    className="h-full bg-gradient-to-r from-[#B79558] to-[#681F2B] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {secondsRemaining === 0 && (
                  <div className="mt-3 text-sm font-bold text-[#681F2B] animate-pulse">
                    Preparation time has concluded!
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStartPause}
                  className={`px-6 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors ${
                    isRunning
                      ? 'bg-[#EFE8DA] border border-[#D8CCBB] text-[#171717] hover:bg-[#D8CCBB]'
                      : 'bg-[#681F2B] text-[#F7F3EA] hover:bg-[#48151E]'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? 'Pause Prep' : 'Start Prep'}</span>
                </button>

                <button
                  onClick={() => handleReset()}
                  className="p-2.5 rounded-md border border-[#D8CCBB] text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA] transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2.5 rounded-md border border-[#D8CCBB] text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA] transition-colors"
                  title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#681F2B]" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Motion info slide if present */}
              {motion.info_slide && (
                <div className="w-full mt-4 p-3 rounded bg-[#EFE8DA] border border-[#D8CCBB] text-xs text-[#171717]">
                  <span className="font-semibold text-[#681F2B]">Info Slide: </span>
                  {motion.info_slide}
                </div>
              )}
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4 text-xs text-[#171717]">
              <div className="p-3 bg-[#EFE8DA] rounded border border-[#D8CCBB]">
                <div className="font-semibold text-[#681F2B] mb-1">
                  Format Guide: {motion.format === 'BP' ? 'British Parliamentary (4 Teams)' : 'World Schools / Parliamentary'}
                </div>
                <p className="text-[#625D57] leading-relaxed">
                  Preparation is strictly 15 minutes without external electronic aids. Partners must align on models, burden thresholds, and stakeholder framing.
                </p>
              </div>

              {motion.format === 'BP' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Opening Government (OG)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>Prime Minister:</strong> Set policy model, define problem, 2 core substantive arguments.</li>
                      <li><strong>Deputy PM:</strong> Defend model against LO refutation, provide second substantive tier.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Opening Opposition (OO)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>Leader of Opp:</strong> Present counter-stance or countermodel, direct refutation to PM.</li>
                      <li><strong>Deputy LO:</strong> Fortify counter-case, emphasize government failure harms.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Closing Government (CG)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>Member of Govt:</strong> Establish extension (new mechanism or novel stakeholder).</li>
                      <li><strong>Govt Whip:</strong> Thematic clash breakdown, resolve why CG out-weighs OG and OO.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Closing Opposition (CO)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>Member of Opp:</strong> Novel opposition extension, tackle CG's unique mechanisms.</li>
                      <li><strong>Opp Whip:</strong> Thematic adjudication summary, prove CO's decisive contribution.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Proposition Bench (WSDC)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>1st Prop (8m):</strong> Problem, definitions, model, Principle & Pragmatic substantive.</li>
                      <li><strong>2nd Prop (8m):</strong> Rebut 1st Opp, fortify model, deliver final substantive.</li>
                      <li><strong>3rd Prop (8m):</strong> Comprehensive refutation and clash categorization.</li>
                      <li><strong>Reply (4m):</strong> Biased adjudication: why Prop won the 2 core questions.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded border border-[#D8CCBB] bg-[#F7F3EA]">
                    <div className="font-semibold text-[#681F2B]">Opposition Bench (WSDC)</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#625D57]">
                      <li><strong>1st Opp (8m):</strong> Attack Prop model, establish countermodel, substantive points.</li>
                      <li><strong>2nd Opp (8m):</strong> Deepen clash, expand Opposition impact, substantive 2.</li>
                      <li><strong>3rd Opp (8m):</strong> Systemic teardown of Proposition claims.</li>
                      <li><strong>Reply (4m):</strong> Closing verdict on why the Opposition world is superior.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scratchpad' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#625D57]">
                <span>Clash & Argumentation Notes (auto-saved locally)</span>
                <button
                  onClick={() => handleNotesChange('')}
                  className="text-[#681F2B] hover:underline text-[11px]"
                >
                  Clear Notes
                </button>
              </div>
              <textarea
                value={scratchpadText}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="1. Spirit of the Motion / Problem to Solve:&#10;2. Proposed Model / Fiat:&#10;3. Key Stakeholder Vulnerability:&#10;4. Substantive 1 (Principle):&#10;5. Substantive 2 (Pragmatic Link):&#10;6. Weighing Metric vs Opposition:"
                rows={9}
                className="w-full p-3 text-xs font-mono bg-white border border-[#D8CCBB] rounded-md focus:border-[#681F2B] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D8CCBB] flex items-center justify-between text-xs text-[#625D57]">
          <span>Ramz-e-Fikr Sparring Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#EFE8DA] text-[#171717] hover:bg-[#D8CCBB] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
