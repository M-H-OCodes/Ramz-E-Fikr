import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Reply, Flag, Trash2, Shield, User, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { useDataStore } from '../services/store';
import { Comment } from '../types';

interface CommentSectionProps {
  contentType: 'article' | 'resource' | 'motion';
  contentSlug: string;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  contentType,
  contentSlug,
  onOpenAuth
}) => {
  const store = useDataStore();
  const currentUser = store.getCurrentUser();
  const comments = store.getComments(contentType, contentSlug);

  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes'>('newest');

  const isLoggedIn = currentUser !== null;

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return b.upvotes - a.upvotes;
  });

  const parentComments = sortedComments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) => sortedComments.filter((c) => c.parent_id === parentId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signin');
      return;
    }
    store.addComment(contentType, contentSlug, commentText);
    setCommentText('');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyText.trim()) return;
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signin');
      return;
    }
    store.addComment(contentType, contentSlug, replyText, parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  const handleReport = (commentId: string) => {
    if (!reportReason.trim()) return;
    store.reportComment(commentId, reportReason);
    setReportingCommentId(null);
    setReportReason('');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-[#D8CCBB]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-urdu text-sm text-[#681F2B] font-semibold">مباحثہ و آراء</div>
          <h3 className="font-editorial text-2xl font-bold text-[#171717] flex items-center gap-2">
            <span>Scholarly Commentary</span>
            <span className="text-sm font-sans font-normal text-[#625D57]">
              ({comments.length})
            </span>
          </h3>
          <p className="text-xs text-[#625D57] mt-0.5">
            Constructive analysis, counter-arguments, and strategic refinements.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#625D57]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-[#EFE8DA] border border-[#D8CCBB] rounded text-[#171717]"
          >
            <option value="newest">Newest First</option>
            <option value="upvotes">Most Commended</option>
            <option value="oldest">Earliest First</option>
          </select>
        </div>
      </div>

      {/* New Comment Box / Login Prompt */}
      {!isLoggedIn ? (
        <div className="p-5 rounded-lg bg-[#EFE8DA] border border-[#B79558]/70 text-xs text-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shadow-xs">
          <div className="space-y-1">
            <div className="font-semibold text-sm text-[#681F2B] flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Join the Scholarly Discourse</span>
            </div>
            <p className="text-xs text-[#625D57] leading-relaxed max-w-xl">
              Public visitors can freely read all arguments and commentary. To post your own critique, rebuttal, or reply, please sign in or register an account.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : null}
              className="px-3.5 py-2 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] rounded font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Comment</span>
            </button>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : null}
              className="px-3.5 py-2 bg-white hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] rounded font-semibold text-xs transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePostComment} className="mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#625D57]">
            <span className="font-semibold text-[#171717]">{currentUser.display_name}</span>
            <span>·</span>
            <span className="capitalize text-[#681F2B] font-bold">{currentUser.role}</span>
            {currentUser.institution && (
              <>
                <span>·</span>
                <span className="text-[#B79558]">{currentUser.institution}</span>
              </>
            )}
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Contribute your critique, alternative weighing metric, or empirical precedent..."
            rows={3}
            className="w-full p-3 text-sm bg-white border border-[#D8CCBB] rounded-md focus:border-[#681F2B] focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#625D57]">
              Adhere to academic decorum. Ground claims in mechanisms rather than dogma.
            </span>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-[#681F2B] hover:bg-[#48151E] disabled:opacity-50 text-[#F7F3EA] text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Post Commentary
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {parentComments.length === 0 ? (
          <div className="text-center py-10 rounded bg-[#EFE8DA]/50 border border-dashed border-[#D8CCBB] text-xs text-[#625D57]">
            No commentary has been recorded for this entry yet. Be the first to establish a perspective.
          </div>
        ) : (
          parentComments.map((comment) => {
            const replies = getReplies(comment.id);
            const isAuthor = currentUser && comment.user_id === currentUser.id;
            const canModerate = currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator');

            return (
              <div
                key={comment.id}
                className="p-5 rounded-md bg-[#EFE8DA]/70 border border-[#D8CCBB] space-y-3"
              >
                {/* Comment Metadata */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#171717]">{comment.user_name}</span>
                    <span className="text-[#625D57]">·</span>
                    <span className="capitalize text-[11px] text-[#681F2B] font-medium">
                      {comment.user_role}
                    </span>
                    {comment.user_institution && (
                      <>
                        <span className="text-[#625D57]">·</span>
                        <span className="text-[11px] text-[#625D57]">{comment.user_institution}</span>
                      </>
                    )}
                    <span className="text-[#625D57]">·</span>
                    <span className="text-[#625D57]">{formatDate(comment.created_at)}</span>
                  </div>

                  {comment.status === 'flagged' && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Under Review
                    </span>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-sm text-[#171717] leading-relaxed whitespace-pre-line">
                  {comment.comment_text}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 pt-2 text-xs text-[#625D57]">
                  <button
                    onClick={() => store.upvoteComment(comment.id)}
                    className="flex items-center gap-1.5 hover:text-[#681F2B] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.upvotes}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        if (onOpenAuth) onOpenAuth('signin');
                        return;
                      }
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    }}
                    className="flex items-center gap-1 hover:text-[#681F2B] transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  {(isAuthor || canModerate) && (
                    <button
                      onClick={() => store.deleteComment(comment.id)}
                      className="flex items-center gap-1 text-red-700 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    onClick={() => setReportingCommentId(comment.id)}
                    className="flex items-center gap-1 hover:text-amber-800 transition-colors ml-auto text-[11px]"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-3 pt-3 border-t border-[#D8CCBB]/60 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.user_name}...`}
                      rows={2}
                      className="w-full p-2.5 text-xs bg-white border border-[#D8CCBB] rounded focus:border-[#681F2B] focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 text-xs text-[#625D57] hover:bg-[#D8CCBB] rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        className="px-3 py-1 bg-[#681F2B] text-[#F7F3EA] text-xs font-semibold rounded"
                      >
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-[#D8CCBB] space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id} className="pt-2 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-[#625D57]">
                          <span className="font-bold text-[#171717]">{reply.user_name}</span>
                          <span>·</span>
                          <span className="text-[11px]">{formatDate(reply.created_at)}</span>
                          {currentUser && (reply.user_id === currentUser.id || canModerate) && (
                            <button
                              onClick={() => store.deleteComment(reply.id)}
                              className="text-red-700 hover:underline ml-auto"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-[#171717] leading-relaxed">
                          {reply.comment_text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {reportingCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-[#F7F3EA] border border-[#D8CCBB] rounded-lg p-5 shadow-xl space-y-3 text-xs">
            <h4 className="font-editorial text-base font-bold text-[#171717] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Report Commentary to Editorial Moderation</span>
            </h4>
            <p className="text-[#625D57]">
              Specify why this comment violates debate decorum, academic standards, or Community Guidelines:
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g. Ad hominem attack, hate speech, plagiarism, or off-topic disruption..."
              rows={3}
              className="w-full p-2.5 bg-white border border-[#D8CCBB] rounded focus:border-[#681F2B] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportingCommentId(null)}
                className="px-3 py-1.5 text-[#625D57] hover:bg-[#EFE8DA] rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReport(reportingCommentId)}
                className="px-4 py-1.5 bg-[#681F2B] text-[#F7F3EA] font-semibold rounded hover:bg-[#48151E]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
