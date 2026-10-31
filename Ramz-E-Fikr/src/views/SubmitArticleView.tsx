import React, { useState, useEffect } from 'react';
import { PenLine, Eye, CheckCircle2, Shield, AlertCircle, FileText, ArrowRight, Lock, LogIn, UserPlus } from 'lucide-react';
import { useDataStore } from '../services/store';
import { SubmissionReviewModal } from '../components/SubmissionReviewModal';
import { DebateFormat, DifficultyLevel, ArticleSubmission } from '../types';

interface SubmitArticleViewProps {
  onNavigate: (path: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const SubmitArticleView: React.FC<SubmitArticleViewProps> = ({ onNavigate, onOpenAuth }) => {
  const store = useDataStore();
  const currentUser = store.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Argumentation');
  const [format, setFormat] = useState<DebateFormat>('British Parliamentary');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [authorName, setAuthorName] = useState(currentUser?.display_name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');
  const [authorInstitution, setAuthorInstitution] = useState(currentUser?.institution || '');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Update author fields when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!authorName) setAuthorName(currentUser.display_name);
      if (!authorEmail) setAuthorEmail(currentUser.email);
      if (!authorInstitution) setAuthorInstitution(currentUser.institution || '');
    }
  }, [currentUser]);

  // Submission review popup modal state
  const [submittedItem, setSubmittedItem] = useState<ArticleSubmission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    'Argumentation',
    'Debate Fundamentals',
    'Strategy',
    'Adjudication',
    'Public Speaking',
    'Case Building',
    'Rebuttal'
  ];

  const formats: DebateFormat[] = [
    'British Parliamentary',
    'World Schools',
    'Asian Parliamentary',
    'Australs',
    'Public Forum',
    'General'
  ];

  const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('You must be logged in to submit an essay.');
      onOpenAuth('signin');
      return;
    }

    if (!title.trim() || !subtitle.trim() || !excerpt.trim() || !body.trim()) {
      setErrorMsg('Please complete all required fields (Title, Subtitle, Excerpt, and Manuscript Body).');
      return;
    }
    setErrorMsg('');

    try {
      const newSub = store.submitArticle({
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        format,
        difficulty,
        excerpt: excerpt.trim(),
        body: body.trim(),
        author_name: authorName.trim() || currentUser.display_name,
        author_email: authorEmail.trim() || currentUser.email,
        author_institution: authorInstitution.trim() || currentUser.institution || 'Debating Society',
        cover_image_url: coverImageUrl.trim() || '/assets/images/article_weighing_cover_1791952564020.jpg'
      });

      // Open the requested confirmation popup screen!
      setSubmittedItem(newSub);
      setIsReviewModalOpen(true);

      // Reset editor
      setTitle('');
      setSubtitle('');
      setExcerpt('');
      setBody('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit article.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
          <span className="font-urdu text-sm font-normal">ارسالِ مضمون</span>
          <span>·</span>
          <span>Editorial Submission Portal</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] mt-1">
          Submit an Article or Essay
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#625D57] max-w-3xl leading-relaxed">
          Ramz-e-Fikr welcomes original submissions on debate theory, argumentation frameworks,
          circuit analysis, case studies, and adjudication ethics. Every piece is evaluated by our
          editorial board for intellectual rigor before publication.
        </p>
      </div>

      {/* Gated Access: User must be logged in to submit */}
      {!currentUser ? (
        <div className="p-8 sm:p-12 rounded-xl bg-[#EFE8DA] border border-[#B79558] text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#681F2B]/10 border border-[#681F2B]/30 flex items-center justify-center mx-auto text-[#681F2B]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
              Authenticated Contributor Access Only
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
              Please Sign In to Submit Your Essay
            </h2>
            <p className="text-sm text-[#625D57] leading-relaxed">
              To guarantee academic attribution, protect intellectual property, and enable our editorial board to coordinate review feedback with you, contributors must be authenticated before submitting manuscripts.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-6 py-2.5 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Your Account</span>
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 py-2.5 bg-white hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#681F2B]" />
              <span>Create Contributor Account</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#D8CCBB]/60 text-xs text-[#625D57]">
            Public visitors can freely browse, read all articles, and download resources without logging in.
          </div>
        </div>
      ) : (
        <>
          {/* Editorial Guidelines Notice */}
          <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#B79558]/60 space-y-2 text-xs">
            <div className="font-editorial font-bold text-sm text-[#171717] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#B79558]" />
                <span>Editorial Criteria & Submission Guidelines</span>
              </span>
              <span className="text-[#681F2B] font-sans font-medium">
                Authenticated as: <strong>{currentUser.display_name}</strong> ({currentUser.email})
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#625D57]">
              <li><strong>Argumentative Rigor:</strong> Prioritize structural mechanisms over unsubstantiated assertions.</li>
              <li><strong>Comparative Clarity:</strong> Articulate the criteria for why the debate or impact matters.</li>
              <li><strong>Review Process:</strong> Submissions are reviewed by our chief adjudicators and editors. You will receive review status and feedback upon evaluation.</li>
            </ul>
          </div>

          {/* Form & Tab Navigation */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Editor / Preview Tabs */}
            <div className="flex items-center justify-between border-b border-[#D8CCBB] pb-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-[#681F2B] text-[#F7F3EA]'
                      : 'text-[#625D57] hover:bg-[#EFE8DA]'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>Compose Manuscript</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-[#681F2B] text-[#F7F3EA]'
                      : 'text-[#625D57] hover:bg-[#EFE8DA]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Formatted Preview</span>
                </button>
              </div>

              <span className="text-[#625D57]">Markdown formatting supported</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded bg-red-50 text-red-800 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {activeTab === 'editor' ? (
              <div className="space-y-6">
                {/* Title & Subtitle */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Architecture of Deontological Burdens in Rights Debates"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8CCBB] rounded-md text-base font-editorial font-bold text-[#171717] focus:border-[#681F2B] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                      Subtitle / Thesis Premise *
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. How debaters can mechanize moral intuition without surrendering to utilitarian calculus."
                      className="w-full px-3.5 py-2 bg-white border border-[#D8CCBB] rounded-md text-xs sm:text-sm text-[#171717] focus:border-[#681F2B] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Classification Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Primary Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Debate Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                    >
                      {formats.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Author Byline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Author Email *
                    </label>
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="contact@university.edu"
                      className="w-full px-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#625D57] mb-1">
                      Institution / Society
                    </label>
                    <input
                      type="text"
                      value={authorInstitution}
                      onChange={(e) => setAuthorInstitution(e.target.value)}
                      placeholder="e.g. Cambridge Union / LUMS"
                      className="w-full px-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                    Executive Excerpt (1–2 Paragraphs) *
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A concise synopsis of the central thesis and why this argument changes how debaters evaluate the round..."
                    rows={3}
                    className="w-full p-3 bg-white border border-[#D8CCBB] rounded-md text-xs sm:text-sm text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>

                {/* Main Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider">
                      Full Manuscript Body *
                    </label>
                    <span className="text-[11px] text-[#625D57]">
                      Use ## for section titles, &gt; for blockquotes, - for bullet lists
                    </span>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your full article here using markdown...&#10;&#10;## 1. The Core Misconception&#10;Explain the problem with status quo argumentation...&#10;&#10;> 'To win a comparative, one must establish why this metric is immutable.'&#10;&#10;## 2. Mechanistic Foundations&#10;Detail the stakeholder incentives and structural links..."
                    rows={12}
                    className="w-full p-4 bg-white border border-[#D8CCBB] rounded-md font-mono text-xs sm:text-sm text-[#171717] focus:border-[#681F2B] focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs text-[#625D57]">
                    By submitting, you certify that this work represents original argumentation.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Upload & Submit for Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Live Formatted Broadsheet Preview */
              <div className="p-8 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-6">
                <div className="border-b border-[#D8CCBB]/60 pb-4 space-y-2">
                  <div className="text-xs font-semibold text-[#681F2B] uppercase tracking-widest">
                    {category} · {format} · {difficulty} Tier
                  </div>
                  <h2 className="font-editorial text-3xl font-bold text-[#171717]">
                    {title || 'Untitled Manuscript'}
                  </h2>
                  <p className="font-serif italic text-[#625D57]">
                    "{subtitle || 'Your thesis subtitle will appear here.'}"
                  </p>
                  <div className="pt-2 text-xs text-[#625D57]">
                    By {authorName || currentUser.display_name} · {authorInstitution || currentUser.institution || 'Independent Scholar'}
                  </div>
                </div>

                <div className="prose text-sm text-[#171717] space-y-4">
                  {excerpt && (
                    <div className="p-4 rounded bg-white/70 border border-[#D8CCBB] text-xs text-[#625D57] italic">
                      <strong>Excerpt: </strong> {excerpt}
                    </div>
                  )}
                  {body ? (
                    <div className="whitespace-pre-line leading-relaxed font-sans text-sm">
                      {body}
                    </div>
                  ) : (
                    <p className="text-xs text-[#625D57] italic">
                      Manuscript body is currently empty. Switch back to "Compose Manuscript" to write.
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </>
      )}

      {/* The Requested Confirmation Popup Screen! */}
      <SubmissionReviewModal
        submission={submittedItem}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onNavigateToAdmin={() => onNavigate('/admin')}
        onNavigateToArticles={() => onNavigate('/articles')}
      />
    </div>
  );
};
