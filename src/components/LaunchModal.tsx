import React, { useState } from 'react';
import { CategoryType, Project, UserProfile } from '../types';
import { X, Rocket, Sparkles, Image as ImageIcon, Link2, Github, Tag, Check, AlertCircle } from 'lucide-react';
import { validateProjectInput } from '../lib/validation';

type ProjectDraft = Omit<Project, 'id' | 'likes' | 'views' | 'creator' | 'launchedAt'>;

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchProject: (draft: ProjectDraft) => Promise<void>;
  profile: UserProfile | null;
  theme?: 'dark' | 'light';
}

const CATEGORIES: CategoryType[] = [
  'AI', 'Web Development', 'Mobile', 'Robotics', 'FinTech',
  'Gaming', 'Education', 'Open Source', 'Design', 'Other'
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
];

const MAX_TAGS = 8;

export const LaunchModal: React.FC<LaunchModalProps> = ({
  isOpen,
  onClose,
  onLaunchProject,
  profile,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('AI');
  const [tagsInput, setTagsInput] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  if (!isOpen) return null;

  const creatorName = profile?.displayName || 'You';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateProjectInput({
      name, tagline, description, category, demoUrl, githubUrl, image: selectedImage,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, MAX_TAGS);

    const draft: ProjectDraft = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      fullDescription: description.trim(),
      category,
      tags: tags.length > 0 ? tags : [category],
      image: selectedImage,
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      techStack: tags.length > 0 ? tags : undefined,
      milestones: [],
      comments: [],
    };

    setIsSubmitting(true);
    setError('');
    try {
      await onLaunchProject(draft);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish your project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh] transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-slate-900/10'
            : 'bg-[#0b1120] border-cyan-500/30 text-slate-100 shadow-cyan-500/10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-xl font-bold font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>Forge Your Launch</h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Publishing as <span className="font-semibold text-cyan-500">{creatorName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className={`p-2 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle (Form / Preview) */}
        <div className={`flex border-b px-6 pt-2 ${
          isLight ? 'border-slate-200 bg-slate-100/50' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'form'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Card Preview
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'form' ? (
            <form id="launch-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Project Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g. Chronos Engine"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  One-line Elevator Pitch / Tagline *
                </label>
                <input
                  type="text"
                  required
                  maxLength={140}
                  placeholder="e.g. Distributed high-speed ray-tracing cluster in WebGPU"
                  value={tagline}
                  onChange={(e) => {
                    setTagline(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Project Description *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={4000}
                  placeholder="What problem does this project solve? What makes it technically or creatively innovative?"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tags (comma separated, max {MAX_TAGS})
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="AI, WebGPU, Rust, Open Source"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Live Demo URL (optional)
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="url"
                      placeholder="https://yourproject.dev"
                      value={demoUrl}
                      onChange={(e) => {
                        setDemoUrl(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub / Source URL (optional)
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="url"
                      placeholder="https://github.com/your/repo"
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Showcase Banner Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Showcase Visual
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_IMAGES.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === imgUrl ? 'border-cyan-400 ring-2 ring-cyan-500/40' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset visual" className="w-full h-full object-cover" />
                      {selectedImage === imgUrl && (
                        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator details come from the signed-in profile */}
              <div className="pt-2 border-t border-slate-800/80">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Credited to your account
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={profile?.avatarUrl}
                    alt={creatorName}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-white">{creatorName}</p>
                    <p className="text-slate-400">
                      {profile?.role || 'Creator'} · <span className="text-cyan-400">{profile?.handle}</span>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Live Card Preview Tab */
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center">
              <p className="text-xs text-cyan-400 mb-3 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Card Render Preview:
              </p>
              <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/40 shadow-xl">
                <div className="relative h-44 bg-slate-950">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-white/10">
                    {category}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-base font-bold text-white">{name || 'Your Project Name'}</h4>
                  <p className="text-xs text-cyan-400 font-medium line-clamp-1">{tagline || 'Your one-line elevator pitch goes here'}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{description || 'Detailed project synopsis and innovations will be displayed here for the community.'}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>by {creatorName}</span>
                    <span className="text-cyan-400 font-semibold">New launch</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="launch-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing…' : 'Launch on LaunchForge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
