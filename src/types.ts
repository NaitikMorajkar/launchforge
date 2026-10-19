export type CategoryType = 
  | 'All'
  | 'AI'
  | 'Web Development'
  | 'Mobile'
  | 'Robotics'
  | 'FinTech'
  | 'Gaming'
  | 'Education'
  | 'Open Source'
  | 'Design'
  | 'Other';

export type SortFilterType = 'Trending' | 'Recently Launched' | 'Most Popular' | 'Featured';

export interface Creator {
  name: string;
  avatar: string;
  role: string;
  handle: string;
}

export interface ProjectComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
  /** Auth id of the comment author (present for persisted comments). */
  authorId?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  creator: Creator;
  category: CategoryType;
  tags: string[];
  image: string;
  likes: number;
  views: number;
  featured?: boolean;
  trending?: boolean;
  launchedAt: string;
  demoUrl?: string;
  githubUrl?: string;
  upvoted?: boolean;
  comments?: ProjectComment[];
  milestones?: string[];
  techStack?: string[];
  /** Auth id of the project owner (present for persisted projects). */
  userId?: string;
  /** True for built-in showcase/demo entries shipped with the product. */
  isSample?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  project: string;
  text: string;
  rating: number;
  metric: string;
}

export interface PlatformStats {
  projectsLaunched: number;
  creatorsCount: number;
  monthlyViews: string;
  activeCategories: number;
}

/** The authenticated user's public profile. */
export interface UserProfile {
  id: string;
  displayName: string;
  handle: string;
  role: string;
  avatarUrl: string;
  email?: string;
}
