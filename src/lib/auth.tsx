import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from '../types';
import { normalizeHandle } from './validation';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

interface AuthContextValue {
  /** True while the initial session is being resolved. */
  loading: boolean;
  /** True when a Supabase project is connected. */
  isConfigured: boolean;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  /** Transient error message from the most recent auth action. */
  error: string | null;
  clearError: () => void;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: 'github' | 'google') => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Map Supabase auth errors to messages that are safe & readable for users. */
function friendlyAuthError(raw: string | undefined | null): string {
  if (!raw) return 'Something went wrong. Please try again.';
  const msg = raw.toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (msg.includes('email not confirmed')) return 'Please confirm your email before signing in.';
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (msg.includes('password should be at least')) return 'Password must be at least 6 characters.';
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('signup is disabled')) return 'Sign-ups are currently disabled on this server.';
  return raw;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const buildProfile = useCallback(
    (u: User, existing?: Record<string, unknown> | null): UserProfile => {
      const meta = (u.user_metadata ?? {}) as Record<string, string>;
      const email = u.email ?? '';
      const fallbackName =
        meta.full_name || meta.name || meta.user_name || email.split('@')[0] || 'Innovator';
      return {
        id: u.id,
        displayName: (existing?.display_name as string) || fallbackName,
        handle: (existing?.handle as string) || normalizeHandle(meta.user_name || email.split('@')[0] || 'creator'),
        role: (existing?.role as string) || 'Creator',
        avatarUrl: (existing?.avatar_url as string) || meta.avatar_url || FALLBACK_AVATAR,
        email,
      };
    },
    []
  );

  /** Load (or lazily create) the profile row for the signed-in user. */
  const loadProfile = useCallback(
    async (u: User) => {
      if (!supabase) return;
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .maybeSingle();

        if (fetchError) {
          console.warn('Profile fetch failed:', fetchError.message);
          setProfile(buildProfile(u, null));
          return;
        }

        if (data) {
          setProfile(buildProfile(u, data));
          return;
        }

        // No profile row yet – create one from auth metadata.
        const initial = buildProfile(u, null);
        const { error: insertError } = await supabase.from('profiles').upsert(
          {
            id: u.id,
            display_name: initial.displayName,
            handle: initial.handle,
            role: initial.role,
            avatar_url: initial.avatarUrl,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
        if (insertError) console.warn('Profile create failed:', insertError.message);
        setProfile(initial);
      } catch (e) {
        console.warn('Profile load error:', e);
        setProfile(buildProfile(u, null));
      }
    },
    [supabase, buildProfile]
  );

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        if (data.session?.user) await loadProfile(data.session.user);
      })
      .finally(() => mounted && setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      if (newSession?.user) {
        // Fire-and-forget: awaiting supabase calls inside this listener can
        // deadlock during the initial session emission.
        void loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signUp = useCallback<AuthContextValue['signUp']>(
    async (email, password, displayName) => {
      setError(null);
      if (!supabase) return { error: 'Backend not connected.', needsConfirmation: false };
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: displayName?.trim() || undefined } },
      });
      if (signUpError) {
        const friendly = friendlyAuthError(signUpError.message);
        setError(friendly);
        return { error: friendly, needsConfirmation: false };
      }
      // If a session returned, email confirmation is disabled – sign in directly.
      const needsConfirmation = !data.session;
      return { error: null, needsConfirmation };
    },
    [supabase]
  );

  const signIn = useCallback<AuthContextValue['signIn']>(
    async (email, password) => {
      setError(null);
      if (!supabase) return { error: 'Backend not connected.' };
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        const friendly = friendlyAuthError(signInError.message);
        setError(friendly);
        return { error: friendly };
      }
      return { error: null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setError(null);
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, [supabase]);

  const resetPassword = useCallback<AuthContextValue['resetPassword']>(
    async (email) => {
      setError(null);
      if (!supabase) return { error: 'Backend not connected.' };
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (resetError) {
        const friendly = friendlyAuthError(resetError.message);
        setError(friendly);
        return { error: friendly };
      }
      return { error: null };
    },
    [supabase]
  );

  const signInWithOAuth = useCallback<AuthContextValue['signInWithOAuth']>(
    async (provider) => {
      setError(null);
      if (!supabase) return { error: 'Backend not connected.' };
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (oauthError) {
        const friendly = friendlyAuthError(oauthError.message);
        setError(friendly);
        return { error: friendly };
      }
      return { error: null };
    },
    [supabase]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      isConfigured: isSupabaseConfigured,
      user: session?.user ?? null,
      session,
      profile,
      error,
      clearError: () => setError(null),
      signUp,
      signIn,
      signOut,
      resetPassword,
      signInWithOAuth,
    }),
    [loading, session, profile, error, signUp, signIn, signOut, resetPassword, signInWithOAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
