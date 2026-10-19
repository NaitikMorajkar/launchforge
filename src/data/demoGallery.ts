/**
 * Interactive demo gallery metadata.
 *
 * Every entry points at a fully self-contained HTML page under `public/demos/`
 * that ships with the product. They are rendered inside LaunchForge through a
 * sandboxed iframe (see DemoPreviewModal) so visitors can interact with a real,
 * working website preview without leaving this app — and without loading any
 * untrusted third-party code. All demos run client-side and work in demo mode
 * (no Supabase required).
 */

export type DemoKind =
  | 'portfolio'
  | 'store'
  | 'saas'
  | 'analytics'
  | 'chat'
  | 'repos'
  | 'agency'
  | 'learning';

export interface DemoItem {
  /** Stable id (also the filename under /demos, minus extension). */
  id: string;
  name: string;
  category: string;
  description: string;
  /** Local, sandbox-served preview page. Never an external origin. */
  src: string;
  /** Accent colour used by the card thumbnail. */
  accent: string;
  /** Thumbnail layout selector. */
  kind: DemoKind;
  icon: string;
  /** Short bullet points shown in the card. */
  features: string[];
  /** Extra detail revealed by "View Details". */
  details: string;
}

export const DEMO_GALLERY: DemoItem[] = [
  {
    id: 'portfolio',
    name: 'Personal Portfolio',
    category: 'Portfolio',
    description:
      'A single-page creator portfolio with tabbed navigation, skill chips and a working contact form.',
    src: '/demos/portfolio.html',
    accent: '#8b5cf6',
    kind: 'portfolio',
    icon: '🎨',
    features: ['Tabbed nav', 'Skill chips', 'Contact form'],
    details:
      'Includes three switchable views (Home / Work / Contact), a responsive two-column hero, a project grid, and client-side form validation with a success toast.',
  },
  {
    id: 'ecommerce',
    name: 'Storefront',
    category: 'E-commerce',
    description:
      'A product grid with category filters and a sliding cart drawer — add, remove and check out.',
    src: '/demos/ecommerce.html',
    accent: '#f59e0b',
    kind: 'store',
    icon: '🛍️',
    features: ['Cart drawer', 'Live filters', 'Checkout flow'],
    details:
      'Eight sample products, category filtering, an animated cart drawer with quantity totals, and a simulated checkout — no payment or network calls involved.',
  },
  {
    id: 'saas',
    name: 'SaaS Landing Page',
    category: 'SaaS',
    description:
      'A conversion-focused landing page with a monthly/yearly pricing toggle and feature grid.',
    src: '/demos/saas.html',
    accent: '#06b6d4',
    kind: 'saas',
    icon: '🚀',
    features: ['Pricing toggle', 'Feature grid', 'Sticky nav'],
    details:
      'Hero section with gradient headline, a billing switch that recalculates three plans live, a "most popular" plan highlight and six feature cards.',
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    category: 'Dashboard',
    description:
      'A multi-view dashboard with KPI cards, animated charts and a working sidebar navigation.',
    src: '/demos/analytics.html',
    accent: '#10b981',
    kind: 'analytics',
    icon: '📊',
    features: ['Live sidebar', 'Animated bars', 'Data tables'],
    details:
      'Four KPI cards, an animated revenue bar chart across three date ranges, an SVG donut chart, plus Orders / Customers / Settings views that switch in place.',
  },
  {
    id: 'chatbot',
    name: 'AI Chat Interface',
    category: 'AI',
    description:
      'A fully client-side chatbot UI with typing indicators, quick prompts and scripted replies.',
    src: '/demos/chatbot.html',
    accent: '#8b5cf6',
    kind: 'chat',
    icon: '🤖',
    features: ['Typing indicator', 'Quick prompts', 'Message history'],
    details:
      'Simulated streaming responses, keyword-matched replies, suggestion chips, message animations and a clear-chat action. Nothing is transmitted anywhere.',
  },
  {
    id: 'devshowcase',
    name: 'Developer Showcase',
    category: 'Developer Tools',
    description:
      'A repo discovery page with language filtering, star counts and a contribution heatmap.',
    src: '/demos/devshowcase.html',
    accent: '#6366f1',
    kind: 'repos',
    icon: '💻',
    features: ['Language filter', 'Repo cards', 'Contribution graph'],
    details:
      'Eight open-source project cards with star/fork stats, pill-based language filtering with colour dots, and a procedurally generated 26-week contribution heatmap.',
  },
  {
    id: 'agency',
    name: 'Modern Agency Site',
    category: 'Agency',
    description:
      'A bold studio site with a scrolling marquee, service cards and a portfolio masonry grid.',
    src: '/demos/agency.html',
    accent: '#ec4899',
    kind: 'agency',
    icon: '✨',
    features: ['Client marquee', 'Portfolio grid', 'Serif art direction'],
    details:
      'Editorial serif typography, an infinite CSS marquee of services, three service cards, four case-study tiles with hover reveals and smooth-scroll navigation.',
  },
  {
    id: 'education',
    name: 'Learning Platform',
    category: 'Education',
    description:
      'A course catalog with progress rings, live search and interactive lesson checklists.',
    src: '/demos/education.html',
    accent: '#10b981',
    kind: 'learning',
    icon: '🎓',
    features: ['Progress ring', 'Lesson checklist', 'Live search'],
    details:
      'Six courses with category filters and instant search, togglable lesson checklists that drive per-course progress bars, and an overall SVG progress ring.',
  },
];
