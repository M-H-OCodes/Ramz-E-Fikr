import React from 'react';
import { Shield, BookOpen, Compass, Award, PenLine, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Brand Header */}
      <div className="border-b border-[#D8CCBB] pb-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center font-urdu text-3xl font-bold mx-auto border border-[#B79558]/50 shadow-md">
          ف
        </div>
        <div className="font-urdu text-3xl text-[#681F2B] font-bold">رمزِ فکر</div>
        <div className="font-editorial text-xs tracking-[0.25em] uppercase text-[#171717] font-bold">
          RAMZ-E-FIKR · THE CODE OF THOUGHT
        </div>
        <p className="font-editorial italic text-2xl text-[#681F2B]">
          "Where thought becomes argument."
        </p>
      </div>

      {/* Narrative Section 1: The Intellectual Origin */}
      <section className="space-y-4 text-[#171717] leading-relaxed text-sm sm:text-base">
        <h2 className="font-editorial text-2xl font-bold text-[#171717]">
          The Crisis of Debate Knowledge
        </h2>
        <p className="drop-cap">
          In competitive debate, knowledge is notoriously transient. Brilliant theoretical breakthroughs,
          adjudication criteria, and strategic formulations are routinely born in hotel rooms at 2:00 AM,
          delivered during tournament semifinals, and then lost forever to memory. Handouts live on expired
          Dropbox links; speaker briefings fade on archived Facebook groups; junior debaters in regional
          circuits are left to reinvent first principles from scratch.
        </p>
        <p>
          <strong>Ramz-e-Fikr (رمزِ فکر)</strong> was established to end this fragmentation. Named after the
          classical literary motif of the "code" or "mystery" of conscious contemplation, the platform is an
          open-access, non-commercial public archive designed to preserve, structure, and democratize
          the finest argumentation scholarship in the world.
        </p>
      </section>

      {/* Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-2">
          <BookOpen className="w-5 h-5 text-[#681F2B]" />
          <h3 className="font-editorial text-base font-bold text-[#171717]">Long-Form Scholarship</h3>
          <p className="text-xs text-[#625D57] leading-relaxed">
            In-depth analytical essays deconstructing comparative weighing, economic first principles,
            and closing-half strategy.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-2">
          <Compass className="w-5 h-5 text-[#B79558]" />
          <h3 className="font-editorial text-base font-bold text-[#171717]">Living Motion Index</h3>
          <p className="text-xs text-[#625D57] leading-relaxed">
            A categorized database linking tournament motions directly to info slides, preparation guides,
            and interactive sparring countdown timers.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-2">
          <Shield className="w-5 h-5 text-[#681F2B]" />
          <h3 className="font-editorial text-base font-bold text-[#171717]">Curated Review Board</h3>
          <p className="text-xs text-[#625D57] leading-relaxed">
            Every community article and resource undergoes editorial gatekeeping to guarantee
            argumentative rigor and factual integrity.
          </p>
        </div>
      </section>

      {/* Editorial Constitution */}
      <section className="p-8 rounded-xl bg-[#EFE8DA] border border-[#D8CCBB] space-y-4 text-xs sm:text-sm text-[#171717]">
        <h2 className="font-editorial text-xl font-bold text-[#171717]">
          Our Core Editorial Tenets
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[#625D57] leading-relaxed">
          <li>
            <strong>Universal Open Access:</strong> Reading, searching, and downloading must never require payment or mandatory registration. Debate knowledge belongs to the global commons.
          </li>
          <li>
            <strong>Rigor Over Rhetoric:</strong> We favor arguments substantiated by clear mechanisms and verifiable human incentives over hollow stylistic oratory.
          </li>
          <li>
            <strong>Circuit Inclusivity:</strong> While British Parliamentary (BP) and World Schools (WSDC) represent our foundational focus, we actively catalogue Asian Parliamentary, Australs, and North American debate traditions.
          </li>
          <li>
            <strong>Constructive Commentary:</strong> Discussion threads must adhere to scholarly standards. Ad hominem attacks and partisan posturing are moderated.
          </li>
        </ol>
      </section>

      {/* Call to Contribution */}
      <section className="text-center pt-4 space-y-4">
        <h3 className="font-editorial text-2xl font-bold text-[#171717]">
          Contribute Your Scholarship
        </h3>
        <p className="text-xs sm:text-sm text-[#625D57] max-w-lg mx-auto leading-relaxed">
          Are you a tournament adjudicator, debater, or academic with insights on argumentation? Submit
          an article to our publication desk.
        </p>
        <button
          onClick={() => onNavigate('/submit')}
          className="px-6 py-2.5 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-semibold rounded-md shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Submit an Essay to the Editorial Board</span>
        </button>
      </section>
    </div>
  );
};
