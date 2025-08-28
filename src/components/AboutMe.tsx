import React, { useState, useEffect } from 'react';

const AboutMe: React.FC = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedSections, setDisplayedSections] = useState<number[]>([]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progressive loading of sections
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSections([0, 1, 2, 3, 4, 5]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      title: "INTRODUCTION",
      command: "whoami",
      content: [
        "Hi, I'm Sugam Adhikari — a passionate developer and lifelong learner based in Kathmandu, Nepal.",
        "Currently pursuing BSc (Hons) in Data Science at Birmingham City University via Sunway International College.",
        "Building innovative applications at the intersection of Web3 and AI, with expertise in data science, blockchain technologies, and modern web development."
      ]
    },
    {
      title: "PROFESSIONAL_JOURNEY",
      command: "ls -la ~/experience/",
      content: [
        "[July 2025 - Present] Full-stack Developer",
        "  └─ Building multi-vendor e-commerce platform with Next.js & MongoDB",
        "",
        "[March 2025 - June 2025] Blockchain Developer Intern @ Clock b Business Technology", 
        "  └─ Contributed to NovaChain DeFi project (swap, lending, staking)",
        "",
        "[December 2024 - February 2025] Blockchain Trainee",
        "  └─ Developed lottery DApp and NFT auction platform"
      ]
    },
    {
      title: "TECHNICAL_SKILLS",
      command: "cat ~/.skillset",
      content: [
        "Frontend     :: React.js | Next.js | Tailwind CSS | TypeScript | Flutter",
        "Blockchain   :: Solidity | Web3.js | ethers.js | DApps",
        "Data Science :: Python | R | Power BI | Data Visualization", 
        "Backend      :: Node.js | MongoDB | Express | APIs | Django | Firebase",
        "DevOps       :: Docker | Azure | Git | CI/CD",
        "AI/ML        :: Machine Learning | AI Integration"
      ]
    },
    {
      title: "INTERESTS",
      command: "grep -r interests ~/profile/",
      content: [
        "Technical:",
        "  ├─ Decentralized Applications & Web3 ecosystems",
        "  ├─ AI/ML integration in web applications", 
        "  ├─ Data-driven insights and visualization",
        "  └─ Scalable frontend architectures",
        "",
        "Personal:",
        "  ├─ Fitness & Sports for discipline and balance",
        "  ├─ Poems & Drawings for creativity and inspiration", 
        "  └─ Continuous Learning & personal growth"
      ]
    },
    {
      title: "GOALS_AND_MISSION",
      command: "echo $MISSION",
      content: [
        "Primary Goal  :: Create innovative, user-centric applications",
        "Focus Areas   :: Web3 | AI | Data Science | Blockchain Ecosystems", 
        "Values        :: Adaptability | Continuous Learning | Collaboration",
        "Mission       :: Bridge the gap between data-driven insights and functional applications"
      ]
    }
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6 min-h-screen">
      {/* Terminal header */}
      <div className="mb-6">
        <div className="text-green-400">
          {`┌─────────────────────────────────────────────────────────────┐
│                      ABOUT SUGAM ADHIKARI                   │
└─────────────────────────────────────────────────────────────┘`}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          displayedSections.includes(idx) && (
            <div key={idx} className="space-y-2">
              {/* Command prompt */}
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <span className="text-white">{section.command}</span>
              </div>
              
              {/* Section content */}
              <div className="ml-4 border-l-2 border-green-400/30 pl-4 space-y-1">
                {section.content.map((line, lineIdx) => (
                  <div key={lineIdx} className="text-gray-300">
                    {line === "" ? (
                      <div className="h-3"></div>
                    ) : line.includes("::") ? (
                      <div>
                        <span className="text-yellow-400">
                          {line.split("::")[0]}
                        </span>
                        <span className="text-gray-400">::</span>
                        <span className="text-gray-200">
                          {line.split("::")[1]}
                        </span>
                      </div>
                    ) : line.includes("|") ? (
                      <div>
                        {line.split("|").map((part, partIdx) => (
                          <span key={partIdx}>
                            {partIdx > 0 && <span className="text-gray-500"> | </span>}
                            <span className="text-cyan-300">{part.trim()}</span>
                          </span>
                        ))}
                      </div>
                    ) : line.startsWith("[") ? (
                      <div className="text-white font-semibold">{line}</div>
                    ) : line.includes("└─") || line.includes("├─") ? (
                      <div className="text-yellow-400">{line}</div>
                    ) : line.includes(":") && (line.includes("Technical") || line.includes("Personal")) ? (
                      <div className="text-white font-semibold">{line}</div>
                    ) : (
                      <div className="text-gray-200">{line}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-400/30">
        <div className="space-y-2">
          <div className="ml-4 text-gray-300 p-3 rounded">
            <div className="text-cyan-300 font-bold mb-2">Let's Connect!</div>
            <div className="space-y-1">
              <div>→ Thanks for exploring my profile!</div>
              <div>→ Feel free to reach out for collaborations or just to connect!</div>
              <div>→ Type <span className="bg-gray-800 text-yellow-400 px-1 rounded">contact</span> to get in touch</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <span className="text-gray-400">echo "Ready to build something amazing together!"</span>
        </div>
      </div>


    </div>
  );
};

export default AboutMe;