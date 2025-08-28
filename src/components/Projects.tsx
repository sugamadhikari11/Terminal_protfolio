import React, { useState, useEffect } from 'react';

const Projects: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const projects = [
    {
      name: "Multi-vendor E-commerce Platform",
      tech: ["Next.js", "MongoDB", "TypeScript", "TailwindCSS"],
      role: "Full-stack Developer",
      period: "July 2025 - Present",
      description: "Building a scalable e-commerce platform enabling multiple vendors to manage products, orders, and payments seamlessly.",
      link: null
    },
    {
      name: "NovaChain DeFi Project",
      tech: ["Solidity", "React", "Hardhat", "Ethers.js"],
      role: "Blockchain Developer Intern",
      period: "March 2025 - June 2025",
      description: "Contributed to DeFi modules: swap, lending, and staking. Focused on smart contract logic and protocol security.",
      link: null
    },
    {
      name: "Lottery DApp & NFT Auction Platform",
      tech: ["Solidity", "Next.js", "Web3.js", "IPFS"],
      role: "Blockchain Trainee",
      period: "Dec 2024 - Feb 2025",
      description: "Developed decentralized lottery and NFT auction systems supporting transparent draws and on-chain asset transfers.",
      link: null
    },
    {
      name: "Blockchain-ProductList-Dapp",
      tech: ["TypeScript", "Solidity", "React"],
      role: "Developer",
      period: "2024",
      description: "Blockchain-based product listing application. Implements smart contracts for transparent product management and ownership transfer.",
      link: "https://github.com/sugamadhikari11/Blockchain-ProductList-Dapp"
    },
    {
      name: "Streamlit-model-visualization-webapp",
      tech: ["Python", "Streamlit"],
      role: "Developer",
      period: "2024",
      description: "Web application for visualizing machine learning models and their performance.",
      link: "https://github.com/sugamadhikari11/Streamlit-model-visualization-webapp"
    },
    {
      name: "Admin_Based_Flight_Booking_System",
      tech: ["Java"],
      role: "Developer",
      period: "2024",
      description: "Flight booking system with admin management functionalities.",
      link: "https://github.com/sugamadhikari11/Admin_Based_Flight_Booking_System"
    },
    {
      name: "Sales_Management",
      tech: ["PHP", "MySQL"],
      role: "Developer",
      period: "2024",
      description: "Sales management application for handling product sales, inventory, and reporting.",
      link: "https://github.com/sugamadhikari11/Sales_Management"
    }
  ];

  const terminalText = `
┌─────────────────────────────────────────────────────────────┐
│                        PROJECT PORTFOLIO                    │
└─────────────────────────────────────────────────────────────┘

$ ls -la ~/projects/
total ${projects.length}
drwxr-xr-x  ${projects.length + 2} user  staff   ${projects.length * 64}B $(date)
drwxr-xr-x    5 user  staff   160B $(date) ..
`;

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400';
      case 'In Progress': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };



  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6 min-h-screen">
      <div className="mb-4">
        <div className="text-green-400">
          {terminalText}
        </div>
      </div>

      {/* Project listings */}
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div key={idx} className="border-l-2 border-green-400/30 pl-4 hover:border-green-400/60 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <span className="text-white font-bold">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 underline decoration-dotted"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </span>
              </div>
            </div>
            
            <div className="ml-4 space-y-1 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">├─</span>
                <span className="text-gray-400">Role:</span>
                <span>{project.role}</span>
                <span className="text-gray-500">({project.period})</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">├─</span>
                <span className="text-gray-400">Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIdx) => (
                    <span key={techIdx} className="text-cyan-300 px-2 py-0.5 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">└─</span>
                <span className="text-gray-400">Description:</span>
                <span className="text-gray-200">{project.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal footer */}
      <div className="mt-8 pt-4 border-t border-green-400/30">
        <div className="space-y-2">
          <div className="ml-4 text-gray-300  p-3 rounded">
            <div className="text-cyan-300 font-bold mb-2">Want to explore more?</div>
            <div className="space-y-1">
              <div>→ Check out my <a href="https://github.com/sugamadhikari11" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">GitHub profile</a> for complete repositories</div>
              <div>→ Contact me for collaboration opportunities</div>
              <div>→ Type <span className="bg-gray-800 text-yellow-400 px-1 rounded">contact</span> to get in touch!</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <span className="text-gray-400">echo "Thanks for visiting my projects!"</span>
        </div>
      </div>
    </div>
  );
};

export default Projects;