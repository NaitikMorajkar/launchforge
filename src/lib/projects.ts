import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { CategoryType, Project, ProjectComment } from '../types';

const CREATOR_JOIN = 'creator:profiles(display_name, avatar_url, role, handle)';
const COMMENT_AUTHOR_JOIN = 'author:profiles(display_name, avatar_url)';

export interface NewProjectInput {
  name: string;
  tagline: string;
  description: string;
  category: CategoryType;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  techStack?: string[];
}

/** Format an ISO timestamp into a short relative label. */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return 'Just now';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Just now';
  const diffMs = Date.now() - then;
  const sec = Math.round(diffMs / 1000);
  if (sec < 45) return 'Just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month}mo ago`;
  return `${Math.round(month / 12)}y ago`;
}

interface CreatorRow {
  display_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  handle?: string | null;
}

interface ProjectRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  full_description?: string | null;
  category: string;
  tags?: string[] | null;
  image?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  tech_stack?: string[] | null;
  milestones?: string[] | null;
  featured?: boolean | null;
  trending?: boolean | null;
  is_sample?: boolean | null;
  view_count?: number | null;
  like_count?: number | null;
  user_id?: string | null;
  launched_at?: string | null;
  creator?: CreatorRow | CreatorRow[] | null;
}

function unwrapCreator(raw: CreatorRow | CreatorRow[] | null | undefined) {
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export function rowToProject(row: ProjectRow): Project {
  const creator = unwrapCreator(row.creator);
  const name = creator?.display_name ?? 'LaunchForge Creator';
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    fullDescription: row.full_description ?? row.description,
    creator: {
      name,
      avatar: creator?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: creator?.role || 'Creator',
      handle: creator?.handle || '@creator',
    },
    category: row.category as CategoryType,
    tags: row.tags ?? [],
    image: row.image || '',
    likes: row.like_count ?? 0,
    views: row.view_count ?? 0,
    featured: row.featured ?? false,
    trending: row.trending ?? false,
    launchedAt: formatRelativeTime(row.launched_at),
    demoUrl: row.demo_url || undefined,
    githubUrl: row.github_url || undefined,
    techStack: row.tech_stack ?? undefined,
    milestones: row.milestones ?? undefined,
    userId: row.user_id ?? undefined,
    isSample: row.is_sample ?? false,
  };
}

interface CommentRow {
  id: string;
  text: string;
  user_id?: string | null;
  created_at?: string | null;
  author?: CreatorRow | CreatorRow[] | null;
}

function rowToComment(row: CommentRow): ProjectComment {
  const author = unwrapCreator(row.author);
  return {
    id: row.id,
    author: author?.display_name ?? 'Community Member',
    avatar:
      author?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: row.text,
    createdAt: formatRelativeTime(row.created_at),
    authorId: row.user_id ?? undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Project operations                                                 */
/* ------------------------------------------------------------------ */

export async function fetchProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select(`*, ${CREATOR_JOIN}`)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchProjects error:', error.message);
    throw new Error(error.message);
  }
  return (data as unknown as ProjectRow[]).map(rowToProject);
}

export async function createProject(
  input: NewProjectInput,
  userId: string
): Promise<Project> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Backend not connected.');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      full_description: input.description,
      category: input.category,
      tags: input.tags,
      image: input.image,
      demo_url: input.demoUrl || null,
      github_url: input.githubUrl || null,
      tech_stack: input.techStack ?? input.tags,
      milestones: [],
    })
    .select(`*, ${CREATOR_JOIN}`)
    .single();

  if (error) throw new Error(error.message);
  return rowToProject(data as unknown as ProjectRow);
}

export async function deleteProject(projectId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Backend not connected.');
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw new Error(error.message);
}

export async function incrementView(projectId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  // security-definer RPC – see migration 0001.
  await supabase.rpc('increment_project_view', { project_id: projectId });
}

/* ------------------------------------------------------------------ */
/*  Likes                                                              */
/* ------------------------------------------------------------------ */

export async function fetchLikedProjectIds(userId: string): Promise<Set<string>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();
  const { data, error } = await supabase
    .from('project_likes')
    .select('project_id')
    .eq('user_id', userId);
  if (error) {
    console.error('fetchLikedProjectIds error:', error.message);
    return new Set();
  }
  return new Set((data ?? []).map((r) => r.project_id as string));
}

/** Toggle a like. Returns the new liked state (true = liked). */
export async function setProjectLike(
  projectId: string,
  userId: string,
  liked: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Backend not connected.');
  if (liked) {
    // ON CONFLICT DO NOTHING makes double-likes impossible.
    const { error } = await supabase
      .from('project_likes')
      .upsert({ project_id: projectId, user_id: userId }, { onConflict: 'project_id,user_id', ignoreDuplicates: true });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('project_likes')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}

/* ------------------------------------------------------------------ */
/*  Comments                                                           */
/* ------------------------------------------------------------------ */

export async function fetchComments(projectId: string): Promise<ProjectComment[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('project_comments')
    .select(`*, ${COMMENT_AUTHOR_JOIN}`)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchComments error:', error.message);
    return [];
  }
  return (data as unknown as CommentRow[]).map(rowToComment);
}

export async function addComment(
  projectId: string,
  userId: string,
  text: string
): Promise<ProjectComment> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Backend not connected.');
  const { data, error } = await supabase
    .from('project_comments')
    .insert({ project_id: projectId, user_id: userId, text })
    .select(`*, ${COMMENT_AUTHOR_JOIN}`)
    .single();
  if (error) throw new Error(error.message);
  return rowToComment(data as unknown as CommentRow);
}

/* ------------------------------------------------------------------ */
/*  React hooks                                                        */
/* ------------------------------------------------------------------ */

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchProjects();
      setProjects(rows);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { projects, setProjects, loading, error, refresh };
}

export function useProjectLikes(userId: string | undefined) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    if (!userId) {
      setLikedIds(new Set());
      return;
    }
    void fetchLikedProjectIds(userId).then((ids) => {
      if (mounted) setLikedIds(ids);
    });
    return () => {
      mounted = false;
    };
  }, [userId]);

  const toggleLike = useCallback(
    async (projectId: string) => {
      if (!userId) throw new Error('Sign in to upvote projects.');
      const currentlyLiked = likedIds.has(projectId);
      // Optimistic update, revert on failure.
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.delete(projectId);
        else next.add(projectId);
        return next;
      });
      try {
        await setProjectLike(projectId, userId, !currentlyLiked);
      } catch (e) {
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (currentlyLiked) next.add(projectId);
          else next.delete(projectId);
          return next;
        });
        throw e;
      }
    },
    [userId, likedIds]
  );

  return { likedIds, toggleLike };
}

export function useComments(projectId: string | undefined) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!projectId || !isSupabaseConfigured) {
      setComments([]);
      return;
    }
    setLoading(true);
    void fetchComments(projectId).then((rows) => {
      if (mounted) {
        setComments(rows);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const add = useCallback(
    async (userId: string, text: string) => {
      if (!projectId) return;
      const comment = await addComment(projectId, userId, text);
      setComments((prev) => [comment, ...prev]);
    },
    [projectId]
  );

  return { comments, loading, add };
}

export { isSupabaseConfigured };
