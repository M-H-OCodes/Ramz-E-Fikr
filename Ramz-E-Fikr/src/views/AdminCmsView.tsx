import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Compass,
  Download,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Clock,
  Eye,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  UserPlus
} from 'lucide-react';
import { useDataStore, ROOT_ADMIN_EMAIL } from '../services/store';
import { ArticleSubmission, Motion, ResourceItem, UserRole } from '../types';

interface AdminCmsViewProps {
  onNavigate: (path: string) => void;
  onOpenSupabase: () => void;
}

export const AdminCmsView: React.FC<AdminCmsViewProps> = ({ onNavigate, onOpenSupabase }) => {
  const store = useDataStore();
  const currentUser = store.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'submissions' | 'motions' | 'resources' | 'reports' | 'users'>('submissions');
  const [selectedSubmission, setSelectedSubmission] = useState<ArticleSubmission | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');

  const articles = store.getArticles(true);
  const resources = store.getResources();
  const motions = store.getMotions();
  const submissions = store.getSubmissions();
  const reports = store.getReports();
  const allAccounts = store.getAllAccounts();
  const assignedAdmins = store.getAssignedAdmins();

  const isAdmin = currentUser ? store.isUserAdmin(currentUser.email) : false;
  const isRootAdmin = currentUser ? store.isRootAdmin(currentUser.email) : false;

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_review');

  const handleApproveSubmission = (id: string) => {
    const published = store.approveSubmission(id);
    if (published) {
      setActionSuccess(`Manuscript approved! Published live at /articles/${published.slug}`);
      setSelectedSubmission(null);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  const handleRejectSubmission = (id: string) => {
    store.rejectSubmission(id, 'Declined per editorial standards check.');
    setActionSuccess('Submission marked as declined.');
    setSelectedSubmission(null);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'hide_comment') => {
    store.resolveReport(reportId, action);
    setActionSuccess(action === 'hide_comment' ? 'Comment hidden from public view.' : 'Report dismissed as compliant.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleAssignAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    const res = store.assignAdmin(newAdminEmail.trim());
    if (res.success) {
      setActionSuccess(res.message);
      setNewAdminEmail('');
      setTimeout(() => setActionSuccess(''), 4000);
    } else {
      setActionSuccess(res.message);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  const handleRevokeAdmin = (email: string) => {
    const res = store.revokeAdmin(email);
    setActionSuccess(res.message);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // If user is not authorized admin, render dignified access restriction screen
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#681F2B]/10 border border-[#681F2B]/30 flex items-center justify-center text-[#681F2B]">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
            Editorial Desk Access Restricted
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717]">
            Administrator Privileges Required
          </h1>
          <p className="text-sm text-[#625D57] max-w-lg mx-auto leading-relaxed">
            The Administrative CMS and Editorial Review Desk are strictly restricted to authorized administrators (<strong className="text-[#171717]">{ROOT_ADMIN_EMAIL}</strong>).
            {currentUser ? (
              <span> You are currently signed in as <strong className="text-[#681F2B]">{currentUser.display_name}</strong> ({currentUser.email}), with regular debater privileges.</span>
            ) : (
              <span> Please sign in using your verified administrator credentials to access the editorial queue.</span>
            )}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 bg-[#EFE8DA] border border-[#D8CCBB] text-xs font-semibold rounded hover:bg-[#D8CCBB] text-[#171717]"
          >
            Return to Ramz-e-Fikr Home
          </button>
          <button
            onClick={() => onNavigate('/articles')}
            className="px-4 py-2 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded hover:bg-[#48151E]"
          >
            Browse Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#D8CCBB] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#681F2B]">
            <Shield className="w-3.5 h-3.5 text-[#B79558]" />
            <span>Editorial Board & Content Management</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] mt-1">
            Admin CMS & Editorial Desk
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#625D57]">
            Active Administrator:{' '}
            <strong className="text-[#681F2B]">
              {currentUser?.display_name || 'Admin'}
            </strong>{' '}
            (<span className="font-mono text-[11px]">{currentUser?.email}</span>) ·{' '}
            <span className="font-semibold text-emerald-800">
              {isRootAdmin ? 'Root Administrator (Master Control)' : 'Assigned Administrator'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSupabase}
            className="px-3 py-1.5 bg-[#EFE8DA] border border-[#D8CCBB] hover:border-[#B79558] text-xs font-semibold rounded text-[#171717] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Supabase Sync & DDL</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Metrics Dashboard Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB]">
          <div className="text-[11px] font-semibold text-[#625D57] uppercase tracking-wider">
            Total Articles
          </div>
          <div className="font-editorial text-2xl font-bold text-[#171717] mt-1">
            {articles.length}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Published Live</div>
        </div>

        <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB]">
          <div className="text-[11px] font-semibold text-[#625D57] uppercase tracking-wider">
            Pending Review
          </div>
          <div className="font-editorial text-2xl font-bold text-[#681F2B] mt-1">
            {pendingSubmissions.length}
          </div>
          <div className="text-[10px] text-[#681F2B] font-medium mt-0.5">Community Submissions</div>
        </div>

        <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB]">
          <div className="text-[11px] font-semibold text-[#625D57] uppercase tracking-wider">
            Indexed Motions
          </div>
          <div className="font-editorial text-2xl font-bold text-[#171717] mt-1">
            {motions.length}
          </div>
          <div className="text-[10px] text-[#625D57] mt-0.5">WUDC, WSDC, AP</div>
        </div>

        <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB]">
          <div className="text-[11px] font-semibold text-[#625D57] uppercase tracking-wider">
            Resources Vault
          </div>
          <div className="font-editorial text-2xl font-bold text-[#171717] mt-1">
            {resources.length}
          </div>
          <div className="text-[10px] text-[#625D57] mt-0.5">Curated Compilations</div>
        </div>

        <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB]">
          <div className="text-[11px] font-semibold text-[#625D57] uppercase tracking-wider">
            Debaters & Admins
          </div>
          <div className="font-editorial text-2xl font-bold text-[#681F2B] mt-1">
            {allAccounts.length}
          </div>
          <div className="text-[10px] text-[#681F2B] font-medium mt-0.5">
            {1 + assignedAdmins.length} Admins · {allAccounts.length - (1 + assignedAdmins.length)} Debaters
          </div>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D8CCBB] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
            activeTab === 'submissions'
              ? 'bg-[#681F2B] text-[#F7F3EA]'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Submissions Queue ({pendingSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
            activeTab === 'users'
              ? 'bg-[#681F2B] text-[#F7F3EA]'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users & Admin Delegation ({allAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('motions')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
            activeTab === 'motions'
              ? 'bg-[#681F2B] text-[#F7F3EA]'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Motion Manager ({motions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
            activeTab === 'resources'
              ? 'bg-[#681F2B] text-[#F7F3EA]'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Resource Library ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
            activeTab === 'reports'
              ? 'bg-[#681F2B] text-[#F7F3EA]'
              : 'text-[#625D57] hover:bg-[#EFE8DA]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Comment Moderation ({reports.length})</span>
        </button>
      </div>

      {/* TAB 1: ARTICLE SUBMISSIONS REVIEW QUEUE */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#625D57]">
            <span>
              Articles submitted by community debaters requiring editorial board approval.
            </span>
            <button
              onClick={() => onNavigate('/submit')}
              className="text-[#681F2B] font-semibold hover:underline"
            >
              + Submit Another Article as Contributor
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center rounded bg-[#EFE8DA] border border-[#D8CCBB] text-xs text-[#625D57]">
              No submissions currently in the queue.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-lg bg-[#EFE8DA] border border-[#D8CCBB] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#681F2B] font-semibold">{sub.id}</span>
                      <span>·</span>
                      <span className="font-semibold text-[#171717]">{sub.category}</span>
                      <span>·</span>
                      <span>{sub.format}</span>
                      <span>·</span>
                      <span>{sub.difficulty} Tier</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        sub.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : sub.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-editorial text-xl font-bold text-[#171717]">
                    {sub.title}
                  </h3>

                  <p className="text-xs text-[#625D57] italic">
                    "{sub.subtitle}"
                  </p>

                  <div className="text-xs text-[#171717]">
                    <strong>Author:</strong> {sub.author_name} ({sub.author_email}) · {sub.author_institution}
                  </div>

                  <div className="p-3 rounded bg-white/70 border border-[#D8CCBB] text-xs text-[#625D57] line-clamp-3">
                    <strong>Excerpt:</strong> {sub.excerpt}
                  </div>

                  {/* Review Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => setSelectedSubmission(selectedSubmission?.id === sub.id ? null : sub)}
                      className="px-3 py-1.5 rounded border border-[#D8CCBB] bg-white text-[#171717] hover:bg-[#EFE8DA] flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{selectedSubmission?.id === sub.id ? 'Hide Full Manuscript' : 'Inspect Full Manuscript'}</span>
                    </button>

                    {sub.status === 'pending_review' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectSubmission(sub.id)}
                          className="px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-800 hover:bg-red-100 font-semibold"
                        >
                          Decline Piece
                        </button>

                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          className="px-4 py-1.5 rounded bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] font-semibold flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#B79558]" />
                          <span>Approve & Publish Live</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Full Manuscript Inspector */}
                  {selectedSubmission?.id === sub.id && (
                    <div className="mt-4 p-5 rounded bg-white border border-[#D8CCBB] space-y-3 text-xs">
                      <div className="font-bold text-[#681F2B] uppercase tracking-wider pb-2 border-b border-[#D8CCBB]">
                        Full Manuscript Inspector
                      </div>
                      <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto p-2 bg-[#F7F3EA] rounded">
                        {sub.body}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MOTIONS MANAGER */}
      {activeTab === 'motions' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span>Manage motion database entities</span>
            <span className="text-[#625D57] font-mono">{motions.length} total entries</span>
          </div>

          <div className="space-y-3">
            {motions.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="p-4 rounded bg-[#EFE8DA] border border-[#D8CCBB] flex items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="text-[11px] text-[#681F2B] font-semibold">
                    {m.format} · {m.difficulty} · {m.tournament} ({m.year})
                  </div>
                  <div className="font-editorial text-sm font-bold text-[#171717]">
                    "{m.wording}"
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate(`/motions/${m.slug}`)}
                    className="p-1.5 rounded hover:bg-[#D8CCBB] text-[#171717]"
                    title="View public motion"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete motion from database?')) {
                        store.deleteMotion(m.id);
                        setActionSuccess('Motion removed from database.');
                      }
                    }}
                    className="p-1.5 rounded hover:bg-red-100 text-red-700"
                    title="Delete motion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCES MANAGER */}
      {activeTab === 'resources' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span>Manage downloadable guides, templates, and PDFs</span>
            <span className="text-[#625D57] font-mono">{resources.length} active documents</span>
          </div>

          <div className="space-y-3">
            {resources.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded bg-[#EFE8DA] border border-[#D8CCBB] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-[11px] text-[#681F2B] font-semibold">
                    {r.resource_type} · {r.format} · {r.skill_area}
                  </div>
                  <div className="font-editorial text-sm font-bold text-[#171717]">
                    {r.title}
                  </div>
                  <div className="text-[11px] text-[#625D57] mt-0.5">
                    {r.downloads_count.toLocaleString()} downloads · By {r.author}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate(`/resources/${r.slug}`)}
                    className="p-1.5 rounded hover:bg-[#D8CCBB] text-[#171717]"
                    title="View public resource"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete resource from vault?')) {
                        store.deleteResource(r.id);
                        setActionSuccess('Resource removed from repository.');
                      }
                    }}
                    className="p-1.5 rounded hover:bg-red-100 text-red-700"
                    title="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMENT MODERATION */}
      {activeTab === 'reports' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span>Review flagged commentary reported by the community</span>
            <span className="text-amber-800 font-semibold">{reports.length} reports</span>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center rounded bg-[#EFE8DA] border border-[#D8CCBB] text-xs text-[#625D57]">
              No comments currently flagged for moderation. Decorum intact.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded bg-[#EFE8DA] border border-amber-300 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#171717]">Report ID: {rep.id}</span>
                    <span className="text-amber-800 font-semibold uppercase text-[10px]">
                      Status: {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#171717]">
                    <strong>Reason for report:</strong> {rep.reason}
                  </p>
                  <div className="text-[11px] text-[#625D57]">
                    Reported by: {rep.reported_by} on {rep.created_at}
                  </div>
                  {rep.status === 'pending' && (
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1 bg-white border border-[#D8CCBB] rounded text-[#171717] hover:bg-[#D8CCBB]"
                      >
                        Dismiss Report (Approve Comment)
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'hide_comment')}
                        className="px-3 py-1 bg-red-700 text-white rounded font-semibold hover:bg-red-800"
                      >
                        Hide Comment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: USERS & ADMIN DELEGATION */}
      {activeTab === 'users' && (
        <div className="space-y-6 text-xs">
          {/* Governance Notice */}
          <div className="p-4 rounded-lg bg-[#EFE8DA] border border-[#B79558] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-[#681F2B]">
              <ShieldCheck className="w-4 h-4 text-[#B79558]" />
              <span>Administrator Governance & Role Delegation Protocol</span>
            </div>
            <p className="text-[#625D57] leading-relaxed">
              In accordance with security guidelines, the admin desk is restricted to{' '}
              <strong className="text-[#171717]">{ROOT_ADMIN_EMAIL}</strong> and administrators explicitly designated by this email address. All other community members and contributors are authenticated as normal debaters. Every sign-in requires an authentic 6-digit email verification code.
            </p>
          </div>

          {/* Root Admin Authority Panel */}
          <div className="p-5 rounded-lg bg-white border border-[#D8CCBB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8CCBB]/60">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#681F2B]">
                  Permanent Authority
                </div>
                <div className="text-base font-bold text-[#171717] flex items-center gap-2 mt-0.5">
                  <span>Muhammad Hadi</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#681F2B] text-[#F7F3EA] font-semibold">
                    Permanent Root Administrator
                  </span>
                </div>
                <div className="text-xs text-[#625D57] font-mono mt-0.5">{ROOT_ADMIN_EMAIL}</div>
              </div>

              <div className="text-[11px] text-[#625D57] sm:text-right">
                <span className="font-semibold text-emerald-800">Status: Active Root Sovereign</span>
                <div>Privilege: Assign & revoke administrative permissions</div>
              </div>
            </div>

            {/* If Root Admin is logged in, show the quick delegation form */}
            {isRootAdmin ? (
              <form onSubmit={handleAssignAdmin} className="space-y-2 pt-1">
                <label className="block font-semibold text-[#171717]">
                  Assign New Administrator by Email
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="colleague@society.org or debater@university.edu"
                      className="w-full pl-9 pr-3 py-2 bg-[#F7F3EA] border border-[#D8CCBB] rounded text-xs text-[#171717] focus:border-[#681F2B] focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Grant Admin Role</span>
                  </button>
                </div>
                <div className="text-[11px] text-[#625D57]">
                  Target email will receive administrative access to the Editorial CMS upon signing in.
                </div>
              </form>
            ) : (
              <div className="p-3 rounded bg-[#EFE8DA] border border-[#D8CCBB] text-[11px] text-[#625D57] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#B79558] shrink-0" />
                <span>
                  You are signed in as an Assigned Administrator. Role assignment and revocation can only be exercised by the Root Administrator (<strong className="text-[#171717]">{ROOT_ADMIN_EMAIL}</strong>).
                </span>
              </div>
            )}
          </div>

          {/* Directory of All Registered Debaters & Admins */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Community Accounts & Role Registry
                </h3>
                <p className="text-[11px] text-[#625D57]">
                  All authenticated members of the Ramz-e-Fikr debating society and editorial board.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#681F2B]">
                {allAccounts.length} Total Registered
              </span>
            </div>

            <div className="overflow-x-auto border border-[#D8CCBB] rounded-lg bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#EFE8DA] border-b border-[#D8CCBB] text-[#625D57] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Debater / Contributor</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Assigned Role</th>
                    <th className="py-2.5 px-3 text-right">Role Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CCBB]/60">
                  {allAccounts.map((account) => {
                    const isAccountRootAdmin = account.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
                    const isAccountAssignedAdmin = assignedAdmins.some(
                      (e) => e.toLowerCase() === account.email.toLowerCase()
                    );
                    const isAccountAdmin = isAccountRootAdmin || isAccountAssignedAdmin;

                    return (
                      <tr key={account.id} className="hover:bg-[#F7F3EA] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                            <span>{account.display_name}</span>
                            {isAccountRootAdmin && (
                              <span title="Root Administrator">
                                <Shield className="w-3.5 h-3.5 text-[#B79558]" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#625D57]">
                            Joined {new Date(account.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-[#171717]">
                          {account.email}
                        </td>

                        <td className="py-3 px-3 text-[#625D57]">
                          {account.institution || 'Independent'}
                        </td>

                        <td className="py-3 px-3 text-[#625D57]">
                          {account.format_preference || 'BP'}
                        </td>

                        <td className="py-3 px-3">
                          {isAccountRootAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#681F2B] text-[#F7F3EA]">
                              Root Admin
                            </span>
                          ) : isAccountAssignedAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <UserCheck className="w-3 h-3 text-emerald-700" />
                              Assigned Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EFE8DA] text-[#625D57] border border-[#D8CCBB]">
                              Normal Debater
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          {isAccountRootAdmin ? (
                            <span className="text-[11px] text-[#625D57] italic">Permanent Root</span>
                          ) : isRootAdmin ? (
                            isAccountAssignedAdmin ? (
                              <button
                                onClick={() => handleRevokeAdmin(account.email)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-semibold text-[11px] transition-colors"
                              >
                                Revoke Admin Role
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const res = store.assignAdmin(account.email);
                                  setActionSuccess(res.message);
                                  setTimeout(() => setActionSuccess(''), 4000);
                                }}
                                className="px-2.5 py-1 bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#681F2B] border border-[#B79558]/60 rounded font-semibold text-[11px] transition-colors"
                              >
                                Promote to Admin
                              </button>
                            )
                          ) : (
                            <span className="text-[11px] text-[#625D57]">Managed by Root Admin</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
