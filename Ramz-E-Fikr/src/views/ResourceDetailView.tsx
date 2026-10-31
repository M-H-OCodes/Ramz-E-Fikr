import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Share2,
  Check,
  BookOpen,
  Clock,
  Shield,
  Play,
  Maximize2,
  Printer
} from 'lucide-react';
import { useDataStore } from '../services/store';
import { CommentSection } from '../components/CommentSection';
import { downloadResourceAsWord, printOrSaveResourceAsPdf, downloadPdfBinary } from '../utils/documentExport';
import { getResourceCoverImage } from '../utils/resourceCover';

interface ResourceDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({ slug, onNavigate, onOpenAuth }) => {
  const store = useDataStore();
  const resource = store.getResourceBySlug(slug);

  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showPdfReader, setShowPdfReader] = useState(false);
  const [fullScreenModal, setFullScreenModal] = useState(false);

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-[#171717]">Resource Not Found</h2>
        <p className="text-sm text-[#625D57]">The requested resource could not be located.</p>
        <button
          onClick={() => onNavigate('/resources')}
          className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
        >
          Return to Resource Library
        </button>
      </div>
    );
  }

  // Determine authoritative master PDF link (local asset, external treaty/source, or master compendium)
  const masterPdfUrl =
    resource.master_pdf_url ||
    (resource.file_url && (resource.file_url.startsWith('/assets/') || resource.file_url.toLowerCase().endsWith('.pdf'))
      ? resource.file_url
      : '/assets/aistudio/Debate_Resources_Compilation_731a0f5c.pdf');

  const isLocalPdf = Boolean(masterPdfUrl && masterPdfUrl.startsWith('/assets/'));

  const isYouTube = Boolean(
    resource.file_url &&
      (resource.file_url.includes('youtube.com') || resource.file_url.includes('youtu.be'))
  );
  const isDrive = Boolean(
    resource.file_url &&
      (resource.file_url.includes('drive.google.com') || resource.file_url.includes('docs.google.com'))
  );

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (url.includes('watch?v=')) {
        const id = url.split('watch?v=')[1]?.split('&')[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(resource.file_url) : null;

  const handleDownloadWord = () => {
    store.incrementResourceDownloads(resource.slug);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    downloadResourceAsWord(resource);
  };

  const handleDownloadPdf = async () => {
    store.incrementResourceDownloads(resource.slug);
    setIsDownloadingPdf(true);
    try {
      const ok = await downloadPdfBinary(masterPdfUrl, `${resource.slug}.pdf`, resource);
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Download PDF error:', err);
      printOrSaveResourceAsPdf(resource);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintPdf = () => {
    store.incrementResourceDownloads(resource.slug);
    printOrSaveResourceAsPdf(resource);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Back Link */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('/resources')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#625D57] hover:text-[#681F2B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Resources</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details & Document Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Resource Preview Cover Banner */}
          <div className="aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden rounded-lg bg-[#D8CCBB] border border-[#D8CCBB] shadow-2xs">
            <img
              src={getResourceCoverImage(resource)}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header */}
          <div className="space-y-3 border-b border-[#D8CCBB] pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#681F2B] uppercase tracking-wider">
              <span>{resource.resource_type}</span>
              <span>·</span>
              <span>{resource.format}</span>
              <span>·</span>
              <span>{resource.difficulty}</span>
              {resource.featured && (
                <>
                  <span>·</span>
                  <span className="text-[#B79558] font-bold">Featured Resource</span>
                </>
              )}
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] leading-snug">
              {resource.title}
            </h1>

            <p className="text-base text-[#625D57] leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Primary Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Download Master PDF Button (100% functional for all resources) */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-5 py-2.5 bg-[#681F2B] hover:bg-[#48151E] disabled:opacity-75 text-[#F7F3EA] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              title="Download or open the authentic master PDF / original document"
            >
              {isDownloadingPdf ? (
                <div className="w-4 h-4 border-2 border-[#B79558] border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileText className="w-4 h-4 text-[#B79558]" />
              )}
              <span>
                {isDownloadingPdf
                  ? 'Downloading PDF to Disk...'
                  : isLocalPdf
                  ? `Download Master PDF (${resource.file_size || 'PDF'})`
                  : 'Open Master PDF (Verified Source)'}
              </span>
              {!isLocalPdf && !isDownloadingPdf && <ExternalLink className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Read & Preview PDF In-App if local PDF */}
            {isLocalPdf && (
              <button
                onClick={() => setShowPdfReader(!showPdfReader)}
                className="px-4 py-2.5 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#681F2B]" />
                <span>{showPdfReader ? 'Hide PDF Reader' : 'Read PDF In-App'}</span>
              </button>
            )}

            {/* Download Complete Dossier as Word */}
            <button
              onClick={handleDownloadWord}
              className="px-4 py-2.5 bg-[#B79558] hover:bg-[#9E7F46] text-[#171717] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              title="Download full study dossier formatted for Microsoft Word and Google Docs"
            >
              <Download className="w-4 h-4" />
              <span>Download (.doc for Word)</span>
            </button>

            {/* Save Dossier as PDF / Print */}
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              title="Save formatted study dossier directly as PDF via print preview"
            >
              <Printer className="w-4 h-4 text-[#681F2B]" />
              <span>Save Dossier as PDF</span>
            </button>

            {/* External Links if YouTube or Google Drive */}
            {isYouTube && (
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => store.incrementResourceDownloads(resource.slug)}
                className="px-4 py-2.5 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-[#681F2B]" />
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#625D57]" />
              </a>
            )}

            {isDrive && (
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => store.incrementResourceDownloads(resource.slug)}
                className="px-4 py-2.5 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-[#681F2B]" />
                <span>Access Google Drive</span>
              </a>
            )}

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4 text-[#681F2B]" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Document exported successfully. Access counter incremented.</span>
            </div>
          )}

          {/* Embedded YouTube Player if Video */}
          {isYouTube && youtubeEmbedUrl && (
            <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#171717]">
                <span className="flex items-center gap-2 text-[#681F2B]">
                  <Play className="w-4 h-4 text-[#B79558]" />
                  <span>Interactive Debate Video Lecture</span>
                </span>
                <span className="text-[11px] text-[#625D57]">YouTube Source Stream</span>
              </div>
              <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black shadow-md border border-[#D8CCBB]">
                <iframe
                  src={youtubeEmbedUrl}
                  title={resource.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* In-App PDF Reader Viewer if Local PDF and toggled */}
          {isLocalPdf && showPdfReader && masterPdfUrl && (
            <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#B79558] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-editorial font-bold text-[#171717] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#681F2B]" />
                  <span>Full Manuscript Reader</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="text-[11px] font-semibold text-[#681F2B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setFullScreenModal(true)}
                    className="text-[11px] font-semibold text-[#681F2B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>In-App Fullscreen</span>
                  </button>
                </div>
              </div>
              <iframe
                src={masterPdfUrl}
                title={resource.title}
                className="w-full h-[680px] rounded-md border border-[#D8CCBB] bg-white"
              />
            </div>
          )}

          {/* Attached Document Content Preview / Reader */}
          <div className="p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D8CCBB]/60 text-xs gap-2">
              <div>
                <span className="font-editorial font-bold text-[#171717] uppercase tracking-wider block">
                  Attached Comprehensive Study Dossier & Manuscript
                </span>
                <span className="text-[11px] text-[#625D57]">
                  Verified authentic debate resource material · {resource.format}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadWord}
                  className="px-3 py-1.5 bg-white hover:bg-[#D8CCBB] text-[#681F2B] border border-[#D8CCBB] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download in Microsoft Word (.doc) format"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.doc for Word)</span>
                </button>
                <span className="text-[#625D57] font-mono text-[11px] hidden sm:inline">
                  {resource.file_size || 'Full Text'}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-md bg-white border border-[#D8CCBB] shadow-2xs space-y-3">
              <pre className="text-xs font-sans text-[#171717] leading-relaxed overflow-x-auto whitespace-pre-wrap font-medium">
                {resource.sample_preview_text || resource.description}
              </pre>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-[#625D57] pt-1">
              <span>Opens natively in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.</span>
              <button
                onClick={handleDownloadWord}
                className="text-[#681F2B] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Save a Copy to Word (.doc)</span>
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Commentary Section */}
          <CommentSection contentType="resource" contentSlug={resource.slug} onOpenAuth={onOpenAuth} />
        </div>

        {/* Right Column: Metadata Dossier (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-4">
            <h3 className="font-editorial text-sm uppercase tracking-wider text-[#681F2B] font-bold pb-2 border-b border-[#D8CCBB]/60">
              Accession Dossier
            </h3>

            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-[#625D57]">Author / Compiler</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.author}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Publishing Source</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.source}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Debate Format</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.format}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Skill Focus</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.skill_area}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Curated Topic</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.topic}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Publication Year</dt>
                <dd className="font-semibold text-[#171717] mt-0.5">{resource.publication_year}</dd>
              </div>

              <div>
                <dt className="text-[#625D57]">Total Accesses / Downloads</dt>
                <dd className="font-semibold text-[#681F2B] mt-0.5 tabular-nums">
                  {resource.downloads_count.toLocaleString()}
                </dd>
              </div>
            </dl>

            <div className="pt-3 border-t border-[#D8CCBB]/60">
              <div className="text-[11px] font-semibold text-[#625D57] mb-2">Subject Tags:</div>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Full-Screen In-App PDF Reader Modal */}
      {fullScreenModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col p-3 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 text-[#F7F3EA] max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen className="w-5 h-5 text-[#B79558] shrink-0" />
              <div className="min-w-0">
                <span className="font-editorial font-bold text-sm sm:text-base block truncate text-[#F7F3EA]">
                  {resource.title}
                </span>
                <span className="text-[11px] text-[#D8CCBB] hidden sm:block">
                  Ramz-e-Fikr Comprehensive Study Manuscript Reader
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="px-3.5 py-1.5 bg-[#B79558] hover:bg-[#9E7F46] disabled:opacity-75 text-[#171717] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
              </button>
              <button
                onClick={() => setFullScreenModal(false)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-7xl w-full mx-auto bg-white rounded-lg overflow-hidden shadow-2xl border border-white/20">
            <iframe
              src={masterPdfUrl}
              title={resource.title}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
