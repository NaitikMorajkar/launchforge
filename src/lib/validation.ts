/**
 * Shared client-side validation used by forms. The same rules are enforced
 * again by database CHECK constraints, so the client copy only improves UX.
 */

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!URL_PATTERN.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isEmail(value: string): boolean {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/** Returns an error message, or `null` when the value is acceptable. */
export function validateProjectInput(input: {
  name: string;
  tagline: string;
  description: string;
  category: string;
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
}): string | null {
  const name = input.name.trim();
  const tagline = input.tagline.trim();
  const description = input.description.trim();

  if (name.length < 2) return 'Project name must be at least 2 characters.';
  if (name.length > 80) return 'Project name must be 80 characters or fewer.';
  if (tagline.length < 4) return 'Tagline must be at least 4 characters.';
  if (tagline.length > 140) return 'Tagline must be 140 characters or fewer.';
  if (description.length < 10) return 'Please write at least 10 characters describing the project.';
  if (description.length > 4000) return 'Description must be 4,000 characters or fewer.';
  if (!input.category || input.category === 'All') return 'Please choose a category.';

  if (input.demoUrl && input.demoUrl.trim() && !isHttpUrl(input.demoUrl)) {
    return 'Demo URL must be a valid http(s) link.';
  }
  if (input.githubUrl && input.githubUrl.trim() && !isHttpUrl(input.githubUrl)) {
    return 'GitHub URL must be a valid http(s) link.';
  }
  if (input.image && input.image.trim() && !isHttpUrl(input.image)) {
    return 'Cover image must be a valid http(s) link.';
  }

  return null;
}

export const COMMENT_MAX_LENGTH = 1000;

export function validateComment(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 'Comment cannot be empty.';
  if (trimmed.length > COMMENT_MAX_LENGTH) {
    return `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

/** Normalise a free-form handle into "@handle" form. */
export function normalizeHandle(handle: string): string {
  const trimmed = handle.trim().replace(/^@+/, '');
  return trimmed ? `@${trimmed}` : '';
}
