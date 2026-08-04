export const profile = {
  name: "Sugam Adhikari",
  title: "Full-stack · Web3 · Data Science",
  location: "Kathmandu, Nepal",
  tagline:
    "Building at the intersection of Web3 and AI — data-driven apps with modern web and blockchain stacks.",
  education:
    "BSc (Hons) Data Science at Birmingham City University via Sunway International College.",
  mission:
    "Bridge the gap between data-driven insights and functional applications.",
};

export const experience = [
  {
    role: "Full-stack Developer",
    period: "July 2025 – Present",
    detail: "Multi-vendor e-commerce platform with Next.js & MongoDB",
  },
  {
    role: "Blockchain Developer Intern",
    org: "Clock b Business Technology",
    period: "March 2025 – June 2025",
    detail: "NovaChain DeFi — swap, lending, staking",
  },
  {
    role: "Blockchain Trainee",
    period: "December 2024 – February 2025",
    detail: "Lottery DApp and NFT auction platform",
  },
];

export type Project = {
  name: string;
  tech: string[];
  role: string;
  period: string;
  /** One-line hook — what matters most */
  summary: string;
  /** Longer body for the projects section */
  description: string;
  highlights?: string[];
  link: string | null;
};

export const projects: Project[] = [
  {
    name: "Multi-vendor E-commerce Platform",
    tech: ["Next.js", "MongoDB", "TypeScript", "TailwindCSS"],
    role: "Full-stack Developer",
    period: "July 2025 – Present",
    summary: "Marketplace for vendors, orders, and payments.",
    description: "Next.js multi-vendor storefront with MongoDB catalogs and role-based seller / buyer flows.",
    highlights: ["Vendor dashboards · orders · payouts"],
    link: null,
  },
  {
    name: "NovaChain DeFi",
    tech: ["Solidity", "React", "Hardhat", "Ethers.js"],
    role: "Blockchain Developer Intern",
    period: "March 2025 – June 2025",
    summary: "Swap, lending, and staking with tested contracts.",
    description: "DeFi modules in Solidity + Hardhat, wired to a React wallet UI.",
    highlights: ["Swap · lend · stake on-chain"],
    link: null,
  },
  {
    name: "Lottery DApp & NFT Auction",
    tech: ["Solidity", "Next.js", "Web3.js", "IPFS"],
    role: "Blockchain Trainee",
    period: "Dec 2024 – Feb 2025",
    summary: "On-chain lottery draws and NFT auctions.",
    description: "Transparent lottery + auction DApp with IPFS metadata and Next.js wallet UI.",
    highlights: ["List → bid → settle on-chain"],
    link: null,
  },
  {
    name: "Blockchain Product List DApp",
    tech: ["TypeScript", "Solidity", "React"],
    role: "Developer",
    period: "2024",
    summary: "Product listings owned by smart contracts.",
    description: "Catalog and ownership live on-chain; React client for list and transfer.",
    highlights: ["Contract-owned catalog"],
    link: "https://github.com/sugamadhikari11/Blockchain-ProductList-Dapp",
  },
  {
    name: "Streamlit Model Visualization",
    tech: ["Python", "Streamlit"],
    role: "Developer",
    period: "2024",
    summary: "ML metrics and model comparison dashboards.",
    description: "Streamlit app for charts, metrics, and model comparisons.",
    highlights: ["Interactive metric views"],
    link: "https://github.com/sugamadhikari11/Streamlit-model-visualization-webapp",
  },
  {
    name: "Admin Flight Booking System",
    tech: ["Java"],
    role: "Developer",
    period: "2024",
    summary: "Flight search, booking, and admin CRUD.",
    description: "Java booking system with schedules, passengers, and admin tools.",
    link: "https://github.com/sugamadhikari11/Admin_Based_Flight_Booking_System",
  },
  {
    name: "Sales Management",
    tech: ["PHP", "MySQL"],
    role: "Developer",
    period: "2024",
    summary: "Sales, inventory, and ops reporting.",
    description: "PHP + MySQL sales and inventory tracker with reports.",
    link: "https://github.com/sugamadhikari11/Sales_Management",
  },
];

export const skillCategories = [
  {
    name: "Frontend",
    skills: ["React.js", "Next.js", "TypeScript", "3D Web", "Tailwind CSS"],
  },
  {
    name: "AI & Agents",
    skills: ["AI Integrations", "MCP Integration", "Machine Learning", "Python", "Visualization"],
  },
  {
    name: "Blockchain",
    skills: ["Solidity", "Web3.js", "ethers.js", "DApps", "Smart Contracts"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "PHP", "Django", "MongoDB", "Social Integration"],
  },
  {
    name: "DevOps & Cloud",
    skills: ["CI/CD", "Azure", "AWS", "Docker", "cPanel"],
  },
];

export const contacts = [
  {
    label: "Email",
    value: "sugam.19217113@gmail.com",
    href: "mailto:sugam.19217113@gmail.com",
  },
  {
    label: "GitHub",
    value: "sugamadhikari11",
    href: "https://github.com/sugamadhikari11",
  },
  {
    label: "LinkedIn",
    value: "sugamadhikari",
    href: "https://www.linkedin.com/in/sugamadhikari/",
  },
];
