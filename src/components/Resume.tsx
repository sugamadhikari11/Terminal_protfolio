import React, { useState, useEffect } from 'react';

const Resume: React.FC = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedSections, setDisplayedSections] = useState<number[]>([]);
  const [downloading, setDownloading] = useState(false);

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
      setDisplayedSections([0, 1, 2, 3]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    // Generate PDF content as text (in real implementation, you'd use a PDF library)
    const resumeContent = `
SUGAM ADHIKARI
Data Science Student & Full-Stack Developer
Email: sugam.19217113@gmail.com
LinkedIn: linkedin.com/in/sugamadhikari
GitHub: github.com/sugamadhikari11
Location: Kathmandu, Nepal

EDUCATION
BSc (Hons) in Data Science
Birmingham City University via Sunway International College
2023 - Present

PROFESSIONAL EXPERIENCE

Full-stack Developer (July 2025 - Present)
• Building multi-vendor e-commerce platform with Next.js & MongoDB
• Implementing scalable architecture for multiple vendor management
• Developing payment integration and order management systems

Blockchain Developer Intern @ Clock b Business Technology (March 2025 - June 2025)
• Contributed to NovaChain DeFi project (swap, lending, staking)
• Focused on smart contract logic and protocol security
• Collaborated with cross-functional teams on blockchain solutions

Blockchain Trainee (December 2024 - February 2025)
• Developed lottery DApp and NFT auction platform
• Implemented transparent draws and on-chain asset transfers
• Built decentralized systems using Solidity and Web3.js

TECHNICAL SKILLS

Frontend: React.js, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, Responsive Design
Blockchain: Solidity, Web3.js, ethers.js, Smart Contracts, DApps, MetaMask Integration, NFT Development
Data Science: Python, R, Power BI, Data Visualization, Statistical Analysis, Machine Learning
Backend: Node.js, Express.js, MongoDB, RESTful APIs, Database Design, Firebase, Django, Authentication, JWT
AI/ML: Machine Learning, AI Integration, Data Processing, Model Deployment
Tools: Git, VS Code, PyCharm, Figma, Docker, Linux, Firebase, Vercel, Azure, GitHub

KEY PROJECTS
• Multi-vendor E-commerce Platform (Next.js, MongoDB, TypeScript)
• NovaChain DeFi Project (Solidity, React, Hardhat, Ethers.js)
• House Price Prediction Kathmandu (Python, Machine Learning)
• Blockchain Product List DApp (TypeScript, Solidity, React)
• NFT Auction Platform (Solidity, Next.js, Web3.js, IPFS)

ACHIEVEMENTS
• 2+ years of development experience across multiple domains
• Specialized in Web3 and DeFi application development
• Experience with scalable e-commerce platform architecture
• Data science projects with real-world business applications
• Continuous learner adapting to emerging technologies
`;

    // Create and download the file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Sugam_Adhikari_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 2000);
  };

  const handleViewOnline = () => {
    // In a real implementation, this would open a formatted resume view
    alert('Online resume viewer would open here. For now, please use the download option.');
  };

  const sections = [
    {
      command: "ls -la ~/documents/resume/",
      content: "resume.pdf    updated: Aug 2025    size: 2.3MB    status: ✅ CURRENT"
    },
    {
      command: "head -20 ~/documents/resume/highlights.md",
      content: [
        {
          title: "EXPERIENCE",
          items: [
            "Full-stack Developer (July 2025 - Present)",
            "Blockchain Developer Intern @ Clock b (March 2025 - June 2025)", 
            "Blockchain Trainee (Dec 2024 - Feb 2025)"
          ]
        },
        {
          title: "EDUCATION",
          items: [
            "BSc (Hons) in Data Science",
            "Birmingham City University via Sunway International College",
            "2023 - Present"
          ]
        },
        {
          title: "KEY ACHIEVEMENTS",
          items: [
            "2+ years development experience across multiple domains",
            "Specialized in Web3 and DeFi application development",
            "Experience with scalable e-commerce platform architecture",
            "Data science projects with real-world applications"
          ]
        }
      ]
    }
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6">
      {/* Terminal header */}
      <div className="mb-6">
        <div className="text-green-400">
          {`┌─────────────────────────────────────────────────────────────┐
│                          RESUME                              │
└─────────────────────────────────────────────────────────────┘`}
        </div>
      </div>

      {/* Resume actions */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400">$</span>
          <span className="text-white">./resume --help</span>
        </div>
        <div className="ml-4 border-l-2 border-green-400/30 pl-4 space-y-3">
          <div className="text-gray-300 mb-4">Available resume operations:</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-400 text-green-400 rounded hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? 'Generating...' : 'Download Resume'}
            </button>
            <button 
              onClick={handleViewOnline}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-600/30 transition-colors"
            >
              View Online
            </button>
          </div>
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
              <div className="ml-4 border-l-2 border-green-400/30 pl-4">
                {typeof section.content === 'string' ? (
                  <div className="text-gray-300 bg-gray-900/30 p-2 rounded font-mono text-xs">
                    {section.content}
                  </div>
                ) : Array.isArray(section.content) ? (
                  <div className="space-y-4">
                    {section.content.map((category, catIdx) => (
                      <div key={catIdx}>
                        <div className="text-yellow-400 font-bold mb-2">{category.title}</div>
                        <div className="space-y-1">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-2">
                              <span className="text-green-400">▸</span>
                              <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-300">{section.content}</div>
                )}
              </div>
            </div>
          )
        ))}
      </div>


      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-400/30">
        <div className="space-y-2">
          <div className="ml-4 text-gray-300 p-3">
            <div className="text-cyan-300 font-bold mb-2">Professional Summary</div>
            <div className="space-y-1 text-sm">
              <div>→ Data Science student with 2+ years development experience</div>
              <div>→ Specialized in Web3, blockchain, and full-stack development</div>
              <div>→ Ready for new opportunities and collaborations</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Resume;