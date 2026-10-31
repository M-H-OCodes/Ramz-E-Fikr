import React from 'react';
import { CheckCircle2, BookOpen, Shield, Clock, FileText, ArrowRight, X } from 'lucide-react';
import { ArticleSubmission } from '../types';

interface SubmissionReviewModalProps {
  submission: ArticleSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToArticles: () => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission,
  isOpen,
  onClose,
  onNavigateToAdmin,
  onNavigateToArticles
}) => {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Subtle decorative gold corner mark */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#B79558]/20 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#625D57] hover:text-[#171717] rounded-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with emblem */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#681F2B]/10 border border-[#681F2B]/30 flex items-center justify-center shrink-0 text-[#681F2B]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-urdu text-sm text-[#681F2B] font-semibold">رمزِ فکر — شعبہ اشاعت</div>
            <h3 className="font-editorial text-2xl text-[#171717] font-bold mt-0.5">
              Manuscript Received for Editorial Review
            </h3>
          </div>
        </div>

        {/* Primary Message */}
        <div className="mt-5 p-4 rounded bg-[#EFE8DA] border border-[#D8CCBB]">
          <p className="text-sm text-[#171717] leading-relaxed">
            Thank you for contributing to <strong>Ramz-e-Fikr</strong>. Your piece has been successfully uploaded to our editorial desk.
          </p>
          <div className="mt-3 flex items-start gap-2.5 text-xs text-[#681F2B] font-medium">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Our publication editorial team will review your manuscript for argumentative rigor, clarity of mechanisms, and citations, and will notify you of its approval status shortly.
            </span>
          </div>
        </div>

        {/* Submission Details Card */}
        <div className="mt-5 space-y-2 text-xs text-[#625D57]">
          <div className="flex items-center justify-between py-1.5 border-b border-[#D8CCBB]/60">
            <span className="font-medium text-[#171717]">Submission Ref:</span>
            <span className="font-mono text-[#681F2B] font-semibold">{submission.id}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-[#D8CCBB]/60">
            <span className="font-medium text-[#171717]">Title:</span>
            <span className="text-[#171717] font-medium truncate max-w-[280px]">
              {submission.title}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-[#D8CCBB]/60">
            <span className="font-medium text-[#171717]">Author Byline:</span>
            <span>{submission.author_name} ({submission.author_institution || 'Contributor'})</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-[#D8CCBB]/60">
            <span className="font-medium text-[#171717]">Review Stage:</span>
            <span className="text-[#B79558] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B79558]" />
              Under Editorial Board Review
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="font-medium text-[#171717]">Typical Turnaround:</span>
            <span>48 – 72 hours</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-[#D8CCBB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onNavigateToAdmin();
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#681F2B] bg-[#EFE8DA] hover:bg-[#D8CCBB] border border-[#D8CCBB] rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-3.5 h-3.5 text-[#B79558]" />
            <span>Open Editorial CMS Queue (Admin Demo)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToArticles();
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-[#F7F3EA] bg-[#681F2B] hover:bg-[#48151E] rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Published Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
