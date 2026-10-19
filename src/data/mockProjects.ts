import { Project, Testimonial } from '../types';

/**
 * Built-in showcase content (the original LaunchForge demo catalogue).
 *
 * These entries render an attractive layout out of the box — with or without a
 * backend ("demo mode"). Rules that keep them honest:
 *
 * - Every entry carries `isSample: true` and is badged "Sample showcase" in the
 *   UI, so sample projects are never presented as real user submissions.
 * - Creator personas are FICTIONAL demo personas (handles prefixed `demo_`),
 *   not real LaunchForge accounts.
 * - `demoUrl` points at LOCAL, working preview pages under `public/demos/`
 *   (openable inside LaunchForge via the sandboxed preview modal) instead of
 *   dead placeholder links.
 * - Sample discussion comments are illustrative only and labelled as such.
 * - Stats here are static showcase figures; real projects get their numbers
 *   from the database.
 *
 * Once Supabase is configured, genuine projects are listed alongside these
 * clearly-labelled examples.
 */
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'sample-mostar',
    name: 'Mostar City — Cinematic Scroll',
    tagline: 'Multi-plane parallax scroll story with custom depth & physics',
    description:
      'A cinematic three-screen scroll story for Mostar city, featuring stone arch splitframes, Neretva emerald water, and an interactive sights slider.',
    fullDescription:
      'Mostar City explores the intersection of documentary storytelling and web graphics choreography. Built with multi-layer transparent depth planes, eased smoothstep camera orbits, pointer-driven parallax, and a normalized sight carousel.',
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Creative Technologist',
      handle: '@demo_elena',
    },
    category: 'Design',
    tags: ['Parallax', 'Cinematic Scroll', 'Interactive Story'],
    image:
      'https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png',
    likes: 128,
    views: 1420,
    featured: true,
    trending: true,
    launchedAt: 'Showcase',
    demoUrl: '/demos/agency.html',
    techStack: ['TypeScript', 'CSS Variables', 'Parallax Engine'],
    milestones: ['Designed to demonstrate the cinematic hero experience'],
    comments: [
      {
        id: 'c-mostar-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'The parallax depth on the arch splitframes is gorgeous — the scroll pacing never feels rushed.',
        createdAt: 'Sample feedback',
      },
      {
        id: 'c-mostar-2',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'Would love to see the sights slider on mobile — the interaction model is really clean.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-neuralcanvas',
    name: 'NeuralCanvas 3D',
    tagline: 'Real-time generative spatial scene synthesis in browser',
    description:
      'Turn natural language prompts into immersive WebGL 3D scenes with physics and real-time lighting.',
    fullDescription:
      'A concept showcase for browser-native generative 3D: speak or type a description and get a navigable environment with procedural materials, dynamic lighting, and exportable geometry.',
    creator: {
      name: 'Marcus Vale',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Graphics Engineer',
      handle: '@demo_marcus',
    },
    category: 'AI',
    tags: ['WebGL', 'Generative AI', 'Three.js'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    likes: 96,
    views: 1180,
    featured: true,
    trending: true,
    launchedAt: 'Showcase',
    demoUrl: '/demos/chatbot.html',
    techStack: ['React', 'Three.js', 'WebGPU'],
    comments: [
      {
        id: 'c-neural-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'Prompt-to-scene in the browser still feels like science fiction. The lighting pass is the standout.',
        createdAt: 'Sample feedback',
      },
      {
        id: 'c-neural-2',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        text: 'Exportable geometry is the killer feature for pipeline folks.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-kiteos',
    name: 'KiteOS Autonomous Drone',
    tagline: 'Open-source sub-centimeter visual SLAM flight stack',
    description:
      'Autonomous micro-aerial navigation without GPS using stereo optical flow and edge perception.',
    fullDescription:
      'A concept for lightweight drones with spatial awareness inside forests, tunnels, and indoor spaces, powered by an efficient SLAM engine on edge microcontrollers.',
    creator: {
      name: 'Priya Nandakumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Robotics Researcher',
      handle: '@demo_priya',
    },
    category: 'Robotics',
    tags: ['Autonomous', 'SLAM', 'Computer Vision'],
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    likes: 74,
    views: 990,
    featured: true,
    trending: false,
    launchedAt: 'Showcase',
    demoUrl: '/demos/analytics.html',
    techStack: ['C++', 'OpenCV', 'ROS2'],
    comments: [
      {
        id: 'c-kite-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: 'GPS-denied flight is the hard part — stereo optical flow on an MCU is a bold choice.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-aetherpay',
    name: 'AetherPay Protocol',
    tagline: 'Streaming micro-settlements with verifiable auditing',
    description:
      'Continuous financial streaming for pay-as-you-go APIs, freelancer payroll, and bandwidth exchange.',
    fullDescription:
      'A concept for per-second micro-settlement channels suited to pay-per-token inference, IoT sensor feeds, and continuous creator salaries.',
    creator: {
      name: 'Tomas Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'FinTech Architect',
      handle: '@demo_tomas',
    },
    category: 'FinTech',
    tags: ['FinTech', 'Cryptography', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    likes: 61,
    views: 870,
    featured: true,
    trending: false,
    launchedAt: 'Showcase',
    demoUrl: '/demos/saas.html',
    techStack: ['Rust', 'TypeScript', 'Node.js'],
    comments: [
      {
        id: 'c-aether-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        text: 'Per-second settlement for API metering makes a lot of sense for inference billing.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-chronicle',
    name: 'Chronicle Code Editor',
    tagline: 'Time-traveling collaborative IDE with visual history',
    description:
      'Inspect any state of your codebase across branching timelines with live peer cursors.',
    fullDescription:
      'A concept for visualizing source history as an interactive graph — scrub branches, rewind compile states, and replay bug reproductions.',
    creator: {
      name: 'Aisha Bello',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'Developer Tooling Engineer',
      handle: '@demo_aisha',
    },
    category: 'Web Development',
    tags: ['Developer Tools', 'Collaboration', 'Electron'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    likes: 118,
    views: 1620,
    featured: false,
    trending: true,
    launchedAt: 'Showcase',
    demoUrl: '/demos/devshowcase.html',
    techStack: ['Electron', 'React', 'Rust'],
    comments: [
      {
        id: 'c-chron-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Rewinding a compile state to replay a bug report is exactly what my team needs.',
        createdAt: 'Sample feedback',
      },
      {
        id: 'c-chron-2',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'The branch graph UI looks approachable even for non-git users.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-hyperion',
    name: 'Hyperion Space Simulator',
    tagline: 'Physically precise orbital mechanics game in WebGL',
    description:
      'Design spacecraft, compute gravity slingshots, and simulate exoplanets in your browser.',
    fullDescription:
      'A concept bridging astrophysics simulation and graphical artistry — compute Lagrange points, plan trajectories, and build orbital networks.',
    creator: {
      name: 'Diego Ferreira',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Indie Game Director',
      handle: '@demo_diego',
    },
    category: 'Gaming',
    tags: ['Gaming', 'WebGL', 'Physics'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    likes: 102,
    views: 1440,
    featured: true,
    trending: true,
    launchedAt: 'Showcase',
    demoUrl: '/demos/portfolio.html',
    techStack: ['Three.js', 'TypeScript', 'GLSL'],
    comments: [
      {
        id: 'c-hyper-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'Real Lagrange point math in a browser tab — beautifully nerdy.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-prism',
    name: 'Prism Design Tokens Studio',
    tagline: 'Bi-directional Figma to Tailwind & CSS sync engine',
    description:
      'Automated token pipelines that compile typography, color ramps, and components across platforms.',
    fullDescription:
      'A concept that watches design variables, generates typed tokens, and validates accessibility contrast during pull requests.',
    creator: {
      name: 'Yuki Tanaka',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'Design Technologist',
      handle: '@demo_yuki',
    },
    category: 'Design',
    tags: ['Design Systems', 'Figma', 'Automation'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    likes: 54,
    views: 760,
    featured: false,
    trending: false,
    launchedAt: 'Showcase',
    demoUrl: '/demos/saas.html',
    techStack: ['Next.js', 'Tailwind CSS', 'Figma API'],
    comments: [
      {
        id: 'c-prism-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Contrast checks running in CI would have caught our last two a11y regressions.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-synapse',
    name: 'Synapse Learn',
    tagline: 'Interactive 3D biology & neuroanatomy learning lab',
    description:
      'Explore synaptic transmissions and cellular biology through interactive 3D simulations.',
    fullDescription:
      'A concept turning dense textbook diagrams into explorable 3D models with spatial micro-challenges.',
    creator: {
      name: 'Naomi Okafor',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'EdTech Educator',
      handle: '@demo_naomi',
    },
    category: 'Education',
    tags: ['STEM', 'EdTech', '3D Anatomy'],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    likes: 68,
    views: 910,
    featured: false,
    trending: true,
    launchedAt: 'Showcase',
    demoUrl: '/demos/education.html',
    techStack: ['React', 'Three.js', 'TypeScript'],
    comments: [
      {
        id: 'c-syn-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'Spatial micro-challenges beat flashcards for anatomy every time.',
        createdAt: 'Sample feedback',
      },
      {
        id: 'c-syn-2',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        text: 'The synaptic transmission sim made a genuinely tricky concept click for me.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-omniflux',
    name: 'OmniFlux Edge Mesh',
    tagline: 'P2P distributed runtime with sub-10ms edge caching',
    description:
      'Deploy WASM microservices that run on user devices and distributed edge nodes.',
    fullDescription:
      'A concept for decentralizing the edge — code compiles to lightweight WebAssembly sandboxes that run peer-to-peer near end users.',
    creator: {
      name: 'Ivan Petrov',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'Distributed Systems Architect',
      handle: '@demo_ivan',
    },
    category: 'Open Source',
    tags: ['Wasm', 'P2P', 'Edge Computing'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    likes: 88,
    views: 1240,
    featured: true,
    trending: false,
    launchedAt: 'Showcase',
    demoUrl: '/demos/devshowcase.html',
    techStack: ['Rust', 'WebAssembly', 'libp2p'],
    comments: [
      {
        id: 'c-omni-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: 'Running services peer-to-peer on user devices is an interesting answer to edge costs.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
  {
    id: 'sample-pulseflow',
    name: 'PulseFlow Mobile',
    tagline: 'Haptic-first biometric training companion with on-device ML',
    description:
      'Turn wrist movements and accelerometer signals into personalized training cues on-device.',
    fullDescription:
      'A concept using on-device models to analyze running posture and lifting form, coaching through haptic feedback.',
    creator: {
      name: 'Sofia Marchetti',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Mobile ML Engineer',
      handle: '@demo_sofia',
    },
    category: 'Mobile',
    tags: ['iOS', 'CoreML', 'HealthTech'],
    image: 'https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800&auto=format&fit=crop&q=80',
    likes: 47,
    views: 680,
    featured: false,
    trending: false,
    launchedAt: 'Showcase',
    demoUrl: '/demos/portfolio.html',
    techStack: ['SwiftUI', 'CoreML', 'Metal'],
    comments: [
      {
        id: 'c-pulse-1',
        author: 'Demo Reader',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'Haptic form cues could fix the phone-staring problem mid-set.',
        createdAt: 'Sample feedback',
      },
    ],
    isSample: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Founder & CEO',
    company: 'VoxelMind AI',
    project: 'VoxelMind Spatial Studio',
    text: 'Launching connected us directly with early beta users and an lead investor within 48 hours. The community feedback quality is ahead of traditional launch sites.',
    rating: 5,
    metric: 'Early signups in 48 hrs',
  },
  {
    id: 't2',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Core Contributor',
    company: 'Turbine Engine',
    project: 'Turbine Edge WebAssembly',
    text: 'We went from an obscure repo to trending across the tech sphere. The 3D presentation and deep creator profiles gave our project the stage it deserved.',
    rating: 5,
    metric: 'Strong GitHub traction',
  },
  {
    id: 't3',
    name: 'Camila Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Product Designer & Builder',
    company: 'Forma Studio',
    project: 'Forma Design Tokenizer',
    text: 'The feedback we received helped us iron out UI flaws before our enterprise release. A premier launching ground for anyone building what comes next.',
    rating: 5,
    metric: 'Enterprise beta interest',
  },
];
