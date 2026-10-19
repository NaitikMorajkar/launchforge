import React, { useState } from 'react';
import { Project } from '../types';
import { 
  X, ExternalLink, Github, Heart, Calendar, Sparkles, 
  Send, CheckCircle2, Share2, Layers, MessageSquare, Trash2, AlertCircle,
  MonitorPlay, Info 
} from 'lucide-react';
import { useComments } from '../lib/projects';
import { validateComment, COMMENT_MAX_LENGTH } from '../lib/validation';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  isLiked?: boolean;
  onToggleLike: (id: string) => void;
  currentUser: { id: string; name: string; avatar: string } | null;
  /** Returns true when the user is signed in (opens sign-in otherwise). */
  onRequireAuth: () => boolean;
  onDelete?: (id: string) => void;
  /** Opens a LOCAL demo page in the in-app sandboxed preview (keeps users here). */
  onOpenDemoPreview?: (src: string, title: string) => void;
  theme?: 'dark' | 'light';
}

/** True for locally-shipped previews (e.g. /demos/saas.html) vs external URLs. */
const isLocalDemoPath = (url?: string) =>
  Boolean(url && (url.startsWith('/demos/') || url.startsWith('./demos/')));

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  isLiked = false,
  onToggleLike,
  currentUser,
  onRequireAuth,
  onDelete,
  onOpenDemoPreview,
  theme = 'dark',
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isLight = theme === 'light';

  const { comments: backendComments, add } = useComments(project?.id);

  if (!project) return null;

  const isSample = Boolean(project.isSample);
  // Sample entries show their bundled illustrative discussion whenever the
  // database has nothing for them (they exist only client-side). The UI labels
  // this as sample content and hides the composer so nothing pretends to be a
  // real community thread.
  const comments =
    backendComments.length > 0
      ? backendComments
      : isSample
        ? project.comments ?? []
        : [];

  const isOwner = Boolean(currentUser && project.userId && currentUser.id === project.userId);

  const handleLike = () => {
    onToggleLike(project.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      onDelete(project.id);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPosting) return;
    if (!onRequireAuth() || !currentUser) return;

    const validationError = validateComment(newCommentText);
    if (validationError) {
      setCommentError(validationError);
      return;
    }

    setIsPosting(true);
    setCommentError(null);
    try {
      await add(currentUser.id, newCommentText.trim());
      setNewCommentText('');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Could not post your comment.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />

      <div 
        className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8">
          {/* Header Banner Image */}
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                    {project.category}
                  </span>
                  {project.isSample && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                      Sample showcase
                    </span>
                  )}
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Launched {project.launchedAt}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  {project.name}
                </h1>
                <p className="text-sm md:text-base text-cyan-300/90 font-medium mt-1">
                  {project.tagline}
                </p>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isLiked
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{project.likes} Upvotes</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                  title="Copy share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {isOwner && onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white border border-red-500/40 transition-colors"
                    title="Delete project (owner only)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {copiedLink && (
                  <span className="absolute -top-8 right-6 text-xs bg-cyan-600 text-white px-2.5 py-1 rounded-md shadow">
                    Link Copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links & CTA Toolbar */}
          <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            {/* Creator Profile */}
            <div className="flex items-center gap-3">
              <img
                src={project.creator.avatar}
                alt={project.creator.name}
                className="w-11 h-11 rounded-full object-cover border border-cyan-400/40"
              />
              <div>
                <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{project.creator.name}</p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {project.creator.role} • <span className="text-cyan-600 dark:text-cyan-400">{project.creator.handle}</span>
                </p>
              </div>
            </div>

            {/* External Action Links */}
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {project.demoUrl &&
                (isLocalDemoPath(project.demoUrl) ? (
                  /* Local preview: open inside LaunchForge's sandboxed host
                     instead of navigating away from the app. */
                  <button
                    onClick={() =>
                      onOpenDemoPreview?.(project.demoUrl!, project.name)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <span>Live Preview</span>
                    <MonitorPlay className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-4">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Project Vision & Overview
            </h2>
            <p className={`leading-relaxed text-sm md:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Tech Stack & Architecture */}
          <div className="space-y-3">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <Layers className="w-4 h-4 text-violet-500" />
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {(project.techStack || project.tags).map((tech, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-slate-100 text-slate-800 border-slate-200' 
                      : 'bg-slate-800/90 text-cyan-200 border border-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones & Progress */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="space-y-3">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Key Milestones & Traction
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {project.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700' 
                        : 'bg-slate-800/50 border-slate-800 text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Discussion Section */}
          <div className={`pt-6 border-t space-y-5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <MessageSquare className="w-4 h-4 text-cyan-500" />
                {isSample ? 'Sample Discussion' : 'Community Feedback & Discussion'} ({comments.length})
              </h2>
              {isSample && (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  isLight
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  Illustrative example — not real user comments
                </span>
              )}
            </div>

            {commentError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{commentError}</span>
              </div>
            )}

            {/* Comment Input — built-in samples are read-only */}
            {isSample ? (
              <div
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs ${
                  isLight
                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : 'bg-slate-950/50 text-slate-400 border-slate-800'
                }`}
              >
                <Info className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>
                  This is a built-in example, so discussion here is read-only.
                  Launch your own project to gather real feedback from the
                  community.
                </span>
              </div>
            ) : (
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="flex items-start gap-2">
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0" />
                )}
                <input
                  type="text"
                  maxLength={COMMENT_MAX_LENGTH}
                  placeholder={currentUser ? 'Leave constructive feedback or ask a question…' : 'Sign in to leave feedback'}
                  value={newCommentText}
                  onChange={(e) => {
                    setNewCommentText(e.target.value);
                    setCommentError(null);
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none transition-colors border ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500' 
                      : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-500'
                  }`}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim() || isPosting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPosting ? 'Posting…' : 'Post Feedback'}</span>
                </button>
              </div>
            </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover border border-cyan-500/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{comment.author}</span>
                        <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                      </div>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-6 text-xs rounded-xl border border-dashed ${
                  isLight 
                    ? 'text-slate-500 bg-slate-50 border-slate-200' 
                    : 'text-slate-500 bg-slate-950/40 border-slate-800'
                }`}>
                  Be the first innovator to leave feedback for {project.name}!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
